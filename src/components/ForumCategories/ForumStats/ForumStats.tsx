// src/components/ForumStats/ForumStats.tsx
import { Users, MessageSquare, TrendingUp, UserPlus } from 'lucide-react';

interface ForumStatsData {
  totalTopics: number;
  totalPosts: number;
  activeUsers: number;
  latestMember: string;
}

interface ForumStatsProps {
  stats: ForumStatsData;
}

export const ForumStats: React.FC<ForumStatsProps> = ({ stats }) => {
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
            {stats.totalTopics.toLocaleString()}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <TrendingUp className="text-green-500" size={24} />
            <span className="text-gray-700">Total Posts</span>
          </div>
          <span className="font-semibold text-gray-800">
            {stats.totalPosts.toLocaleString()}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Users className="text-purple-500" size={24} />
            <span className="text-gray-700">Active Users</span>
          </div>
          <span className="font-semibold text-gray-800">
            {stats.activeUsers.toLocaleString()}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <UserPlus className="text-red-500" size={24} />
            <span className="text-gray-700">Latest Member</span>
          </div>
          <span className="font-semibold text-gray-800">
            {stats.latestMember}
          </span>
        </div>
      </div>
    </div>
  );
};