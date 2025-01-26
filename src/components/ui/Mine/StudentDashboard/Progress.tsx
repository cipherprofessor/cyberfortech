'use client' 
// src/components/ui/Mine/StudentDashboard/Progress.tsx
import React from 'react';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { AnimatedPinDemo } from '../../AcUI/AnimatedPinDemo/AnimatedPinDemo';
import { PinContainer } from '../../AcUI/AnimatedPinDemo/3d-pin';

interface ProgressData {
  date: string;
  progress: number;
}

export const Progress = () => {
  const [progressData, setProgressData] = React.useState<ProgressData[]>([]);

  React.useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await axios.get('/api/student/progress');
        setProgressData(response.data);
      } catch (error) {
        console.error('Error fetching progress:', error);
      }
    };

    fetchProgress();
  }, []);

  return (
    <div className="w-full p-8 bg-white rounded-xl shadow-lg">
      <PinContainer>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="progress" 
                stroke="#2563eb"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </PinContainer>
    </div>
  );
};