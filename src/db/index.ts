import { drizzle, type LibSQLDatabase } from "drizzle-orm/libsql"
import { createClient } from "@libsql/client"
import * as schema from "./schema"

let _db: LibSQLDatabase<typeof schema> | null = null

function init(): LibSQLDatabase<typeof schema> {
  const url = process.env.TURSO_DATABASE_URL
  if (!url) {
    throw new Error("TURSO_DATABASE_URL belum di-set. Cek file .env atau Environment Variables di Vercel.")
  }
  const client = createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN })
  return drizzle(client, { schema })
}

// Lazy singleton supaya proses build tidak gagal saat env belum tersedia.
export const db = new Proxy({} as LibSQLDatabase<typeof schema>, {
  get(_target, prop) {
    if (!_db) _db = init()
    return (_db as unknown as Record<string | symbol, unknown>)[prop]
  },
})
