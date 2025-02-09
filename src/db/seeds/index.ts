// src/db/seeds/index.ts
import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';
import { CoreSeeder } from './seeders/001_seed_core';
import { ForumSeeder } from './seeders/003_seed_forum';
import { ContactsSeeder } from './seeders/003_seed_contacts';

dotenv.config();

async function seedDatabase() {
  if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
    throw new Error('Required environment variables are not set');
  }

  const db = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  try {
    console.log('🌱 Starting database seeding...');

    // Run seeders in order
    const seeders = [
      new CoreSeeder(db),    // Users, instructors, and courses
      new ForumSeeder(db),   // Forum categories, topics, and posts
      new ContactsSeeder(db) // Contact form data
    ];

    for (const seeder of seeders) {
      await seeder.seed();
    }

    console.log('✨ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    await db.close();
  }
}

seedDatabase().catch(console.error);