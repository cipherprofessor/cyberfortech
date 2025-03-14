// src/db/migrations/scripts/migrate.ts
import { Client, createClient, Row } from '@libsql/client';
import * as dotenv from 'dotenv';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Schema files in order of execution
const SCHEMA_FILES = [
  '001_initial_setup.sql',
  '002_create_users.sql',
  '003_create_instructors.sql',
  '004_create_courses.sql',
  '005_create_forum_base.sql',
  '006_create_forum_content.sql',
  '007_create_forum_features.sql',
  '008_create_forum_analytics.sql',
  '009_create_contacts.sql',
  '010_create_triggers_utils.sql',
  '011_create_blog.sql',
  '012_likes_bookmarks_schema.sql',
  '013_newsletter_subscribers_schema.sql'
];

function cleanSQLStatement(sql: string): string {
  return sql
    .split('\n')
    .map(line => {
      const commentIndex = line.indexOf('--');
      return commentIndex >= 0 ? line.substring(0, commentIndex) : line;
    })
    .join('\n')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .trim();
}

// In your migrate.ts, update the splitSQLStatements function

async function executeStatement(db: Client, statement: string, fileName: string) {
  try {
    if (!statement.trim()) return;

    // Check if this is a trigger creation
    const isTrigger = statement.toUpperCase().includes('CREATE TRIGGER');
    
    // For triggers, we want to execute the statement exactly as is
    if (isTrigger) {
      console.log(`📄 [${fileName}] Executing trigger creation...`);
      await db.execute(statement + ';');  // Make sure it ends with semicolon
    } else {
      console.log(`📄 [${fileName}] Executing:`, statement.substring(0, 100) + '...');
      await db.execute(statement);
    }
    
    console.log('✅ Success');
  } catch (error: any) {
    if (error.message?.includes('already exists')) {
      console.log('ℹ️ Skip: Object already exists');
      return;
    }
    throw new Error(`Error in ${fileName}: ${error.message}`);
  }
}

function splitSQLStatements(sql: string): string[] {
  const cleanSQL = cleanSQLStatement(sql);
  const statements: string[] = [];
  let currentStatement = '';
  let inTrigger = false;
  let inBegin = false;
  let inString = false;
  let stringChar = '';

  for (let i = 0; i < cleanSQL.length; i++) {
    const char = cleanSQL[i];
    
    // Handle string literals
    if ((char === "'" || char === '"') && cleanSQL[i - 1] !== '\\') {
      if (!inString) {
        inString = true;
        stringChar = char;
      } else if (char === stringChar) {
        inString = false;
      }
    }

    // Only check for keywords if we're not in a string
    if (!inString) {
      // Check for CREATE TRIGGER
      if (!inTrigger && cleanSQL.substring(i).toUpperCase().startsWith('CREATE TRIGGER')) {
        inTrigger = true;
      }
      
      // Check for BEGIN
      if (inTrigger && !inBegin && cleanSQL.substring(i).toUpperCase().startsWith('BEGIN')) {
        inBegin = true;
      }
      
      // Check for END;
      if (inTrigger && inBegin && cleanSQL.substring(i).toUpperCase().startsWith('END;')) {
        currentStatement += 'END;';
        statements.push(currentStatement.trim());
        currentStatement = '';
        inTrigger = false;
        inBegin = false;
        i += 3; // Skip past 'END;'
        continue;
      }
    }

    currentStatement += char;

    // If we're not in a trigger and we hit a semicolon, end the statement
    if (!inTrigger && !inString && char === ';') {
      statements.push(currentStatement.trim());
      currentStatement = '';
    }
  }

  // Add any remaining statement
  if (currentStatement.trim()) {
    statements.push(currentStatement.trim());
  }

  return statements.filter(stmt => stmt.length > 0);
}

async function getCurrentSchemaVersion(db: Client): Promise<number> {
  try {
    const result = await db.execute(`
      SELECT version FROM schema_versions 
      ORDER BY version DESC LIMIT 1
    `);
    if (result.rows.length > 0) {
      const row = result.rows[0] as Record<string, unknown>;
      return typeof row.version === 'number' ? row.version : 0;
    }
    return 0;
  } catch {
    return 0;
  }
}

async function getAppliedMigrations(db: Client): Promise<Set<string>> {
  try {
    const result = await db.execute('SELECT name FROM schema_versions');
    const migrations = result.rows
      .map((row: Row) => {
        const record = row as Record<string, unknown>;
        return record.name;
      })
      .filter((name): name is string => typeof name === 'string');
    return new Set(migrations);
  } catch {
    return new Set<string>();
  }
}

async function executeSchemaFile(db: Client, fileName: string) {
  console.log(`\n📦 Processing ${fileName}...`);
  const filePath = path.join(__dirname, '../schemas', fileName);
  
  try {
    const sql = await fs.promises.readFile(filePath, 'utf8');
    const statements = splitSQLStatements(sql);
    
    for (const statement of statements) {
      await executeStatement(db, statement, fileName);
    }
  } catch (error) {
    throw new Error(`Failed to process ${fileName}: ${error}`);
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
    console.log('🚀 Starting database migration...');

    // Get current schema version and applied migrations
    const currentVersion = await getCurrentSchemaVersion(db);
    const appliedMigrations = await getAppliedMigrations(db);

    // Execute schema files that haven't been applied yet
    for (const file of SCHEMA_FILES) {
      if (!appliedMigrations.has(file)) {
        await executeSchemaFile(db, file);
      } else {
        console.log(`\n📦 Skipping ${file} (already applied)`);
      }
    }

    console.log('\n✨ Migration completed successfully!');
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await db.close();
  }
}

main().catch(console.error);