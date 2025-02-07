// src/components/TeamCard/TeamCard.tsx
"use client"
import { motion } from 'framer-motion';
import Image from 'next/image';
import { 
  Linkedin, 
  Twitter, 
  Github, 
  Mail, 
  Globe, 
  MapPin, 
  Medal,
  Calendar,
  Briefcase,
  MessageCircle
} from 'lucide-react';
import styles from './TeamCard.module.scss';
import { Chip } from '@heroui/react';

interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  github?: string;
  email?: string;
  website?: string;
  instagram?: string;
  youtube?: string;
  medium?: string;
}

interface TeamMemberProps {
  name: string;
  role: string;
  image: string;
  bio: string;
  specialization?: string[];
  experience?: string;
  achievements?: string[];
  certifications?: string[];
  location?: string;
  availability?: string;
  projects?: number;
  contactInfo?: {
    email?: string;
    phone?: string;
    skype?: string;
  };
  socialLinks: SocialLinks;
  cardColor?: 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'indigo';
}

export function TeamCard({
  name,
  role,
  image,
  bio,
  cardColor = 'blue',
  specialization = [],
  experience,
  achievements = [],
  certifications = [],
  location,
  availability,
  projects,
  contactInfo,
  socialLinks
}: TeamMemberProps) {
  return (
    <motion.div 
    className={`${styles.card} ${styles[cardColor]}`} 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.imageSection}>
        <motion.div 
          className={styles.imageWrapper}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <Image
            src={image}
            alt={name}
            width={300}
            height={300}
            className={styles.image}
          />
        </motion.div>
        <div className={styles.quickInfo}>
          {location && (
            <div className={styles.locationBadge}>
              <MapPin size={14} />
              <span>{location}</span>
            </div>
          )}
          {projects && (
            <div className={styles.projectsBadge}>
              <Briefcase size={14} />
              <span>{projects}+ Projects</span>
            </div>
          )}
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className={styles.name}>{name}</h3>
            <div className={styles.roleChip}>{role}</div>
          </motion.div>
        </div>

        <p className={styles.bio}>{bio}</p>

        {experience && (
          <div className={styles.experienceChip}>
            <Chip color="default" variant="shadow">
            <span>{experience}</span>
      </Chip>
            {/* <Calendar size={24} /> */}
            
          </div>
        )}

        {specialization.length > 0 && (
          <div className={styles.tags}>
            {specialization.map((skill, index) => (
              <motion.span 
                key={skill}
                className={styles.tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                {skill}
              </motion.span>
            ))}
          </div>
        )}

        {achievements.length > 0 && (
          <div className={styles.achievements}>
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                className={styles.achievement}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <Medal size={34} className={styles.achievementIcon} />
                <span>{achievement}</span>
              </motion.div>
            ))}
          </div>
        )}

        {availability && (
          <div className={`${styles.availabilityBadge} ${styles.available}`}>
            {availability}
          </div>
        )}

        <div className={styles.socialLinks}>
          {socialLinks.linkedin && (
            <motion.a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.socialLink} ${styles.linkedin}`}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <Linkedin size={16} />
            </motion.a>
          )}
          {socialLinks.twitter && (
            <motion.a
              href={socialLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.socialLink} ${styles.twitter}`}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <Twitter size={16} />
            </motion.a>
          )}
          {socialLinks.github && (
            <motion.a
              href={socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.socialLink} ${styles.github}`}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <Github size={16} />
            </motion.a>
          )}
          {contactInfo?.email && (
            <motion.a
              href={`mailto:${contactInfo.email}`}
              className={`${styles.socialLink} ${styles.email}`}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <Mail size={16} />
            </motion.a>
          )}
          {socialLinks.website && (
            <motion.a
              href={socialLinks.website}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.socialLink} ${styles.website}`}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <Globe size={16} />
            </motion.a>
          )}
          {contactInfo?.skype && (
            <motion.a
              href={`skype:${contactInfo.skype}?chat`}
              className={`${styles.socialLink} ${styles.skype}`}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <MessageCircle size={15} />
            </motion.a>
          )}
        </div>
      </div>
    </motion.div>
  );
}