import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { readMigrationFiles } from 'drizzle-orm/migrator';
import { db, pool } from './index.js';

async function runMigrations() {
  console.log('⏳ Running PostgreSQL migrations with Drizzle...');
  try {
    // Ensure drizzle migration schema & tracking table exist
    await pool.query('CREATE SCHEMA IF NOT EXISTS drizzle;');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS drizzle.__drizzle_migrations (
        id SERIAL PRIMARY KEY,
        hash text NOT NULL,
        created_at bigint
      );
    `);

    // Check if the database was pre-initialized without migration records
    const check = await pool.query('SELECT COUNT(*)::int as count FROM drizzle.__drizzle_migrations;');
    if (check.rows[0].count === 0) {
      console.log('📦 Baselining pre-existing database schema (migrations 0000 to 0008)...');
      const allMigrations = readMigrationFiles({ migrationsFolder: './drizzle' });
      const baselineCount = Math.min(9, allMigrations.length - 1);
      for (let i = 0; i < baselineCount; i++) {
        const m = allMigrations[i];
        await pool.query(
          'INSERT INTO drizzle.__drizzle_migrations (hash, created_at) VALUES ($1, $2);',
          [m.hash, m.folderMillis]
        );
      }
      console.log(`✅ Baselined ${baselineCount} migrations.`);
    }

    // Apply pending migrations (e.g. 0009_lean_quasar.sql)
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
