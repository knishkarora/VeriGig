import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { config } from '../config/env.js';
import * as schema from './schema/index.js';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: config.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

export const db = drizzle(pool, { schema });

export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    const client = await pool.connect();
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection error:', error);
    return false;
  }
}
