import fs from "fs";
import path from "path";
import pg from "pg";

const { Pool } = pg;

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING;
  if (!url) throw new Error("DATABASE_URL (or POSTGRES_URL) must be set");
  return url;
}

function getSslOptions(url: string): pg.ConnectionOptions["ssl"] | undefined {
  const ca = process.env.DATABASE_SSL_CA ? process.env.DATABASE_SSL_CA.replace(/\r?\n/g, "\n") : undefined;
  const hasSsl = /sslmode=(require|verify-full|verify-ca)/i.test(String(url));
  if (ca) return { ca, rejectUnauthorized: true } as any;
  if (hasSsl) return { rejectUnauthorized: false } as any;
  return undefined;
}

async function runSql(pool: pg.Pool, sql: string) {
  const statements = sql
    .split(/--\>\s*statement-breakpoint/g)
    .map(s => s.trim())
    .filter(Boolean);
  for (const stmt of statements) {
    console.log("[migrate] executing:\n", stmt.slice(0, 120).replace(/\s+/g, " "), "...");
    await pool.query(stmt);
  }
}

async function main() {
  const DATABASE_URL = getDatabaseUrl();
  const ssl = getSslOptions(DATABASE_URL);
  const pool = new Pool({ connectionString: DATABASE_URL, ssl });

  const m1 = fs.readFileSync(path.resolve("migrations/0001_enable_pgcrypto.sql"), "utf8");
  const m0 = fs.readFileSync(path.resolve("migrations/0000_flimsy_ghost_rider.sql"), "utf8");

  try {
    console.log("Applying 0001_enable_pgcrypto.sql...");
    await runSql(pool, m1);
    console.log("Applying 0000_flimsy_ghost_rider.sql...");
    await runSql(pool, m0);
    console.log("Migrations applied successfully");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();