import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db, pool } from './index.js';

async function runMigrations() {
  console.log('⏳ Running PostgreSQL migrations with Drizzle...');
  try {
    await migrate(db, { migrationsFolder: './drizzle' });
    console.log('✅ Migrations completed successfully!');
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigrations();
