"use client"
import { useState } from 'react';
import { KeyRound, Smartphone, Shield, Activity } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Switch } from '@/components/ui/switch';
import styles from './SecuritySettings.module.scss';
import { Button } from '@heroui/react';
import { Switch } from '@heroui/switch';

export function SecuritySettings() {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const loginHistory = [
    {
      date: '2024-01-20T10:30:00Z',
      device: 'Chrome on MacOS',
      location: 'New York, USA',
      status: 'success',
      ip: '192.168.1.1',
    },
    {
      date: '2024-01-19T15:45:00Z',
      device: 'Safari on iPhone',
      location: 'New York, USA',
      status: 'success',
      ip: '192.168.1.2',
    },
    {
      date: '2024-01-18T08:20:00Z',
      device: 'Firefox on Windows',
      location: 'Los Angeles, USA',
      status: 'failed',
      ip: '192.168.1.3',
    },
  ];

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    // Handle password change logic here
    setShowChangePassword(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handle2FAToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIs2FAEnabled(checked);
    if (checked) {
      // Implement 2FA setup flow
    }
  };

  return (
    <div className={styles.securitySettings}>
      <div className={styles.header}>
        <h2>Security Settings</h2>
        <p>Manage your account security preferences</p>
      </div>

      <div className={styles.securitySections}>
        {/* Password Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <KeyRound className={styles.icon} />
              <h3>Password</h3>
            </div>
            {!showChangePassword && (
              <Button 
                variant="bordered"
                onClick={() => setShowChangePassword(true)}
              >
                Change Password
              </Button>
            )}
          </div>

          {showChangePassword && (
            <form onSubmit={handlePasswordChange} className={styles.passwordForm}>
              <div className={styles.formGroup}>
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handleInputChange}
                  required
                  minLength={8}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handleInputChange}
                  required
                  minLength={8}
                />
                <span className={styles.passwordHint}>
                  Password must be at least 8 characters long
                </span>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  minLength={8}
                />
              </div>

              <div className={styles.formActions}>
                <Button 
                  type="submit"
                  disabled={
                    !passwordData.currentPassword ||
                    !passwordData.newPassword ||
                    !passwordData.confirmPassword ||
                    passwordData.newPassword !== passwordData.confirmPassword
                  }
                >
                  Update Password
                </Button>
                <Button 
                  type="button" 
                  variant="bordered"
                  onClick={() => {
                    setShowChangePassword(false);
                    setPasswordData({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: '',
                    });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </section>

        {/* 2FA Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <Smartphone className={styles.icon} />
              <h3>Two-Factor Authentication</h3>
            </div>
            <Switch
              checked={is2FAEnabled}
              onChange={handle2FAToggle}
            />
          </div>
          <p className={styles.sectionDescription}>
            Add an extra layer of security to your account by requiring both your
            password and a verification code from your phone.
          </p>
          {is2FAEnabled && (
            <div className={styles.twoFactorSetup}>
              <Button variant="bordered" className={styles.setupButton}>
                Configure 2FA
              </Button>
              <p className={styles.setupInfo}>
                You'll need an authenticator app like Google Authenticator or
                Authy to complete the setup.
              </p>
            </div>
          )}
        </section>

        {/* Security Recommendations */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <Shield className={styles.icon} />
              <h3>Security Recommendations</h3>
            </div>
          </div>
          <ul className={styles.recommendations}>
            <li className={`${styles.recommendation} ${is2FAEnabled ? styles.completed : ''}`}>
              {is2FAEnabled ? (
                '✓ Two-factor authentication is enabled'
              ) : (
                'Enable two-factor authentication for better security'
              )}
            </li>
            <li className={styles.recommendation}>
              Use a strong, unique password for your account
            </li>
            <li className={styles.recommendation}>
              Regularly review your login history for suspicious activity
            </li>
            <li className={styles.recommendation}>
              Never share your account credentials with others
            </li>
          </ul>
        </section>

        {/* Login History */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <Activity className={styles.icon} />
              <h3>Recent Login Activity</h3>
            </div>
          </div>
          <div className={styles.loginHistory}>
            {loginHistory.map((login, index) => (
              <div 
                key={index} 
                className={`${styles.loginItem} ${
                  login.status === 'failed' ? styles.failed : ''
                }`}
              >
                <div className={styles.loginInfo}>
                  <div className={styles.deviceInfo}>
                    <span className={styles.device}>{login.device}</span>
                    <span className={styles.ip}>IP: {login.ip}</span>
                  </div>
                  <span className={styles.location}>{login.location}</span>
                </div>
                <div className={styles.loginMeta}>
                  <time className={styles.date}>
                    {formatDate(login.date)}
                  </time>
                  <span className={`${styles.status} ${styles[login.status]}`}>
                    {login.status === 'success' ? 'Successful' : 'Failed'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}