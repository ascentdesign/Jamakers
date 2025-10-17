// Reference: blueprint:javascript_log_in_with_replit (replaced with local auth)

import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import { Strategy as LocalStrategy } from "passport-local";
import MemoryStoreFactory from "memorystore";
import { storage } from "./storage";

// Local session store using MemoryStore to remove external DB dependency
export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const MemoryStore = MemoryStoreFactory(session);
  const sessionStore = new MemoryStore({
    checkPeriod: sessionTtl,
  });

  return session({
    secret: process.env.SESSION_SECRET || "dev-session-secret",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
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

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

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
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const user = req.user as any;
  if (!req.isAuthenticated() || !user?.claims?.sub) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  return next();
};
