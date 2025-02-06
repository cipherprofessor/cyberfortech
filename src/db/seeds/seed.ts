// src/db/seeds/seed.ts
import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';

dotenv.config();

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function seedDatabase() {
  console.log('🌱 Starting database seeding...');

  try {
    // Seed Forum Categories
    await client.execute(`
      INSERT INTO forum_categories (name, description, icon) VALUES
      ('General Discussion', 'General topics and discussions', '💬'),
      ('Programming', 'Programming and development topics', '💻'),
      ('Cybersecurity', 'Security and privacy discussions', '🔒'),
      ('Web Development', 'Web development topics', '🌐'),
      ('Mobile Development', 'Mobile app development discussions', '📱'),
      ('Career Advice', 'Career guidance and opportunities', '💼'),
      ('Project Showcase', 'Share and discuss projects', '🚀');
    `);

    // Seed Forum Subcategories
    await client.execute(`
      INSERT INTO forum_subcategories (category_id, name) VALUES
      (1, 'Introductions'),
      (1, 'Announcements'),
      (2, 'JavaScript'),
      (2, 'Python'),
      (2, 'Java'),
      (3, 'Network Security'),
      (3, 'Web Security'),
      (4, 'Frontend'),
      (4, 'Backend'),
      (5, 'iOS Development'),
      (5, 'Android Development');
    `);

    // Create test users
    await client.execute(`
      INSERT INTO users (id, email, first_name, last_name, full_name, role) VALUES
      ('test_admin', 'admin@test.com', 'Admin', 'User', 'Admin User', 'admin'),
      ('test_instructor', 'instructor@test.com', 'Instructor', 'User', 'Instructor User', 'instructor'),
      ('test_student', 'student@test.com', 'Student', 'User', 'Student User', 'student');
    `);

    // Seed some sample courses
    await client.execute(`
      INSERT INTO courses (id, title, description, instructor_id, category) VALUES
      ('course1', 'Introduction to Programming', 'Learn programming basics', 'test_instructor', 'programming'),
      ('course2', 'Web Development Fundamentals', 'Learn web development', 'test_instructor', 'web');
    `);

    console.log('✨ Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

// Run seeding
seedDatabase().catch(console.error);