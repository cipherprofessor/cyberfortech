// src/db/seeds/seed.ts
import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';

// Load environment variables
dotenv.config();

async function seedDatabase() {
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
    // Clear existing data
    await db.execute('DELETE FROM reviews');
    await db.execute('DELETE FROM enrollments');
    await db.execute('DELETE FROM course_lessons');
    await db.execute('DELETE FROM course_sections');
    await db.execute('DELETE FROM courses');
    await db.execute('DELETE FROM users');

    // Users Seed Data
    const users = Array.from({ length: 15 }).map(() => ({
      id: uuidv4(),
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: faker.internet.password(), // Note: In real app, hash passwords
      role: faker.helpers.arrayElement(['student', 'instructor', 'admin']),
      avatar_url: faker.image.avatarGitHub(),
      created_at: new Date().toISOString(),
    }));

    // Ensure at least one instructor
    if (!users.some(u => u.role === 'instructor')) {
      users[0].role = 'instructor';
    }

    // Insert Users
    for (const user of users) {
      await db.execute({
        sql: `
          INSERT INTO users 
          (id, email, name, password, role, avatar_url, created_at) 
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        args: [
          user.id, 
          user.email, 
          user.name, 
          user.password, 
          user.role, 
          user.avatar_url,
          user.created_at
        ]
      });
    }

    // Filter instructors
    const instructors = users.filter(u => u.role === 'instructor');

    // Courses Seed Data
    const courses = Array.from({ length: 15 }).map(() => ({
      id: uuidv4(),
      title: faker.lorem.words(3),
      description: faker.lorem.paragraph(),
      image_url: faker.image.urlLoremFlickr({ category: 'education' }),
      price: parseFloat(faker.commerce.price({ min: 9.99, max: 199.99 })),
      duration: `${faker.number.int({ min: 1, max: 10 })} hours`,
      level: faker.helpers.arrayElement(['beginner', 'intermediate', 'advanced']),
      instructor_id: instructors[Math.floor(Math.random() * instructors.length)].id,
      category: faker.helpers.arrayElement([
        'Cybersecurity', 
        'Network Security', 
        'Web Development', 
        'Cloud Computing', 
        'Ethical Hacking'
      ]),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    // Insert Courses
    for (const course of courses) {
      await db.execute({
        sql: `
          INSERT INTO courses 
          (id, title, description, image_url, price, duration, level, 
           instructor_id, category, created_at, updated_at) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
          course.updated_at
        ]
      });
    }

    // Course Sections Seed Data
    const courseSections = courses.flatMap(course => 
      Array.from({ length: 3 }).map((_, index) => ({
        id: uuidv4(),
        course_id: course.id,
        title: faker.lorem.words(4),
        order_index: index + 1,
        created_at: new Date().toISOString(),
      }))
    );

    // Insert Course Sections
    for (const section of courseSections) {
      await db.execute({
        sql: `
          INSERT INTO course_sections 
          (id, course_id, title, order_index, created_at) 
          VALUES (?, ?, ?, ?, ?)
        `,
        args: [
          section.id, 
          section.course_id, 
          section.title, 
          section.order_index, 
          section.created_at
        ]
      });
    }

    // Course Lessons Seed Data
    const courseLessons = courseSections.flatMap(section => 
      Array.from({ length: 4 }).map((_, index) => ({
        id: uuidv4(),
        section_id: section.id,
        title: faker.lorem.words(5),
        content: faker.lorem.paragraphs(),
        video_url: faker.internet.url(),
        duration: `${faker.number.int({ min: 5, max: 30 })} mins`,
        order_index: index + 1,
        created_at: new Date().toISOString(),
      }))
    );

    // Insert Course Lessons
    for (const lesson of courseLessons) {
      await db.execute({
        sql: `
          INSERT INTO course_lessons 
          (id, section_id, title, content, video_url, duration, order_index, created_at) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        args: [
          lesson.id, 
          lesson.section_id, 
          lesson.title, 
          lesson.content, 
          lesson.video_url, 
          lesson.duration, 
          lesson.order_index, 
          lesson.created_at
        ]
      });
    }

    // Enrollments Seed Data
    const enrollments = Array.from({ length: 30 }).map(() => ({
      id: uuidv4(),
      user_id: users[Math.floor(Math.random() * users.length)].id,
      course_id: courses[Math.floor(Math.random() * courses.length)].id,
      enrolled_at: new Date().toISOString(),
      status: faker.helpers.arrayElement(['active', 'completed', 'dropped']),
      progress: faker.number.float({ min: 0, max: 100, fractionDigits: 2 }).toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    // Insert Enrollments
    for (const enrollment of enrollments) {
      await db.execute({
        sql: `
          INSERT INTO enrollments 
          (id, user_id, course_id, enrolled_at, status, progress, created_at, updated_at) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        args: [
          enrollment.id, 
          enrollment.user_id, 
          enrollment.course_id, 
          enrollment.enrolled_at,
          enrollment.status, 
          enrollment.progress,
          enrollment.created_at,
          enrollment.updated_at
        ]
      });
    }

    // Reviews Seed Data
    const reviews = Array.from({ length: 30 }).map(() => ({
      id: uuidv4(),
      user_id: users[Math.floor(Math.random() * users.length)].id,
      course_id: courses[Math.floor(Math.random() * courses.length)].id,
      rating: faker.number.int({ min: 1, max: 5 }),
      content: faker.lorem.paragraph(),
      created_at: new Date().toISOString(),
    }));

    // Insert Reviews
    for (const review of reviews) {
      await db.execute({
        sql: `
          INSERT INTO reviews 
          (id, user_id, course_id, rating, content, created_at) 
          VALUES (?, ?, ?, ?, ?, ?)
        `,
        args: [
          review.id, 
          review.user_id, 
          review.course_id, 
          review.rating, 
          review.content, 
          review.created_at
        ]
      });
    }

    // // If you have a products table, add this section
    // const products = Array.from({ length: 15 }).map(() => ({
    //   id: uuidv4(),
    //   name: faker.commerce.productName(),
    //   description: faker.commerce.productDescription(),
    //   price: parseFloat(faker.commerce.price({ min: 10, max: 500 })),
    //   category: faker.commerce.department(),
    //   image_url: faker.image.urlLoremFlickr({ category: 'technology' }),
    //   stock: faker.number.int({ min: 0, max: 100 }),
    //   created_at: new Date().toISOString(),
    // }));

    // // Insert Products (uncomment if you have a products table)
    // for (const product of products) {
    //   await db.execute({
    //     sql: `
    //       INSERT INTO products 
    //       (id, name, description, price, category, image_url, stock, created_at) 
    //       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    //     `,
    //     args: [
    //       product.id,
    //       product.name,
    //       product.description,
    //       product.price,
    //       product.category,
    //       product.image_url,
    //       product.stock,
    //       product.created_at
    //     ]
    //   });
    // }

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  } finally {
    await db.close();
  }
}

// Run the seed function
seedDatabase().catch(console.error);