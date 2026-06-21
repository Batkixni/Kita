import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';
import { getDatabaseAuthToken, getDatabaseUrl } from './database';

// Always create a fresh client to ensure env is read at request time
export function createDb() {
  const client = createClient({
    url: getDatabaseUrl(),
    authToken: getDatabaseAuthToken(),
  });
  return drizzle(client, { schema });
}

// For backward compatibility, but create fresh instance each time
// This avoids caching stale env values from build time
export const db = createDb();
