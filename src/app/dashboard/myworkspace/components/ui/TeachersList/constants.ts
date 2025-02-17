//src/app/dashboard/myworkspace/components/ui/TeachersList/constants.ts
export const AVAILABLE_COLUMNS = {
    instructor: { label: 'Instructor', default: true },
    specialization: { label: 'Specialization', default: true },
    bio: { label: 'Bio', default: true },
    contact: { label: 'Contact Number', default: true },
    rating: { label: 'Rating', default: true },
    total_courses: { label: 'Total Courses', default: true },
    total_students: { label: 'Total Students', default: true },
    social_links: { label: 'Social Links', default: true },
    qualification: { label: 'Qualification', default: false },
    address: { label: 'Address', default: false },
    years_of_experience: { label: 'Experience', default: false },
    status: { label: 'Status', default: false },
    created_at: { label: 'Created At', default: false },
    updated_at: { label: 'Updated At', default: false }
  } as const;
  
  export const subjectColors: Record<string, string> = {
    'Full Stack Development': '#818cf8',
    'English': '#a78bfa',
    'Physics': '#ef4444',
    'Mathematics': '#10b981',
    'Chemistry': '#f59e0b',
    'Biology': '#3b82f6'
  };