// src/components/ui/Mine/StudentDashboard/StudentAnalytics.tsx
'use client';
import React from 'react';
import {
  LineChart,
  RadarChart,
  BarChart
} from '@/components/charts/Re-charts';
import {
  IconBrain,
  IconTrophy,
  IconTarget,
  IconClock
} from '@tabler/icons-react';

interface StudentAnalyticsProps {
  studentId: string;
  data: {
    assessments: {
      date: string;
      score: number;
      totalQuestions: number;
      timeSpent: number;
    }[];
    skillProgress: {
      skill: string;
      level: number;
      progress: number;
    }[];
    learningPath: {
      milestone: string;
      completed: boolean;
      dependsOn: string[];
    }[];
    engagementMetrics: {
      date: string;
      watchTime: number;
      interactions: number;
      completedLessons: number;
      practiceExercises: number;
    }[];
  };
}

const StudentAnalytics: React.FC<StudentAnalyticsProps> = ({ data }) => {
  // Format data for charts
  const assessmentData = data.assessments.map(a => ({
    date: a.date,
    score: (a.score / a.totalQuestions) * 100,
    timePerQuestion: a.timeSpent / a.totalQuestions
  }));

  const skillData = data.skillProgress.map(s => ({
    subject: s.skill,
    level: s.level,
    progress: s.progress
  }));

  const engagementData = data.engagementMetrics.map(e => ({
    date: e.date,
    watchTime: e.watchTime / 60, // Convert to hours
    interactions: e.interactions,
    lessons: e.completedLessons,
    exercises: e.practiceExercises
  }));

  return (
    <div className="space-y-6">
      {/* Assessment Performance */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-6 flex items-center">
          <IconBrain className="h-5 w-5 mr-2" />
          Assessment Performance
        </h3>
        <div className="h-[300px]">
          <LineChart
            data={assessmentData}
            lines={[
              {
                key: 'score',
                name: 'Score %',
                color: '#3B82F6'
              },
              {
                key: 'timePerQuestion',
                name: 'Time per Question (s)',
                color: '#F59E0B'
              }
            ]}
            xAxis="date"
          />
        </div>
      </div>

      {/* Skill Progress Radar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-6 flex items-center">
          <IconTrophy className="h-5 w-5 mr-2" />
          Skill Progress
        </h3>
        <div className="h-[400px]">
          <RadarChart
            data={skillData}
            series={[
              {
                dataKey: 'level',
                name: 'Skill Level',
                color: '#8B5CF6'
              },
              {
                dataKey: 'progress',
                name: 'Current Progress',
                color: '#10B981'
              }
            ]}
          />
        </div>
      </div>

      {/* Learning Path Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-6 flex items-center">
          <IconTarget className="h-5 w-5 mr-2" />
          Learning Path Progress
        </h3>
        <div className="space-y-4">
          {data.learningPath.map((milestone, index) => (
            <div 
              key={index}
              className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700"
            >
              <div className={`h-8 w-8 rounded-full flex items-center justify-center
                ${milestone.completed 
                  ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-200'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                }`}
              >
                {index + 1}
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  {milestone.milestone}
                </h4>
                {milestone.dependsOn.length > 0 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Requires: {milestone.dependsOn.join(', ')}
                  </p>
                )}
              </div>
              <div className={`text-sm font-medium
                ${milestone.completed 
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {milestone.completed ? 'Completed' : 'In Progress'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Engagement Metrics */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-6 flex items-center">
          <IconClock className="h-5 w-5 mr-2" />
          Daily Engagement
        </h3>
        <div className="h-[300px]">
          <BarChart
            data={engagementData.map(e => ({
              date: e.date,
              watchTime: e.watchTime,
              lessons: e.lessons,
              exercises: e.exercises
            }))}
            xAxis="date"
            bars={[
              {
                key: 'watchTime',
                name: 'Watch Time (hrs)',
                color: '#3B82F6'
              },
              {
                key: 'lessons',
                name: 'Completed Lessons',
                color: '#10B981'
              },
              {
                key: 'exercises',
                name: 'Practice Exercises',
                color: '#F59E0B'
              }
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default StudentAnalytics;