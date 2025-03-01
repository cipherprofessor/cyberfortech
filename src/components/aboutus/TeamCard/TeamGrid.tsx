// src/components/TeamCard/TeamGrid.tsx
"use client"
import { TeamCard } from './TeamCard';
import styles from './TeamGrid.module.scss';

export interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
  specialization?: string[];
  experience?: string;
  achievements?: string[];
  location?: string;
  cardColor?: 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'indigo';
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    email?: string;
    website?: string;
  };
}

interface TeamGridProps {
  members: TeamMember | TeamMember[];
  centered?: boolean;
  cardColor?: 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'indigo';
}

export function TeamGrid({ members, centered = false }: TeamGridProps) {
    const teamMembers = Array.isArray(members) ? members : [members];
    const isSingleMember = teamMembers.length === 1;
  
    return (
      <div className={`${styles.teamGrid} ${isSingleMember ? styles.single : ''} ${centered ? styles.centered : ''}`}>
        {teamMembers.map((member, index) => (
          <TeamCard 
            key={member.name} 
            {...member}
            cardColor={member.cardColor || 'blue'} // Add this
          />
        ))}
      </div>
    );
  }