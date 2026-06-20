import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';
import { getDatabaseAuthToken, getDatabaseUrl } from './database';

const client = createClient({
  url: getDatabaseUrl(),
  authToken: getDatabaseAuthToken(),
});

export const db = drizzle(client, { schema });
