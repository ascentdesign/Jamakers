# Deploying Jamakers v0.3.0

This guide walks through deploying Jamakers v0.3.0 using the release assets and configuring runtime environment.

## Prerequisites
- Node.js `20.x`
- A Postgres database (PG 15+ recommended) with `pgcrypto` extension available
- Access to the `v0.3.0` release assets
- Network access to your DB from the app host

## Release Assets
- `jamakers-v0.3.0-server-bundle.zip` (recommended)
  - Includes: `dist/index.js`, `package.json`, `package-lock.json`, `migrations/`
  - Best for production deployment and applying migrations
- `jamakers-v0.3.0-client.zip`
  - Contents of `dist/public` for static hosting
- `jamakers-v0.3.0-server.zip`
  - `dist/index.js` only (you must provide repo `package.json` and install dependencies)
- `jamakers-v0.3.0-dist.zip`
  - Combined `dist/` (server + client); does not include `package.json` or `migrations/`

## Environment Variables
- Core
  - `NODE_ENV`: `production` for prod, `development` for local dev (enables Vite)
  - `PORT`: port to listen on (default `5000`)
  - `SESSION_SECRET`: session cookie secret (required in production)
- Database
  - `DATABASE_URL`: Postgres connection string (required for DB-backed storage)
  - `PGPOOL_MAX`: pool size (default `10`)
  - `PG_IDLE_TIMEOUT_MS`: idle timeout in ms (default `30000`)
  - `PG_CONN_TIMEOUT_MS`: connection timeout in ms (default `5000`)
  - TLS options (use one of):
    - `DATABASE_SSL_CA`: PEM CA bundle string (use `\n` for line breaks)
    - `PG_SSL=true` or `DATABASE_SSL=true`
    - Include `sslmode=require|verify-ca|verify-full` in `DATABASE_URL`
- Object Storage (filesystem-based)
  - `PUBLIC_OBJECT_SEARCH_PATHS`: comma-separated absolute or relative paths for public files (default `./public_objects`)
  - `PRIVATE_OBJECT_DIR`: directory for private objects (default `./private_objects`)
- Optional OAuth (Google)
  - `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` (only if enabling Google login)

## Deployment Option A: Enhanced Server Bundle (recommended)
1. Download `jamakers-v0.3.0-server-bundle.zip` and extract to a clean directory.
2. Install dependencies:
   - Do NOT set `NODE_ENV=production` during install if you plan to run migrations.
   - Run: `npm ci`
3. Configure environment:
   - Set `DATABASE_URL` to your Postgres instance.
   - If your DB requires TLS, set `DATABASE_SSL_CA` (preferred) or `PG_SSL=true`.
   - Set `SESSION_SECRET` to a strong random value.
4. Apply migrations:
   - Run: `npm run db:push` (Drizzle CLI will apply `migrations/`)
   - Ensure the `pgcrypto` extension is available on your DB.
5. Start the app:
   - Set `NODE_ENV=production` and optionally `PORT=5000`
   - Run: `node dist/index.js`
6. Verify:
   - Open `http://localhost:<PORT>/` for the app
   - Basic flow: Brand creation page at `/brands/create`

## Deployment Option B: Client-only Static Hosting
1. Download and extract `jamakers-v0.3.0-client.zip`.
2. Host the contents of `dist/public` on any static server or CDN.
3. If you also run the server, configure it to serve static assets from `dist/public` or point your reverse-proxy/CDN to the static host.

## Deployment Option C: Server-only Bundle
1. Download and extract `jamakers-v0.3.0-server.zip`.
2. Ensure you have the repo `package.json` available and run `npm ci` to install dependencies.
3. Follow the environment and migration steps as in Option A.
4. Start with `NODE_ENV=production node dist/index.js`.

## Operational Notes
- Storage selection:
  - If `DATABASE_URL` is set, the app uses DB-backed storage; otherwise it falls back to in-memory storage.
- Static assets in production:
  - The server serves from `dist/public` when `NODE_ENV !== 'development'`.
  - If `dist/public` is not present, use the client-only zip or host externally.
- Sessions:
  - In production with `DATABASE_URL` set, sessions use Postgres (`connect-pg-simple`).
  - In development or without DB, sessions use in-memory store (not persisted).
- Logging:
  - API requests log method, path, status, and response summary.

## Troubleshooting
- Cannot connect to DB:
  - Verify `DATABASE_URL` and network access.
  - If TLS is required, prefer `DATABASE_SSL_CA` with PEM content; otherwise set `PG_SSL=true`.
  - Increase `PG_CONN_TIMEOUT_MS` for slow networks.
- Static files 404 in production:
  - Ensure `dist/public` exists; rebuild client with `npm run build`.
- Vite dev mode:
  - `NODE_ENV=development` enables Vite middleware and hot reload; use for local dev only.

## Example PowerShell Setup (Windows)
```powershell
$env:DATABASE_URL = "postgres://user:pass@host:5432/dbname?sslmode=require"
$env:DATABASE_SSL_CA = (Get-Content "C:\\path\\to\\ca.pem") -replace "`r?`n", "\n"
$env:SESSION_SECRET = "replace-with-strong-secret"
$env:NODE_ENV = "production"
$env:PORT = "5000"
node dist/index.js
```

## Support
If you encounter issues deploying `v0.3.0`, open a GitHub issue on the repository and include logs and environment details.