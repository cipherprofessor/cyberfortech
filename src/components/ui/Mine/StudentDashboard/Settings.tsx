'use client' 
import React from 'react';
import { Label } from '@/components/ui/label';
import { Bell, Mail, Lock, User } from 'lucide-react';
import axios from 'axios';
import { Button } from '@heroui/button';
import { Card, CardHeader, Input, Switch } from '@heroui/react';
import { CardTitle, CardContent } from '../../card';

interface Settings {
  notifications: {
    email: boolean;
    push: boolean;
    courseUpdates: boolean;
    discussionMentions: boolean;
  };
  email: string;
  name: string;
}

export const Settings = () => {
  const [settings, setSettings] = React.useState<Settings>({
    notifications: {
      email: true,
      push: true,
      courseUpdates: true,
      discussionMentions: true,
    },
    email: '',
    name: '',
  });

  React.useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get('/api/student/settings');
        setSettings(response.data);
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    fetchSettings();
  }, []);

  const handleNotificationChange = (key: keyof Settings['notifications']) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key],
      },
    }));
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input
              value={settings.name}
              onChange={(e) => setSettings(prev => ({...prev,
                name: e.target.value,
              }))}
              placeholder="Your full name"
              className="max-w-md"
            />
          </div>
          <div className="space-y-2">
            <Label>Email Address</Label>
            <Input
              value={settings.email}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                email: e.target.value,
              }))}
              placeholder="your.email@example.com"
              className="max-w-md"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-gray-500">Receive course updates via email</p>
            </div>
            <Switch
              checked={settings.notifications.email}
              onChange={() => handleNotificationChange('email')}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Push Notifications</Label>
              <p className="text-sm text-gray-500">Receive notifications in your browser</p>
            </div>
            <Switch
              checked={settings.notifications.push}
              onChange={() => handleNotificationChange('push')}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Course Updates</Label>
              <p className="text-sm text-gray-500">Get notified about new course content</p>
            </div>
            <Switch
              checked={settings.notifications.courseUpdates}
              onChange={() => handleNotificationChange('courseUpdates')}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Discussion Mentions</Label>
              <p className="text-sm text-gray-500">Get notified when mentioned in discussions</p>
            </div>
            <Switch
              checked={settings.notifications.discussionMentions}
              onChange={() => handleNotificationChange('discussionMentions')}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button className="w-full md:w-auto">
          Save Changes
        </Button>
      </div>
    </div>
  );
};