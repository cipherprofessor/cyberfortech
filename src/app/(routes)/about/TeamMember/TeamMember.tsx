import Image from 'next/image';
import { Linkedin, Twitter } from 'lucide-react';
import styles from './TeamMember.module.scss';

type TeamMemberProps = {
  member: {
    name: string;
    role: string;
    image: string;
    bio: string;
    socialLinks: {
      linkedin?: string;
      twitter?: string;
    };
  };
};

export function TeamMember({ member }: TeamMemberProps) {
  return (
    <div className={styles.memberCard}>
      <div className={styles.imageContainer}>
        <Image
          src={member.image}
          alt={member.name}
          fill
          className={styles.image}
        />
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.name}>{member.name}</h3>
        <p className={styles.role}>{member.role}</p>
        <p className={styles.bio}>{member.bio}</p>
        
        <div className={styles.socialLinks}>
          {member.socialLinks.linkedin && (
            <a 
              href={member.socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              <Linkedin className={styles.icon} />
            </a>
          )}
          
          {member.socialLinks.twitter && (
            <a 
              href={member.socialLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              <Twitter className={styles.icon} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
