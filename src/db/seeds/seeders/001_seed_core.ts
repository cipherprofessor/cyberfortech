// src/db/seeds/seeders/001_seed_core.ts
import { BaseSeeder } from '../base-seeder';
import { users, userStats } from '../data/users';

export class CoreSeeder extends BaseSeeder {
  async seed() {
    try {
      console.log('🌱 Seeding core data...');

      // First, create all users
      console.log('Seeding users...');
      await this.insertWithRelations('users', users);
      console.log('✅ Users seeded successfully');

      // Create user stats
      console.log('Seeding user stats...');
      const userStatsData = users.map(user => ({
        user_id: user.id,
        login_count: Math.floor(Math.random() * 100),
        last_active_at: new Date().toISOString(),
        posts_count: Math.floor(Math.random() * 50),
        topics_count: Math.floor(Math.random() * 20),
        reputation_points: Math.floor(Math.random() * 1000),
        created_at: user.created_at,
        updated_at: user.updated_at
      }));
      await this.insertWithRelations('user_stats', userStatsData);
      console.log('✅ User stats seeded successfully');

      // Create user settings
      console.log('Seeding user settings...');
      const userSettings = users.map(user => ({
        user_id: user.id,
        notification_preferences: JSON.stringify({
          email: true,
          push: true,
          web: true
        }),
        privacy_settings: JSON.stringify({
          profile_visible: true,
          show_online_status: true
        }),
        theme_preferences: JSON.stringify({
          theme: 'light',
          font_size: 'medium'
        }),
        created_at: user.created_at,
        updated_at: user.updated_at
      }));
      await this.insertWithRelations('user_settings', userSettings);
      console.log('✅ User settings seeded successfully');

      // Create instructors (only for users with instructor role)
      console.log('Seeding instructors...');
      const instructorUsers = users.filter(user => user.role === 'instructor');
      const instructorsData = instructorUsers.map(user => ({
        id: `inst_${user.id.split('_')[1]}`, // Create instructor ID from user ID
        name: user.full_name,
        email: user.email,
        bio: `Experienced instructor in ${user.custom_metadata ? JSON.parse(user.custom_metadata).specialization : 'various subjects'}`,
        contact_number: null,
        address: user.location,
        profile_image_url: user.avatar_url,
        specialization: user.custom_metadata ? JSON.parse(user.custom_metadata).specialization : null,
        qualification: user.custom_metadata ? JSON.parse(user.custom_metadata).qualification : null,
        years_of_experience: Math.floor(Math.random() * 15) + 5,
        rating: (Math.random() * 1.5 + 3.5).toFixed(1),
        total_students: Math.floor(Math.random() * 2000) + 500,
        total_courses: Math.floor(Math.random() * 8) + 2,
        social_links: user.social_links,
        status: 'active',
        created_at: user.created_at,
        updated_at: user.updated_at,
        user_id: user.id
      }));
      await this.insertWithRelations('instructors', instructorsData);
      console.log('✅ Instructors seeded successfully');

      console.log('✨ Core data seeded successfully!');
    } catch (error) {
      console.error('❌ Error seeding core data:', error);
      throw error;
    }
  }
}