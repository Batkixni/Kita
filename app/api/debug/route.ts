import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

export async function GET() {
  const envInfo = {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL ? 'SET (starts with: ' + process.env.DATABASE_URL.substring(0, 20) + '...)' : 'MISSING',
    DATABASE_AUTH_TOKEN: process.env.DATABASE_AUTH_TOKEN ? 'SET (length: ' + process.env.DATABASE_AUTH_TOKEN.length + ')' : 'MISSING',
  };

  let dbTest = 'not tested';
  try {
    const result = await db.execute(sql`SELECT 1`);
    dbTest = 'OK: ' + JSON.stringify(result);
  } catch (e: any) {
    dbTest = 'ERROR: ' + e.message;
  }

  return NextResponse.json({ env: envInfo, dbTest });
}
