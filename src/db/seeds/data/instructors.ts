// src/db/seeds/data/instructors.ts
import { SeedInstructor } from '../types';

// Array of instructor specializations matching course categories
const specializations = [
  { area: 'Web Development', details: 'Full Stack Development, React, Node.js' },
  { area: 'Cloud Computing', details: 'AWS, Azure, Google Cloud' },
  { area: 'Cybersecurity', details: 'Network Security, Ethical Hacking' },
  { area: 'Data Science', details: 'Python, Machine Learning, Data Analysis' },
  { area: 'Mobile Development', details: 'iOS, Android, React Native' },
  { area: 'DevOps', details: 'Docker, Kubernetes, CI/CD' },
  { area: 'Blockchain', details: 'Smart Contracts, DApps, Cryptocurrency' },
  { area: 'AI/ML', details: 'Deep Learning, Neural Networks, TensorFlow' },
  { area: 'Network Security', details: 'Penetration Testing, Security Analysis' },
  { area: 'Software Engineering', details: 'System Design, Architecture' }
];

const qualifications = [
  'PhD in Computer Science',
  'Master in Software Engineering',
  'Master in Information Security',
  'PhD in Data Science',
  'Master in Computer Engineering',
  'Master in Artificial Intelligence',
  'PhD in Information Technology',
  'Master in Cybersecurity'
];

const locations = [
  'San Francisco, CA',
  'New York, NY',
  'London, UK',
  'Toronto, Canada',
  'Berlin, Germany',
  'Singapore',
  'Sydney, Australia',
  'Amsterdam, Netherlands',
  'Tokyo, Japan',
  'Dublin, Ireland'
];

function generateInstructorId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

function generateUserId(): string {
  return 'usr_' + generateInstructorId();
}

export const instructors: SeedInstructor[] = [
  // Previously defined instructors remain the same
  {
    id: '1b9888c9-574d-408e-b1eb-426bae43da4e',
    name: 'John Smith',
    email: 'john.smith@example.com',
    bio: 'Frontend and backend development expert specializing in modern web technologies',
    contact_number: '+1-234-567-8901',
    address: 'San Francisco, CA',
    profile_image_url: 'https://ui-avatars.com/api/?name=John+Smith',
    specialization: 'Full Stack Development, React, Node.js',
    qualification: 'Master in Computer Science',
    years_of_experience: 10,
    rating: 4.8,
    total_students: 1500,
    total_courses: 8,
    social_links: JSON.stringify({
      linkedin: 'https://linkedin.com/in/johnsmith',
      twitter: 'https://twitter.com/johnsmith',
      github: 'https://github.com/johnsmith'
    }),
    status: 'active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    user_id: 'usr_3a7777b1-796f-62af-d3gd-648dbf65fc6g'
  },
  // ... other existing instructors ...
];

// Generate 20 more diverse instructors
const instructorNames = [
  'Emma Thompson', 'Carlos Rodriguez', 'Sophia Chen', 'Alexander Kim',
  'Maria Garcia', 'David Patel', 'Aisha Khan', 'James Wilson',
  'Yuki Tanaka', 'Lucas Silva', 'Nina Patel', 'Omar Hassan',
  'Julia Schmidt', 'Wei Zhang', 'Elena Popov', 'Marco Rossi',
  'Priya Sharma', 'Thomas Anderson', 'Leila Nasser', 'Viktor Ivanov'
];

instructorNames.forEach((name, index) => {
  const specialization = specializations[index % specializations.length];
  const qualification = qualifications[index % qualifications.length];
  const location = locations[index % locations.length];
  
  instructors.push({
    id: generateInstructorId(),
    name,
    email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
    bio: `Expert in ${specialization.area} specializing in ${specialization.details}`,
    contact_number: `+1-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
    address: location,
    profile_image_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`,
    specialization: specialization.details,
    qualification,
    years_of_experience: Math.floor(Math.random() * 15) + 5,
    rating: Number((Math.random() * 1.5 + 3.5).toFixed(1)),
    total_students: Math.floor(Math.random() * 2000) + 500,
    total_courses: Math.floor(Math.random() * 8) + 2,
    social_links: JSON.stringify({
      linkedin: `https://linkedin.com/in/${name.toLowerCase().replace(' ', '')}`,
      twitter: `https://twitter.com/${name.toLowerCase().replace(' ', '')}`,
      github: `https://github.com/${name.toLowerCase().replace(' ', '')}`
    }),
    status: 'active',
    created_at: new Date(2024, 0, index + 1).toISOString(),
    updated_at: new Date(2024, 0, index + 1).toISOString(),
    user_id: generateUserId()
  });
});

export default instructors;