// Creates the tables in database/schema.sql and loads database/seed.sql.
// Usage: npm run db:init   (add --no-seed to skip sample data)
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { pool } from '../src/config/db.js';

const dbDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../database');

async function run(file) {
  const sql = await readFile(path.join(dbDir, file), 'utf8');
  await pool.query(sql);
  console.log(`Applied ${file}`);
}

try {
  await run('schema.sql');
  if (!process.argv.includes('--no-seed')) await run('seed.sql');
} catch (err) {
  console.error('Database init failed:', err.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
