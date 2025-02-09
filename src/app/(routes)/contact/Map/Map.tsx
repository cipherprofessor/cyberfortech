"use client"
import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import styles from './Map.module.scss';

const offices = [
  {
    id: 1,
    city: "New York",
    address: "123 Tech Street, NY 10001",
    phone: "+1 (555) 123-4567",
    email: "ny@cyberfortech.com",
    hours: "9:00 AM - 6:00 PM EST",
    coordinates: { lat: 40.7128, lng: -74.0060 }
  },
  {
    id: 2,
    city: "San Francisco",
    address: "456 Innovation Ave, CA 94105",
    phone: "+1 (555) 987-6543",
    email: "sf@cyberfortech.com",
    hours: "9:00 AM - 6:00 PM PST",
    coordinates: { lat: 37.7749, lng: -122.4194 }
  }
];

export function OfficeLocations() {
  const [activeOffice, setActiveOffice] = useState(offices[0]);

  return (
    <div className={styles.officeSection}>
      <motion.h3 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={styles.sectionTitle}
      >
        Our Offices
      </motion.h3>

      <div className={styles.officeContainer}>
        <div className={styles.officeList}>
          {offices.map((office) => (
            <motion.div
              key={office.id}
              className={`${styles.officeCard} ${activeOffice.id === office.id ? styles.active : ''}`}
              onClick={() => setActiveOffice(office)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h4>{office.city}</h4>
              <div className={styles.officeDetails}>
                <div className={styles.detailItem}>
                  <MapPin size={16} />
                  <span>{office.address}</span>
                </div>
                <div className={styles.detailItem}>
                  <Phone size={16} />
                  <span>{office.phone}</span>
                </div>
                <div className={styles.detailItem}>
                  <Mail size={16} />
                  <span>{office.email}</span>
                </div>
                <div className={styles.detailItem}>
                  <Clock size={16} />
                  <span>{office.hours}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className={styles.mapContainer}>
          <iframe
            src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${activeOffice.coordinates.lat},${activeOffice.coordinates.lng}`}
            width="100%"
            height="100%"
            style={{ border: 0, borderRadius: '0.75rem' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
}