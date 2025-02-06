// src/db/seeds/seeders/002_seed_forum.ts
import { BaseSeeder } from '../base-seeder';
import { 
  forumCategories, 
  forumSubcategories, 
  forumTopics, 
  forumPosts 
} from '../data/forum';

export class ForumSeeder extends BaseSeeder {
  async seed() {
    try {
      console.log('🌱 Seeding forum data...');

      // First, verify existing user IDs
      const userResult = await this.db.execute('SELECT id FROM users');
      const validUserIds = userResult.rows.map(row => String(row.id));
      
      console.log('Available user IDs:', validUserIds);

      // Seed categories
      console.log('\nSeeding forum categories...');
      await this.insertWithRelations('forum_categories', forumCategories);
      console.log('✅ Categories seeded');

      // Seed subcategories
      console.log('\nSeeding forum subcategories...');
      await this.insertWithRelations('forum_subcategories', forumSubcategories);
      console.log('✅ Subcategories seeded');

      // Modify topics to use only verified user IDs
      const verifiedTopics = forumTopics.map(topic => ({
        ...topic,
        author_id: validUserIds[Math.floor(Math.random() * validUserIds.length)]
      }));

      // Seed topics
      console.log('\nSeeding forum topics...');
      await this.insertWithRelations('forum_topics', verifiedTopics);
      console.log('✅ Topics seeded');

      // Modify posts to use only verified user IDs
      const verifiedPosts = forumPosts.map(post => ({
        ...post,
        author_id: validUserIds[Math.floor(Math.random() * validUserIds.length)],
        editor_id: null // Set to null initially
      }));

      // Seed posts
      console.log('\nSeeding forum posts...');
      await this.insertWithRelations('forum_posts', verifiedPosts);
      console.log('✅ Posts seeded');

      console.log('✨ Forum data seeded successfully!');
    } catch (error) {
      console.error('❌ Error seeding forum data:', error);
      throw error;
    }
  }
}