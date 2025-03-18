"use client"
import { motion } from 'framer-motion';
import { Handshake } from 'lucide-react';

import styles from './partners.module.scss';
import { PartnerContactForm } from '@/components/partners/PartnerContactForm/PartnerContactForm';
import { PartnershipBenefits } from '@/components/partners/PartnershipBenefits/PartnershipBenefits';
import { PartnershipProcess } from '@/components/partners/PartnershipProcess/PartnershipProcess';
import { PartnershipTypeCards } from '@/components/partners/PartnershipTypeCards/PartnershipTypeCards';
import { PartnersList } from '@/components/partners/PartnersList/PartnersList';
import { PartnerTestimonials } from '@/components/partners/PartnerTestimonials/PartnerTestimonials';


export default function PartnersPage() {
  return (
    <div className={styles.partnersContainer}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <motion.div
          className={styles.heroContent}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className={styles.heroIconWrapper}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Handshake size={48} className={styles.heroIcon} />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Partner With CyberFort
          </motion.h1>
          <motion.p
            className={styles.heroSubtext}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Join forces with us to create a more secure digital future. Our partnership program offers collaboration opportunities for businesses, educational institutions, and cybersecurity experts.
          </motion.p>
        </motion.div>
      </section>

      {/* Current Partners Section */}
      <section className={styles.partnersSection}>
        <div className={styles.sectionHeader}>
          <h2>Our Trusted Partners</h2>
          <p>Collaborating with industry leaders to deliver exceptional cybersecurity solutions</p>
        </div>
        <PartnersList />
      </section>

      {/* Partnership Types Section */}
      <section className={styles.partnershipTypesSection}>
        <div className={styles.sectionHeader}>
          <h2>Partnership Opportunities</h2>
          <p>Explore the different ways to partner with CyberFort</p>
        </div>
        <PartnershipTypeCards />
      </section>

      {/* Benefits Section */}
      <section className={styles.benefitsSection}>
        <div className={styles.sectionHeader}>
          <h2>Partnership Benefits</h2>
          <p>Why partnering with CyberFort is a smart business decision</p>
        </div>
        <PartnershipBenefits />
      </section>

      {/* Partnership Process Section */}
      <section className={styles.processSection}>
        <div className={styles.sectionHeader}>
          <h2>How Our Partnership Works</h2>
          <p>A simple process to establish a successful collaboration</p>
        </div>
        <PartnershipProcess />
      </section>

      {/* Testimonials Section */}
      <section className={styles.testimonialsSection}>
        <div className={styles.sectionHeader}>
          <h2>Partner Success Stories</h2>
          <p>Hear what our partners have to say about working with us</p>
        </div>
        <PartnerTestimonials />
      </section>

      {/* Contact Form Section */}
      <section className={styles.contactSection}>
        <div className={styles.sectionHeader}>
          <h2>Become a Partner</h2>
          <p>Interested in partnering with us? Fill out the form below to get started</p>
        </div>
        <PartnerContactForm />
      </section>
    </div>
  );
}