import { MapPin, Mail, Phone, Clock, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import styles from './ContactInfo.module.scss';

type Location = {
  title: string;
  address?: string;
  email: string;
  phone: string;
  hours?: string;
};

type ContactInfoProps = {
  locations: Location[];
};

export function ContactInfo({ locations }: ContactInfoProps) {
  return (
    <div className={styles.contactInfo}>
      {locations.map((location, index) => (
        <div key={index} className={styles.locationCard}>
          <h3>{location.title}</h3>
          
          {location.address && (
            <div className={styles.infoItem}>
              <MapPin className={styles.icon} />
              <span>{location.address}</span>
            </div>
          )}
          
          <div className={styles.infoItem}>
            <Mail className={styles.icon} />
            <a href={`mailto:${location.email}`}>{location.email}</a>
          </div>
          
          <div className={styles.infoItem}>
            <Phone className={styles.icon} />
            <a href={`tel:${location.phone}`}>{location.phone}</a>
          </div>
          
          {location.hours && (
            <div className={styles.infoItem}>
              <Clock className={styles.icon} />
              <span>{location.hours}</span>
            </div>
          )}
        </div>
      ))}
      
      <div className={styles.socialLinks}>
        <h3>Follow Us</h3>
        <div className={styles.socialIcons}>
          <a 
            href="https://facebook.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.socialIcon}
          >
            <Facebook className={styles.icon} />
          </a>
          <a 
            href="https://twitter.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.socialIcon}
          >
            <Twitter className={styles.icon} />
          </a>
          <a 
            href="https://linkedin.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.socialIcon}
          >
            <Linkedin className={styles.icon} />
          </a>
          <a 
            href="https://instagram.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.socialIcon}
          >
            <Instagram className={styles.icon} />
          </a>
        </div>
      </div>
    </div>
  );
}