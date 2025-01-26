import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Shadcn/tabs';
import styles from './settings.module.scss';
import { BillingSettings } from './BillingSettings/BillingSettings';
import { SecuritySettings } from './SecuritySettings/SecuritySettings';
import { NotificationSettings } from './NotificationSettings/NotificationSettings';
import { ProfileSettings } from './ProfileSettings/ProfileSettings';

export default function SettingsPage() {
  return (
    <div className={styles.settingsContainer}>
      <header className={styles.header}>
        <h1>Account Settings</h1>
        <p>Manage your account settings and preferences</p>
      </header>

      <Tabs defaultValue="profile" className={styles.tabs}>
        <TabsList className={styles.tabsList}>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <div className={styles.tabContent}>
          <TabsContent value="profile">
            <ProfileSettings />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationSettings />
          </TabsContent>

          <TabsContent value="security">
            <SecuritySettings />
          </TabsContent>

          <TabsContent value="billing">
            <BillingSettings />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
