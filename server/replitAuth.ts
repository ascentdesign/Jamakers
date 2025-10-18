// Reference: blueprint:javascript_log_in_with_replit (replaced with local auth)

import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import { Strategy as LocalStrategy } from "passport-local";
import MemoryStoreFactory from "memorystore";
import { storage } from "./storage";
import * as openid from "openid-client";
import connectPgSimple from "connect-pg-simple";

// Local session store using MemoryStore to remove external DB dependency
export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const MemoryStore = MemoryStoreFactory(session);
  const isProd = process.env.NODE_ENV === "production";
  const hasDb = !!process.env.DATABASE_URL;

  let sessionStore: any;
  if (isProd && hasDb) {
    const PgStore = connectPgSimple(session);
    sessionStore = new PgStore({
      conString: process.env.DATABASE_URL as string,
      createTableIfMissing: true,
      tableName: "session",
    });
  } else {
    sessionStore = new MemoryStore({
      checkPeriod: sessionTtl,
    });
  }

  return session({
    secret: process.env.SESSION_SECRET || "dev-session-secret",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: sessionTtl,
    },
  });
}

// Helper to create our user object shape compatible with existing routes
function createUserSession({
  id,
  email,
  firstName,
  lastName,
  profileImageUrl,
}: {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
}) {
  const expSeconds = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60; // 30 days
  return {
    claims: {
      sub: id,
      email,
      first_name: firstName,
      last_name: lastName,
      profile_image_url: profileImageUrl,
      exp: expSeconds,
    },
    expires_at: expSeconds,
  };
}

function getBaseUrl(req: any) {
  const proto = (req.headers["x-forwarded-proto"] as string) || req.protocol || "http";
  const host = (req.headers["x-forwarded-host"] as string) || req.get("host");
  return `${proto}://${host}`;
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  // Seed demo user for QA: admin (brand)
  await storage.upsertUser({
    id: "admin",
    email: "admin@example.com",
    firstName: "Admin",
    lastName: "Demo",
    role: "brand",
    currency: "USD",
  } as any);

  // Simple local strategy: accepts any username/password for dev purposes.
  passport.use(
    new LocalStrategy(
      { usernameField: "username", passwordField: "password", passReqToCallback: true },
      async (req, username, _password, done) => {
        try {
          // Optional role provided by client: manufacturer | brand | admin | creator | designer
          const role = (req.body?.role as string | undefined) || "brand";
          const id = username || `user-${Math.random().toString(36).slice(2)}`;

          // Upsert into our storage for compatibility
          const userRecord = await storage.upsertUser({
            id,
            email: req.body?.email,
            firstName: req.body?.firstName || username,
            lastName: req.body?.lastName,
            profileImageUrl: req.body?.profileImageUrl,
            role: role as any,
          } as any);

          const user = createUserSession({
            id: userRecord.id,
            email: userRecord.email || req.body?.email,
            firstName: userRecord.firstName,
            lastName: userRecord.lastName,
            profileImageUrl: userRecord.profileImageUrl,
          });

          return done(null, user);
        } catch (err) {
          return done(err as any);
        }
      }
    )
  );

  passport.serializeUser((user: Express.User, cb) => cb(null, user));
  passport.deserializeUser((user: Express.User, cb) => cb(null, user));

  // Maintain existing endpoints but switch to local behavior
  app.get("/api/login", (req, res) => {
    // Provide a simple message and how to login for dev
    res.status(200).json({
      message: "Use POST /api/login with { username, password, role } to sign in locally.",
    });
  });

  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err, user) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: "Invalid credentials" });
      req.logIn(user, (err) => {
        if (err) return next(err);
        return res.json({ success: true });
      });
    })(req, res, next);
  });

  app.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect("/");
    });
  });

  // Google OAuth using openid-client (optional; requires env vars)
  app.get("/api/auth/google", async (req, res, next) => {
    try {
      const clientId = process.env.GOOGLE_CLIENT_ID;
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
      if (!clientId || !clientSecret) {
        return res.status(501).json({
          message: "Google authentication not configured.",
          hint: "Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in environment.",
        });
      }

      const googleIssuer = await openid.Issuer.discover("https://accounts.google.com");
      const redirectUri = `${getBaseUrl(req)}/api/auth/google/callback`;
      const client = new googleIssuer.Client({
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uris: [redirectUri],
        response_types: ["code"],
      });

      const codeVerifier = openid.generators.codeVerifier();
      const codeChallenge = openid.generators.codeChallenge(codeVerifier);
      (req.session as any).codeVerifier = codeVerifier;

      const authUrl = client.authorizationUrl({
        scope: "openid email profile",
        code_challenge: codeChallenge,
        code_challenge_method: "S256",
        prompt: "consent",
      });
      res.redirect(authUrl);
    } catch (err) {
      next(err);
    }
  });

  app.get("/api/auth/google/callback", async (req: any, res, next) => {
    try {
      const clientId = process.env.GOOGLE_CLIENT_ID;
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
      if (!clientId || !clientSecret) {
        return res.status(501).json({ message: "Google authentication not configured." });
      }

      const googleIssuer = await openid.Issuer.discover("https://accounts.google.com");
      const redirectUri = `${getBaseUrl(req)}/api/auth/google/callback`;
      const client = new googleIssuer.Client({
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uris: [redirectUri],
        response_types: ["code"],
      });

      const params = client.callbackParams(req);
      const tokenSet = await client.callback(redirectUri, params, {
        code_verifier: (req.session as any).codeVerifier,
      });
      const userinfo: any = await client.userinfo(tokenSet);

      const id = `google-${userinfo.sub}`;
      const role = "brand"; // default role for Google users
      const userRecord = await storage.upsertUser({
        id,
        email: userinfo.email,
        firstName: userinfo.given_name || "Google User",
        lastName: userinfo.family_name,
        profileImageUrl: userinfo.picture,
        role: role as any,
      } as any);

      const user = createUserSession({
        id: userRecord.id,
        email: userRecord.email,
        firstName: userRecord.firstName,
        lastName: userRecord.lastName,
        profileImageUrl: userRecord.profileImageUrl,
      });

      req.logIn(user, (err) => {
        if (err) return next(err);
        res.redirect("/");
      });
    } catch (err) {
      next(err);
    }
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const user = req.user as any;
  if (!req.isAuthenticated() || !user?.claims?.sub) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  return next();
};
