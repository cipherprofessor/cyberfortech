// src/db/seeds/seed_courses.ts
import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Course {
  id: string;
  title: string;
  description: string;
  image_url: string;
  price: number;
  duration: string;
  level: string;
  instructor_id: string;
  category: string;
  created_at: string;
  updated_at: string;
  average_rating: number;
}

async function seedCourses() {
  const db = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });

  try {
    console.log('🌱 Starting courses seeding...');

    // Read the courses JSON file
    const coursesFilePath = path.join(__dirname, 'data', 'courses.json');
    const coursesData = await fs.readFile(coursesFilePath, 'utf8');
    const courses: Course[] = JSON.parse(coursesData);

    // Get all unique instructor IDs from courses
    const instructorIds = [...new Set(courses.map(course => course.instructor_id))];
    console.log('Required instructor IDs:', instructorIds);

    // Create instructors if they don't exist
    console.log('Ensuring instructors exist...');
    for (const instructorId of instructorIds) {
      // Check if instructor exists
      const existingInstructor = await db.execute({
        sql: 'SELECT id FROM instructors WHERE id = ?',
        args: [instructorId]
      });

      if (existingInstructor.rows.length === 0) {
        console.log(`Creating instructor ${instructorId}...`);
        await db.execute({
          sql: `
            INSERT INTO instructors (
              id, name, email, bio, status, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
          `,
          args: [
            instructorId,
            `Instructor ${instructorId.slice(0, 6)}`,
            `instructor_${instructorId.slice(0, 6)}@example.com`,
            'Course instructor',
            'active',
            new Date().toISOString(),
            new Date().toISOString()
          ]
        });
      }
    }

    // First, clear existing courses
    console.log('Clearing existing courses...');
    await db.execute('DELETE FROM courses');

    // Insert courses
    console.log('Inserting new courses...');
    for (const course of courses) {
      await db.execute({
        sql: `
          INSERT INTO courses (
            id, title, description, image_url, price, duration, 
            level, instructor_id, category, created_at, updated_at, average_rating
          ) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        args: [
          course.id,
          course.title,
          course.description,
          course.image_url,
          course.price,
          course.duration,
          course.level,
          course.instructor_id,
          course.category,
          course.created_at,
          course.updated_at,
          course.average_rating
        ]
      });
      console.log(`✅ Inserted course: ${course.title}`);
    }

    console.log('✨ Courses seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding courses:', error);
    throw error;
  } finally {
    await db.close();
  }
}

// Run seeding
seedCourses().catch(console.error);