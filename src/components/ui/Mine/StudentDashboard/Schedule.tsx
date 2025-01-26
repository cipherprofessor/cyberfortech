// src/components/ui/Mine/StudentDashboard/Schedule.tsx
'use client' 
import React from 'react';

import { motion } from 'framer-motion';
import axios from 'axios';
import { StickyScroll } from '../../AcUI/sticky-scroll-reveal';

interface ScheduleEvent {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  type: 'lecture' | 'assignment' | 'exam';
  description: string;
}

export const Schedule = () => {
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
  const [events, setEvents] = React.useState<ScheduleEvent[]>([]);

  React.useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/api/student/schedule');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching schedule:', error);
      }
    };

    fetchEvents();
  }, []);

  const content = events.map(event => ({
    title: event.title,
    description: `${event.startTime} - ${event.endTime}\n${event.description}`,
  }));

  return (
    <div className="h-[calc(100vh-4rem)] w-full">
      <StickyScroll content={content} />
      <div className="p-8">
        <div className="grid gap-4">
          {events.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{event.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {event.startTime} - {event.endTime}
                  </p>
                  <p className="mt-2">{event.description}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  event.type === 'lecture' ? 'bg-blue-100 text-blue-800' :
                  event.type === 'assignment' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {event.type}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};