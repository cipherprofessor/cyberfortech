// src/db/migrations/scripts/migrate.ts
import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

async function main() {
  // Validate environment variables
  if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
    throw new Error('Required environment variables are not set');
  }

  // Create database client
  const db = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  try {
    // Read migration file
    const migrationPath = path.join(__dirname, '../schema.sql');
    const migrationSQL = await fs.promises.readFile(migrationPath, 'utf8');

    // Split SQL statements
    const statements = migrationSQL
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);

    // Execute each statement
    console.log('Starting migrations...');
    for (const statement of statements) {
      try {
        await db.execute(statement + ';');
        console.log('Successfully executed:', statement.substring(0, 50) + '...');
      } catch (error) {
        console.error('Error executing statement:', statement);
        throw error;
      }
    }

    console.log('Migrations completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await db.close();
  }
}

main().catch(console.error);