// mockData.ts
export const mockData = {
    columns: [
      {
        id: 'new',
        title: 'NEW',
        count: 4,
        color: '#7B68EE',
        tasks: [
          {
            id: 'task-1',
            taskNumber: '#SHG-01',
            title: 'Update Website Content',
            description: 'Update the main landing page content with new product features and benefits.',
            priority: 'High',
            status: 'NEW',
            tags: [
              { id: 'tag-1', name: 'Development', color: '#4A90E2' },
              { id: 'tag-2', name: 'Frontend', color: '#50C878' }
            ],
            assignees: [
              { id: 'user-1', name: 'John Doe', avatar: '/avatars/john.jpg' },
              { id: 'user-2', name: 'Jane Smith', avatar: '/avatars/jane.jpg' }
            ],
            likes: 11,
            comments: 2,
            createdAt: '2024-02-15T10:00:00Z',
            updatedAt: '2024-02-15T10:00:00Z'
          },
          {
            id: 'task-2',
            taskNumber: '#SHG-02',
            title: 'Implement User Authentication',
            description: 'Set up OAuth2 authentication flow with support for Google and GitHub.',
            priority: 'High',
            status: 'NEW',
            tags: [
              { id: 'tag-3', name: 'Security', color: '#FF4757' },
              { id: 'tag-4', name: 'Backend', color: '#8A2BE2' }
            ],
            assignees: [
              { id: 'user-3', name: 'Alice Johnson', avatar: '/avatars/alice.jpg' }
            ],
            likes: 8,
            comments: 5,
            createdAt: '2024-02-15T11:00:00Z',
            updatedAt: '2024-02-15T11:00:00Z'
          }
        ]
      },
      {
        id: 'todo',
        title: 'TODO',
        count: 3,
        color: '#FF69B4',
        tasks: [
          {
            id: 'task-3',
            taskNumber: '#SHG-03',
            title: 'Design System Implementation',
            description: 'Create a comprehensive design system with reusable components.',
            priority: 'Medium',
            status: 'TODO',
            tags: [
              { id: 'tag-5', name: 'Design', color: '#FF8C00' },
              { id: 'tag-6', name: 'UI/UX', color: '#20B2AA' }
            ],
            assignees: [
              { id: 'user-4', name: 'Bob Wilson', avatar: '/avatars/bob.jpg' },
              { id: 'user-5', name: 'Carol White', avatar: '/avatars/carol.jpg' }
            ],
            likes: 15,
            comments: 7,
            createdAt: '2024-02-14T09:00:00Z',
            updatedAt: '2024-02-14T09:00:00Z'
          }
        ]
      },
      {
        id: 'in-progress',
        title: 'ON GOING',
        count: 5,
        color: '#FF7F50',
        tasks: [
          {
            id: 'task-4',
            taskNumber: '#SHG-04',
            title: 'Mobile Responsive Layout',
            description: 'Ensure all pages are fully responsive on mobile devices.',
            priority: 'High',
            status: 'ON GOING',
            tags: [
              { id: 'tag-7', name: 'Mobile', color: '#FF69B4' },
              { id: 'tag-8', name: 'CSS', color: '#4169E1' }
            ],
            assignees: [
              { id: 'user-6', name: 'David Brown', avatar: '/avatars/david.jpg' }
            ],
            likes: 6,
            comments: 3,
            createdAt: '2024-02-13T14:00:00Z',
            updatedAt: '2024-02-13T14:00:00Z'
          },
          {
            id: 'task-5',
            taskNumber: '#SHG-05',
            title: 'API Documentation',
            description: 'Create comprehensive API documentation using Swagger.',
            priority: 'Medium',
            status: 'ON GOING',
            tags: [
              { id: 'tag-9', name: 'Documentation', color: '#9370DB' }
            ],
            assignees: [
              { id: 'user-7', name: 'Emma Davis', avatar: '/avatars/emma.jpg' },
              { id: 'user-8', name: 'Frank Miller', avatar: '/avatars/frank.jpg' }
            ],
            likes: 12,
            comments: 8,
            createdAt: '2024-02-12T16:00:00Z',
            updatedAt: '2024-02-12T16:00:00Z'
          }
        ]
      },
      {
        id: 'in-review',
        title: 'IN REVIEW',
        count: 2,
        color: '#FFA500',
        tasks: [
          {
            id: 'task-6',
            taskNumber: '#SHG-06',
            title: 'Performance Optimization',
            description: 'Optimize application performance and loading times.',
            priority: 'High',
            status: 'IN REVIEW',
            tags: [
              { id: 'tag-10', name: 'Performance', color: '#DC143C' },
              { id: 'tag-11', name: 'Optimization', color: '#32CD32' }
            ],
            assignees: [
              { id: 'user-9', name: 'Grace Lee', avatar: '/avatars/grace.jpg' }
            ],
            likes: 9,
            comments: 4,
            createdAt: '2024-02-11T13:00:00Z',
            updatedAt: '2024-02-11T13:00:00Z'
          }
        ]
      },
      {
        id: 'completed',
        title: 'COMPLETED',
        count: 3,
        color: '#98FB98',
        tasks: [
          {
            id: 'task-7',
            taskNumber: '#SHG-07',
            title: 'User Analytics Dashboard',
            description: 'Implement analytics dashboard with charts and metrics.',
            priority: 'Medium',
            status: 'COMPLETED',
            tags: [
              { id: 'tag-12', name: 'Analytics', color: '#4682B4' },
              { id: 'tag-13', name: 'Dashboard', color: '#9932CC' }
            ],
            assignees: [
              { id: 'user-10', name: 'Henry Wilson', avatar: '/avatars/henry.jpg' },
              { id: 'user-11', name: 'Ivy Chen', avatar: '/avatars/ivy.jpg' }
            ],
            likes: 18,
            comments: 6,
            createdAt: '2024-02-10T15:00:00Z',
            updatedAt: '2024-02-10T15:00:00Z'
          }
        ]
      }
    ]
  };
  
  // Additional mock data for users
  export const mockUsers = [
    { id: 'user-1', name: 'John Doe', avatar: '/avatars/john.jpg', role: 'Developer' },
    { id: 'user-2', name: 'Jane Smith', avatar: '/avatars/jane.jpg', role: 'Designer' },
    { id: 'user-3', name: 'Alice Johnson', avatar: '/avatars/alice.jpg', role: 'Project Manager' },
    { id: 'user-4', name: 'Bob Wilson', avatar: '/avatars/bob.jpg', role: 'Developer' },
    { id: 'user-5', name: 'Carol White', avatar: '/avatars/carol.jpg', role: 'UX Designer' },
    { id: 'user-6', name: 'David Brown', avatar: '/avatars/david.jpg', role: 'Frontend Developer' },
    { id: 'user-7', name: 'Emma Davis', avatar: '/avatars/emma.jpg', role: 'Backend Developer' },
    { id: 'user-8', name: 'Frank Miller', avatar: '/avatars/frank.jpg', role: 'DevOps Engineer' },
    { id: 'user-9', name: 'Grace Lee', avatar: '/avatars/grace.jpg', role: 'QA Engineer' },
    { id: 'user-10', name: 'Henry Wilson', avatar: '/avatars/henry.jpg', role: 'Full Stack Developer' },
    { id: 'user-11', name: 'Ivy Chen', avatar: '/avatars/ivy.jpg', role: 'Product Manager' },
    { id: 'user-12', name: 'Jack Thompson', avatar: '/avatars/jack.jpg', role: 'UI Designer' },
    { id: 'user-13', name: 'Kelly Martinez', avatar: '/avatars/kelly.jpg', role: 'Content Writer' },
    { id: 'user-14', name: 'Leo Anderson', avatar: '/avatars/leo.jpg', role: 'Marketing Specialist' },
    { id: 'user-15', name: 'Maya Patel', avatar: '/avatars/maya.jpg', role: 'Business Analyst' }
  ];