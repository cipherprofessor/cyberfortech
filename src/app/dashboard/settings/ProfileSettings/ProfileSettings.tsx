"use client"
// src/components/dashboard/settings/ProfileSettings/ProfileSettings.tsx
import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Upload } from 'lucide-react';
import Image from 'next/image';
// import { Button } from '@/components/ui/button';
import styles from './ProfileSettings.module.scss';
import { Button } from '@/components/common/Button/Button';

export function ProfileSettings() {
  const { user } = useUser();
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.primaryEmailAddress?.emailAddress || '',
    bio: 'Full-stack developer with a passion for cybersecurity.',
    website: 'https://example.com',
    linkedin: 'johndoe',
    github: 'johndoe',
    twitter: 'johndoe',
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle profile update logic here
    setIsEditing(false);
  };

  return (
    <div className={styles.profileSettings}>
      <div className={styles.header}>
        <h2>Profile Settings</h2>
        <p>Update your personal information and public profile</p>
      </div>

      <div className={styles.avatarSection}>
        <div className={styles.avatarWrapper}>
          <Image
            src={user?.imageUrl || '/default-avatar.png'}
            alt="Profile"
            width={100}
            height={100}
            className={styles.avatar}
          />
          <button className={styles.uploadButton}>
            <Upload className={styles.uploadIcon} />
          </button>
        </div>
        <div className={styles.avatarInfo}>
          <h3>Profile Picture</h3>
          <p>Upload a new avatar or remove the current one</p>
          <div className={styles.avatarButtons}>
            <Button variant="outline" size="sm">
              Upload New
            </Button>
            <Button variant="outline" size="sm" className={styles.removeButton}>
              Remove
            </Button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSaveProfile} className={styles.form}>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={profileData.firstName}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={profileData.lastName}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={profileData.email}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="website">Website</label>
            <input
              type="url"
              id="website"
              name="website"
              value={profileData.website}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            value={profileData.bio}
            onChange={handleInputChange}
            disabled={!isEditing}
            rows={4}
          />
        </div>

        <div className={styles.socialLinks}>
          <h3>Social Links</h3>
          <div className={styles.socialGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="linkedin">LinkedIn Username</label>
              <input
                type="text"
                id="linkedin"
                name="linkedin"
                value={profileData.linkedin}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="github">GitHub Username</label>
              <input
                type="text"
                id="github"
                name="github"
                value={profileData.github}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="twitter">Twitter Username</label>
              <input
                type="text"
                id="twitter"
                name="twitter"
                value={profileData.twitter}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>

        <div className={styles.formActions}>
          {isEditing ? (
            <>
              <Button type="submit" size="lg">
                Save Changes
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              type="button"
              size="lg"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}