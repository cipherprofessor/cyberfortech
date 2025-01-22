// src/components/TopicsList/TopicsList.tsx
import Image from 'next/image';
import { Pin, Lock, MessageCircle, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Author {
  name: string;
  avatar: string;
  reputation: number;
  badge: string;
}

interface LastReply {
  author: string;
  timestamp: string;
}

interface Topic {
  id: number;
  title: string;
  category: string;
  author: Author;
  replies: number;
  views: number;
  lastReply: LastReply;
  isPinned?: boolean;
  isLocked?: boolean;
  timestamp: string;
}

interface TopicsListProps {
  topics: Topic[];
}

export const TopicsList: React.FC<TopicsListProps> = ({ topics }) => {
  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="bg-gray-100 px-4 py-3 font-semibold text-gray-700 border-b">
        Recent Topics
      </div>
      {topics.map(topic => (
        <div 
          key={topic.id} 
          className="flex items-center px-4 py-3 border-b hover:bg-gray-50 transition-colors"
        >
          <div className="flex-shrink-0 mr-4">
            <div className="relative">
              <Image 
                src={topic.author.avatar} 
                alt={topic.author.name}
                width={40} 
                height={40} 
                className="rounded-full"
              />
              {topic.isPinned && (
                <Pin 
                  className="absolute -top-1 -right-1 text-yellow-500" 
                  size={16} 
                />
              )}
              {topic.isLocked && (
                <Lock 
                  className="absolute -bottom-1 -right-1 text-red-500" 
                  size={16} 
                />
              )}
            </div>
          </div>
          
          <div className="flex-grow">
            <div className="flex items-center space-x-2">
              <a 
                href={`/forum/topic/${topic.id}`} 
                className="font-semibold text-gray-800 hover:text-blue-600 transition-colors"
              >
                {topic.title}
              </a>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                {topic.category}
              </span>
            </div>
            
            <div className="text-xs text-gray-500 mt-1">
              Started by {topic.author.name} 
              {' • '}
              {formatDistanceToNow(new Date(topic.timestamp), { addSuffix: true })}
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-gray-500">
            <div className="flex items-center space-x-1">
              <MessageCircle size={16} />
              <span className="text-sm">{topic.replies}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <Eye size={16} />
              <span className="text-sm">{topic.views}</span>
            </div>
            
            <div className="text-xs text-gray-500">
              Last reply by {topic.lastReply.author}
              {' • '}
              {formatDistanceToNow(new Date(topic.lastReply.timestamp), { addSuffix: true })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};