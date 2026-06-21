import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';
import { getDatabaseAuthToken, getDatabaseUrl } from './database';

export function createDb() {
  const client = createClient({
    url: getDatabaseUrl(),
    authToken: getDatabaseAuthToken(),
  });
  return drizzle(client, { schema });
}

// Singleton for backward compatibility
let _db: ReturnType<typeof createDb> | null = null;

export function getDb() {
  if (!_db) {
    _db = createDb();
  }
  return _db;
}

// Proxy for backward compatibility with `db.query.users.findFirst()` etc.
export const db = new Proxy({} as ReturnType<typeof createDb>, {
  get(_, prop) {
    return (getDb() as any)[prop];
  },
});
