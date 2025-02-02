"use client"
// src/components/dashboard/settings/NotificationSettings/NotificationSettings.tsx
import { useState } from 'react';
// import { Switch } from '@/components/ui/switch';
// import { Button } from '@/components/ui/button';
import styles from './NotificationSettings.module.scss';
import { Switch } from '@heroui/switch';
import { Button } from '@/components/common/Button/Button';

type NotificationSetting = {
  id: string;
  title: string;
  description: string;
  email: boolean;
  push: boolean;
  category: 'course' | 'account' | 'marketing';
};

export function NotificationSettings() {
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: 'course_updates',
      title: 'Course Updates',
      description: 'Get notified when new course content is available',
      email: true,
      push: true,
      category: 'course',
    },
    {
      id: 'assignments',
      title: 'Assignment Reminders',
      description: 'Receive reminders about upcoming assignments and deadlines',
      email: true,
      push: true,
      category: 'course',
    },
    {
      id: 'discussions',
      title: 'Discussion Replies',
      description: 'Get notified when someone replies to your discussion posts',
      email: false,
      push: true,
      category: 'course',
    },
    {
      id: 'account_security',
      title: 'Security Alerts',
      description: 'Important notifications about your account security',
      email: true,
      push: true,
      category: 'account',
    },
    {
      id: 'billing',
      title: 'Billing Updates',
      description: 'Receive invoices and payment confirmations',
      email: true,
      push: false,
      category: 'account',
    },
    {
      id: 'promotions',
      title: 'Promotions & Offers',
      description: 'Stay updated with special offers and new courses',
      email: false,
      push: false,
      category: 'marketing',
    },
  ]);

  const handleToggle = (
    settingId: string,
    type: 'email' | 'push',
    value: boolean
  ) => {
    setSettings(settings.map(setting => 
      setting.id === settingId 
        ? { ...setting, [type]: value }
        : setting
    ));
  };

  const handleSave = () => {
    // Save notification settings to backend
    // console.log('Saving settings:', settings);
  };

  const categories = {
    course: 'Course Notifications',
    account: 'Account Notifications',
    marketing: 'Marketing Notifications',
  };

  return (
    <div className={styles.notificationSettings}>
      <div className={styles.header}>
        <h2>Notification Settings</h2>
        <p>Manage how you receive notifications</p>
      </div>

      <div className={styles.channels}>
        <div className={styles.channelHeader}>
          <div className={styles.channelTitle}></div>
          <div className={styles.channelTypes}>
            <span>Email</span>
            <span>Push</span>
          </div>
        </div>

        {Object.entries(categories).map(([category, title]) => (
          <div key={category} className={styles.category}>
            <h3>{title}</h3>
            
            <div className={styles.settings}>
              {settings
                .filter(setting => setting.category === category)
                .map(setting => (
                  <div key={setting.id} className={styles.setting}>
                    <div className={styles.settingInfo}>
                      <h4>{setting.title}</h4>
                      <p>{setting.description}</p>
                    </div>

                    <div className={styles.toggles}>
                      <Switch
                        checked={setting.email}
                        onChange={(e) => 
                          handleToggle(setting.id, 'email', e.target.checked)
                        }
                      />
                      <Switch
                        checked={setting.push}
                        onChange={(e) => 
                          handleToggle(setting.id, 'push', e.target.checked)
                        }
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.actions}>
        <Button size="lg" onClick={handleSave}>
          Save Preferences
        </Button>
      </div>
    </div>
  );
}