// src/db/seeds/data/contacts.ts
import { SeedContact } from '../types';

const contactSubjects = [
  'Course Access Issue',
  'Payment Problem',
  'Technical Support',
  'Content Query',
  'Instructor Feedback',
  'Certificate Issue',
  'Account Problem',
  'Course Suggestion',
  'Platform Bug Report',
  'General Inquiry'
];

const contactMessages = [
  'I\'m having trouble accessing the course content. The videos won\'t play.',
  'My payment was processed but I can\'t access the course.',
  'The platform is running slow on my device.',
  'I found an error in the course material.',
  'I would like to suggest a new course topic.',
  'Need help with downloading my certificate.',
  'Cannot reset my password.',
  'Is there a corporate training package available?',
  'The code samples in module 3 are not working.',
  'When will the next AWS course be available?'
];

function generateContact(index: number): SeedContact {
  const now = new Date();
  const isResolved = Math.random() > 0.5;
  const isPriority = Math.random() > 0.7;
  
  return {
    id: `contact_${Math.random().toString(36).substr(2, 9)}`,
    name: `Contact User ${index + 1}`,
    email: `contact${index + 1}@example.com`,
    phone: Math.random() > 0.5 ? `+1-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}` : null,
    subject: contactSubjects[index % contactSubjects.length],
    message: contactMessages[index % contactMessages.length] + ' Additional details: ' + Math.random().toString(36),
    status: isResolved ? 'resolved' : Math.random() > 0.5 ? 'in_progress' : 'new',
    assigned_to: isResolved ? 'usr_1b9888c9-574d-408e-b1eb-426bae43da4e' : null,
    response: isResolved ? 'Thank you for your message. We have resolved your issue.' : null,
    response_by: isResolved ? 'usr_1b9888c9-574d-408e-b1eb-426bae43da4e' : null,
    responded_at: isResolved ? new Date(now.getTime() - Math.random() * 86400000).toISOString() : null,
    priority: isPriority ? 'high' : Math.random() > 0.5 ? 'normal' : 'low',
    tags: JSON.stringify(['support', contactSubjects[index % contactSubjects.length].toLowerCase().replace(' ', '_')]),
    metadata: JSON.stringify({
      browser: ['Chrome', 'Firefox', 'Safari'][Math.floor(Math.random() * 3)],
      os: ['Windows', 'MacOS', 'Linux'][Math.floor(Math.random() * 3)],
      source: ['web', 'mobile', 'email'][Math.floor(Math.random() * 3)]
    }),
    is_deleted: false,
    deleted_at: null,
    created_at: new Date(now.getTime() - Math.random() * 604800000).toISOString(), // Within last week
    updated_at: new Date(now.getTime() - Math.random() * 86400000).toISOString() // Within last day
  };
}

// Generate 20 contacts
export const contacts: SeedContact[] = Array.from({ length: 20 }, (_, i) => generateContact(i));

// Generate contact history
export const contactHistory = contacts
  .filter(contact => contact.status !== 'new')
  .map(contact => ({
    id: `history_${Math.random().toString(36).substr(2, 9)}`,
    contact_id: contact.id,
    action: 'status_change',
    action_by: contact.assigned_to!,
    previous_status: 'new',
    new_status: contact.status,
    notes: contact.response,
    created_at: contact.responded_at || contact.updated_at
  }));