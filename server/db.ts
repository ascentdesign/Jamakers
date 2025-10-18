import pg from 'pg'
const { Pool } = pg
import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres'
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http'
import { neon, neonConfig } from '@neondatabase/serverless'
import * as schema from '@shared/schema'

// Support Vercel Postgres (Neon) defaults
const DATABASE_URL = process.env.DATABASE_URL
  || process.env.POSTGRES_URL
  || process.env.POSTGRES_URL_NON_POOLING

if (!DATABASE_URL) {
  throw new Error(
    'DATABASE_URL (or POSTGRES_URL) must be set. Did you connect Neon/Vercel Postgres?',
  )
}

// Detect serverless environment (Vercel/AWS/GCF) and Neon host
const isServerless = Boolean(process.env.VERCEL || process.env.AWS_REGION || process.env.K_SERVICE)
const useNeonHttp = isServerless || /neon\.tech/i.test(String(DATABASE_URL))

// Optional CA-based TLS support: provide PEM string via DATABASE_SSL_CA (pg driver only)
const ca = process.env.DATABASE_SSL_CA
  ? process.env.DATABASE_SSL_CA.replace(/\n/g, '\n')
  : undefined

// Decide if SSL should be enabled (pg driver only)
const forceSslEnv = process.env.PG_SSL === 'true' || process.env.DATABASE_SSL === 'true'
const urlHasSslRequire = /sslmode=(require|verify-full|verify-ca)/i.test(String(DATABASE_URL))
const enableSsl = !!ca || forceSslEnv || urlHasSslRequire

let dbImpl: any

if (useNeonHttp) {
  // Prefer Neon HTTP driver on serverless to avoid TCP connection limits
  neonConfig.fetchConnectionCache = true
  const sql = neon(DATABASE_URL)
  dbImpl = drizzleNeon(sql, { schema })
} else {
  // Pool tuning defaults; use conservative values for serverless
  const defaultMax = isServerless ? 1 : 10
  const defaultIdleTimeout = isServerless ? 1000 : 30000
  const defaultConnTimeout = isServerless ? 5000 : 5000

  const max = process.env.PGPOOL_MAX ? Number(process.env.PGPOOL_MAX) : defaultMax
  const idleTimeoutMillis = process.env.PG_IDLE_TIMEOUT_MS
    ? Number(process.env.PG_IDLE_TIMEOUT_MS)
    : defaultIdleTimeout
  const connectionTimeoutMillis = process.env.PG_CONN_TIMEOUT_MS
    ? Number(process.env.PG_CONN_TIMEOUT_MS)
    : defaultConnTimeout

  const pool = new Pool({
    connectionString: DATABASE_URL,
    ...(enableSsl
      ? {
          ssl: ca
            ? { ca, rejectUnauthorized: true }
            : { rejectUnauthorized: false },
        }
      : {}),
    max,
    idleTimeoutMillis,
    connectionTimeoutMillis,
  })

  dbImpl = drizzlePg(pool, { schema })
}

export const db = dbImpl
