// src/db/migrations/scripts/migrate.ts
import { Client, createClient } from '@libsql/client';
import * as dotenv from 'dotenv';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

interface ColumnInfo {
  table: string;
  column: string;
  definition: string;
}

function cleanSQLStatement(sql: string): string {
  // Remove comments and trim whitespace
  return sql
    .split('\n')
    .map(line => line.split('--')[0]) // Remove comments
    .join('\n')
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
    .trim();
}

function splitSQLStatements(sql: string): string[] {
  const cleanSQL = cleanSQLStatement(sql);
  const statements: string[] = [];
  let currentStatement = '';
  let inTrigger = false;

  const lines = cleanSQL.split('\n');

  for (const line of lines) {
    const trimmedLine = line.trim();
    
    if (!trimmedLine) continue;

    if (trimmedLine.toUpperCase().includes('CREATE TRIGGER')) {
      inTrigger = true;
    }

    currentStatement += line + '\n';

    if (inTrigger) {
      if (trimmedLine === 'END;') {
        statements.push(currentStatement.trim());
        currentStatement = '';
        inTrigger = false;
      }
    } else if (trimmedLine.endsWith(';')) {
      if (currentStatement.trim()) {
        statements.push(currentStatement.trim());
        currentStatement = '';
      }
    }
  }

  return statements.filter(stmt => stmt.length > 0);
}

async function executeStatement(db: Client, statement: string) {
  try {
    if (!statement.trim()) return;

    // Log first 100 characters of statement for debugging
    console.log('Executing:', statement.substring(0, 100) + '...');

    await db.execute(statement);
    console.log('✅ Successfully executed statement');
  } catch (error: any) {
    if (error.message?.includes('already exists')) {
      console.log('ℹ️ Skip: Table/Index/Trigger already exists');
      return;
    }
    throw error;
  }
}

async function main() {
  if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
    throw new Error('Required environment variables are not set');
  }

  const db = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  try {
    const migrationPath = path.join(__dirname, '../schema.sql');
    const migrationSQL = await fs.promises.readFile(migrationPath, 'utf8');

    console.log('🚀 Starting migrations...');

    const statements = splitSQLStatements(migrationSQL);
    
    for (const statement of statements) {
      try {
        await executeStatement(db, statement);
      } catch (error) {
        console.error('❌ Error executing statement:', statement);
        console.error('Error details:', error);
        throw error;
      }
    }

    console.log('\n✨ Migrations completed successfully!');
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await db.close();
  }
}

main().catch(console.error);