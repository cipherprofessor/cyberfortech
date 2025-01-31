// src/components/ForumStats/ForumStats.tsx
"use client";

import { useEffect, useState } from 'react';
import { Users, MessageSquare, TrendingUp, UserPlus } from 'lucide-react';
import axios from 'axios';

interface ForumStatsData {
  totalTopics: number;
  totalPosts: number;
  activeUsers: number;
  latestMember: string;
}

export const ForumStats = () => {
  const [stats, setStats] = useState<ForumStatsData>({
    totalTopics: 0,
    totalPosts: 0,
    activeUsers: 0,
    latestMember: 'Loading...'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/forum/stats');
      setStats(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching forum stats:', err);
      setError('Failed to load forum statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    // Refresh stats every minute
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, []);

  // Update user activity when component mounts
  useEffect(() => {
    const updateActivity = async () => {
      try {
        await axios.post('/api/forum/stats');
      } catch (err) {
        console.error('Error updating activity:', err);
      }
    };

    updateActivity();
  }, []);

  if (error) {
    return (
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="p-4 text-red-500 text-center">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="bg-gray-100 px-4 py-3 font-semibold text-gray-700 border-b">
        Forum Statistics
      </div>
      
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MessageSquare className="text-blue-500" size={24} />
            <span className="text-gray-700">Total Topics</span>
          </div>
          <span className="font-semibold text-gray-800">
            {loading ? '...' : stats.totalTopics.toLocaleString()}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <TrendingUp className="text-green-500" size={24} />
            <span className="text-gray-700">Total Posts</span>
          </div>
          <span className="font-semibold text-gray-800">
            {loading ? '...' : stats.totalPosts.toLocaleString()}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Users className="text-purple-500" size={24} />
            <span className="text-gray-700">Active Users</span>
          </div>
          <span className="font-semibold text-gray-800">
            {loading ? '...' : stats.activeUsers.toLocaleString()}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <UserPlus className="text-red-500" size={24} />
            <span className="text-gray-700">Latest Member</span>
          </div>
          <span className="font-semibold text-gray-800">
            {loading ? '...' : stats.latestMember}
          </span>
        </div>
      </div>
    </div>
  );
};