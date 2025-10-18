import pg from 'pg'
const { Pool } = pg
import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from '@shared/schema'

if (!process.env.DATABASE_URL) {
  throw new Error(
    'DATABASE_URL must be set. Did you forget to provision a database?',
  )
}

// Optional CA-based TLS support: provide PEM string via DATABASE_SSL_CA
const ca = process.env.DATABASE_SSL_CA
  ? process.env.DATABASE_SSL_CA.replace(/\\n/g, '\n')
  : undefined

// Decide if SSL should be enabled
const forceSslEnv = process.env.PG_SSL === 'true' || process.env.DATABASE_SSL === 'true'
const urlHasSslRequire = (() => {
  const url = process.env.DATABASE_URL ?? ''
  return /sslmode=(require|verify-full|verify-ca)/i.test(url)
})()
const enableSsl = !!ca || forceSslEnv || urlHasSslRequire

// Pool tuning defaults suited for DO Managed Postgres / PG 17
const max = process.env.PGPOOL_MAX ? Number(process.env.PGPOOL_MAX) : 10
const idleTimeoutMillis = process.env.PG_IDLE_TIMEOUT_MS
  ? Number(process.env.PG_IDLE_TIMEOUT_MS)
  : 30000
const connectionTimeoutMillis = process.env.PG_CONN_TIMEOUT_MS
  ? Number(process.env.PG_CONN_TIMEOUT_MS)
  : 5000

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
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

export const db = drizzle(pool, { schema })
