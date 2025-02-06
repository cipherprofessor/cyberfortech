// src/db/seeds/data/forum.ts
import { 
    SeedForumCategory, 
    SeedForumSubcategory,
    SeedForumTopic,
    SeedForumPost 
  } from '../types';
  
  // Helper function to generate ID
  function generateId(prefix: string): string {
    return `${prefix}_${Math.random().toString(36).substring(2, 15)}`;
  }
  
  // Forum Categories matching course topics
  export const forumCategories: SeedForumCategory[] = [
    {
      id: generateId('forum_cat'),
      name: 'Web Development',
      description: 'Discussions about frontend, backend, and full-stack development',
      icon: '💻',
      color: '#3498db',
      display_order: 1,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_deleted: false,
      deleted_at: null
    },
    {
      id: generateId('forum_cat'),
      name: 'Cloud Computing',
      description: 'AWS, Azure, Google Cloud, and cloud architecture discussions',
      icon: '☁️',
      color: '#2ecc71',
      display_order: 2,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_deleted: false,
      deleted_at: null
    },
    {
      id: generateId('forum_cat'),
      name: 'Cybersecurity',
      description: 'Security, ethical hacking, and network protection',
      icon: '🔒',
      color: '#e74c3c',
      display_order: 3,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_deleted: false,
      deleted_at: null
    }
  ];
  
  // Create subcategories for each category
  export const forumSubcategories: SeedForumSubcategory[] = forumCategories.flatMap(category => {
    const subcategories = {
      'Web Development': [
        { name: 'Frontend Development', description: 'HTML, CSS, JavaScript, and frontend frameworks' },
        { name: 'Backend Development', description: 'Server-side programming and APIs' }
      ],
      'Cloud Computing': [
        { name: 'AWS', description: 'Amazon Web Services discussions' },
        { name: 'Azure', description: 'Microsoft Azure platform discussions' }
      ],
      'Cybersecurity': [
        { name: 'Ethical Hacking', description: 'Penetration testing and security assessments' },
        { name: 'Network Security', description: 'Network protection and security protocols' }
      ]
    };
  
    return (subcategories[category.name as keyof typeof subcategories] || []).map((sub, index) => ({
      id: generateId('forum_sub'),
      category_id: category.id,
      name: sub.name,
      description: sub.description,
      icon: null,
      color: null,
      display_order: index + 1,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_deleted: false,
      deleted_at: null
    }));
  });
  
  // Get valid user IDs from the users seed data
  const sampleUserIds = [
    'usr_admin_01',
    ...Array.from({ length: 10 }, (_, i) => `usr_inst_${i + 1}`),
    ...Array.from({ length: 9 }, (_, i) => `usr_std_${i + 1}`)
  ];
  
  // Create topics with valid user IDs
  export const forumTopics: SeedForumTopic[] = forumSubcategories.flatMap(subcategory => {
    return Array.from({ length: 2 }, (_, i) => ({
      id: generateId('forum_topic'),
      category_id: subcategory.category_id,
      subcategory_id: subcategory.id,
      author_id: sampleUserIds[Math.floor(Math.random() * sampleUserIds.length)],
      title: `Discussion about ${subcategory.name} - ${i + 1}`,
      content: `This is a discussion about ${subcategory.name}. Let's share our knowledge and experiences.`,
      views: Math.floor(Math.random() * 1000),
      is_pinned: false,
      is_locked: false,
      is_approved: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_post_at: new Date().toISOString(),
      is_deleted: false,
      deleted_at: null
    }));
  });
  
  // Create posts with valid user IDs
  export const forumPosts = forumTopics.flatMap(topic => {
    return Array.from({ length: 3 }, (_, i) => ({
      id: generateId('forum_post'),
      topic_id: topic.id,
      parent_id: null,
      author_id: sampleUserIds[Math.floor(Math.random() * sampleUserIds.length)],
      content: `This is reply #${i + 1} to the topic about ${topic.title}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      
    }));
  });