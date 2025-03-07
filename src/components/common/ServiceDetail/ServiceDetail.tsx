"use client";

import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, ExternalLink } from 'lucide-react';
import styles from './ServiceDetail.module.scss';
import { ServiceDetailProps } from './types';
import { createColorVars } from './colorUtils';


const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: "easeOut"
    }
  })
};

const ServiceDetail: React.FC<ServiceDetailProps> = ({
  title,
  description,
  icon: Icon,
  color = "#007bff",
  features = [],
  benefits = [],
  caseStudies = [],
  contactCTA = "Get a Free Consultation",
  className = "",
}) => {
  const controls = useAnimation();
  
  // Ensure the title is always available
  if (!title) {
    throw new Error("Title is required for ServiceDetail component");
  }
  
  // Start animations when component mounts
  useEffect(() => {
    controls.start("visible");
  }, [controls]);
  
  // Create CSS variables for the color
  const colorVars = createColorVars(color);

  return (
    <section 
      className={`${styles.serviceDetailSection} ${className}`}
      aria-labelledby="service-title"
    >
      <div className={styles.container}>
        {/* Breadcrumb */}
        <motion.nav 
          className={styles.breadcrumb}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          aria-label="Breadcrumb"
        >
          <Link href="/" className={styles.breadcrumbLink}>
            Home
          </Link>
          <span className={styles.breadcrumbSeparator} aria-hidden="true">/</span>
          <Link href="/services" className={styles.breadcrumbLink}>
            Services
          </Link>
          <span className={styles.breadcrumbSeparator} aria-hidden="true">/</span>
          <span className={styles.breadcrumbCurrent} aria-current="page">{title}</span>
        </motion.nav>

        {/* Back button */}
        <motion.div
          className={styles.backButtonContainer}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Link href="/services" className={styles.backButton}>
            <ArrowLeft size={16} aria-hidden="true" />
            <span>Back to Services</span>
          </Link>
        </motion.div>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div 
              className={styles.glowCircle} 
              style={colorVars}
            />
            <motion.div
              className={styles.titleContainer}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              {Icon && (
                <div 
                  className={styles.iconContainer}
                  style={colorVars}
                >
                  <Icon size={32} className={styles.headerIcon} aria-hidden="true" />
                  <div className={styles.iconBackground} />
                </div>
              )}
              <h1 className={styles.title} id="service-title">
                {title}
              </h1>
              <div 
                className={styles.underline}
                style={colorVars}
              />
            </motion.div>
            
            <motion.div
              className={styles.descriptionContainer}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <p className={styles.description}>
                {description}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Main content */}
        <div className={styles.contentGrid}>
          {/* Features */}
          {features.length > 0 && (
            <motion.div
              className={styles.featuresContainer}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2 className={styles.sectionTitle}>Key Features</h2>
              <ul className={styles.featuresList} aria-label="Service features">
                {features.map((feature, index) => (
                  <motion.li
                    key={index}
                    className={styles.featureItem}
                    custom={index}
                    initial="hidden"
                    animate={controls}
                    variants={fadeIn}
                  >
                    <CheckCircle 
                      size={20} 
                      className={styles.featureIcon} 
                      style={{ color }} 
                      aria-hidden="true"
                    />
                    <span>{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Benefits */}
          {benefits.length > 0 && (
            <motion.div
              className={styles.benefitsContainer}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className={styles.sectionTitle}>Benefits</h2>
              <div 
                className={styles.benefitsList}
                aria-label="Service benefits"
              >
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    className={styles.benefitCard}
                    custom={index}
                    initial="hidden"
                    animate={controls}
                    variants={fadeIn}
                    style={colorVars}
                  >
                    <h3 className={styles.benefitTitle}>{benefit.title}</h3>
                    <p className={styles.benefitDescription}>{benefit.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Case Studies */}
          {caseStudies.length > 0 && (
            <motion.div
              className={styles.caseStudiesContainer}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <h2 className={styles.sectionTitle}>Case Studies</h2>
              <div 
                className={styles.caseStudiesList}
                aria-label="Service case studies"
              >
                {caseStudies.map((caseStudy, index) => (
                  <motion.div
                    key={index}
                    className={styles.caseStudyCard}
                    custom={index}
                    initial="hidden"
                    animate={controls}
                    variants={fadeIn}
                    style={colorVars}
                  >
                    <h3 className={styles.caseStudyTitle}>{caseStudy.title}</h3>
                    <p className={styles.caseStudyDescription}>{caseStudy.description}</p>
                    {caseStudy.link && (
                      <Link 
                        href={caseStudy.link} 
                        className={styles.caseStudyLink}
                        aria-label={`Read more about ${caseStudy.title}`}
                      >
                        <span>Read More</span>
                        <ExternalLink size={14} aria-hidden="true" />
                      </Link>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* CTA Section */}
        <motion.div
          className={styles.ctaContainer}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          style={colorVars}
        >
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Ready to secure your business?</h2>
            <p className={styles.ctaDescription}>
              Contact our experts today to discuss how our {title} services can help protect your organization.
            </p>
            <Link 
              href="/contact" 
              className={styles.ctaButton}
              style={colorVars}
            >
              {contactCTA}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServiceDetail;