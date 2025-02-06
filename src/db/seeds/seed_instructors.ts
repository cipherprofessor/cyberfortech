// src/db/seeds/seed_instructors.ts
import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';

dotenv.config();

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function seedInstructors() {
  console.log('🌱 Starting instructors seeding...');

  try {
    // Clear existing data
    await client.execute(`DELETE FROM instructors;`);

    // Reset the autoincrement
    await client.execute(`DELETE FROM sqlite_sequence WHERE name='instructors';`);

    // Insert seed data
    await client.execute(`
      INSERT INTO instructors (
        name,
        email,
        bio,
        contact_number,
        address,
        profile_image_url,
        specialization,
        qualification,
        years_of_experience,
        rating,
        status
      ) VALUES 
      (
        'John Smith',
        'john.smith@example.com',
        'Experienced instructor specializing in web development and cloud computing with over 10 years of industry experience.',
        '+1-234-567-8901',
        'New York, USA',
        'https://example.com/profiles/john-smith.jpg',
        'Web Development, Cloud Computing',
        'Master in Computer Science',
        10,
        4.5,
        'active'
      ),
      (
        'Sarah Johnson',
        'sarah.johnson@example.com',
        'Cybersecurity expert with extensive experience in network security and ethical hacking.',
        '+1-234-567-8902',
        'San Francisco, USA',
        'https://example.com/profiles/sarah-johnson.jpg',
        'Cybersecurity, Network Security',
        'PhD in Information Security',
        8,
        4.8,
        'active'
      ),
      (
        'Michael Chen',
        'michael.chen@example.com',
        'DevOps specialist with expertise in containerization and cloud infrastructure.',
        '+1-234-567-8903',
        'Seattle, USA',
        'https://example.com/profiles/michael-chen.jpg',
        'DevOps, Cloud Architecture',
        'Master in Software Engineering',
        12,
        4.7,
        'active'
      ),
      (
        'Emily Brown',
        'emily.brown@example.com',
        'AI and machine learning professional with a focus on practical applications.',
        '+1-234-567-8904',
        'Boston, USA',
        'https://example.com/profiles/emily-brown.jpg',
        'Artificial Intelligence, Machine Learning',
        'PhD in Computer Science',
        6,
        4.9,
        'active'
      );
    `);

    console.log('✨ Instructors seeded successfully!');
  } catch (error) {
    console.error('❌ Seeding instructors failed:', error);
    throw error;
  } finally {
    await client.close();
  }
}

// Run seeding
seedInstructors().catch((err) => {
  console.error('Failed to seed database:', err);
  process.exit(1);
});