'use client' 
// src/components/ui/Mine/StudentDashboard/Discussions.tsx
import React from 'react';

import axios from 'axios';
import { TextRevealCard, TextRevealCardDescription, TextRevealCardTitle } from '../../AcUI/text-reveal-card';

interface Discussion {
  id: string;
  title: string;
  description: string;
  participants: number;
  lastActivity: string;
}

export const Discussions = () => {
  const [discussions, setDiscussions] = React.useState<Discussion[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');

  React.useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        const response = await axios.get('/api/student/discussions');
        setDiscussions(response.data);
      } catch (error) {
        console.error('Error fetching discussions:', error);
      }
    };

    fetchDiscussions();
  }, []);

  return (
    <div className="p-8 space-y-8">
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search discussions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          New Discussion
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {discussions.map((discussion) => (
          <TextRevealCard
            key={discussion.id}
            text={discussion.title}
            revealText={discussion.description}
          >
            <TextRevealCardTitle>{discussion.title}</TextRevealCardTitle>
            <TextRevealCardDescription>
              {discussion.participants} participants • Last active {discussion.lastActivity}
            </TextRevealCardDescription>
          </TextRevealCard>
        ))}
      </div>
    </div>
  );
};