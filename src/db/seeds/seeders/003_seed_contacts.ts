// src/db/seeds/seeders/003_seed_contacts.ts
import { BaseSeeder } from '../base-seeder';
import { contacts, contactHistory } from '../data/contacts';

export class ContactsSeeder extends BaseSeeder {
  async seed() {
    try {
      console.log('🌱 Seeding contacts data...');

      // Seed contacts
      console.log('Seeding contacts...');
      await this.insertWithRelations('contacts', contacts);

      // Seed contact history
      console.log('Seeding contact history...');
      await this.insertWithRelations('contact_history', contactHistory);

      console.log('✨ Contacts data seeded successfully!');
    } catch (error) {
      console.error('❌ Error seeding contacts data:', error);
      throw error;
    }
  }
}