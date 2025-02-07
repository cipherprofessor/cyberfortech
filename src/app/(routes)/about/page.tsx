"use client"
import Image from 'next/image';
import { motion } from 'framer-motion';
import styles from './about.module.scss';

import { AcUITimeline } from '@/components/ui/AcUI/TimeLine/TimeLineDemo';
import { AcUiBentoGrid } from '@/components/ui/AcUI/BentoGrid/BentoGrid';
import { KeyMetrics } from '@/components/home/KeyMetrics/KeyMetrics';
import { TeamCard } from '@/components/ui/Mine/TeamCard/TeamCard';
import { TeamGrid } from '@/components/ui/Mine/TeamCard/TeamGrid';

export default function AboutPage() {

  // For a single member
const singleMember = {
  name: "Ayan Ali Dar",
  role: "Founder & CEO",
  image: "/team/ayan.png",
  bio: "7+ years of experience in Marketing and Business Development",
  specialization: ["Marketing Strategy", "Business Development"],
  experience: "7+ Years Experience",
  achievements: ["Led 100+ successful marketing campaigns"],
  location: "Cyber City, CC",
  socialLinks: {
    linkedin: "https://www.linkedin.com/in/cyberfortech/",
    twitter: "https://twitter.com/johndoe",
  }
};

// For multiple members
const teamMembers = [
  {
    name: "Ayan Ali Dar",
    cardColor: "purple" as 'purple',
    role: "Founder & CEO",
    image: "/team/ayan.png",
    bio: "7+ years of experience in Marketing and Business Development",
    // specialization: [
    //   "Marketing Strategy",
      // "Business Development",
      // "Leadership",
      // "Digital Marketing"
    // ],
    experience: "Marketing Expert",
    achievements: [
      "100+ marketing campaigns",
      "Grew business revenue by 200%",
      "Partnerships with 50+ companies"
    ],
    location: "Cyber City, CC",
    projects: 150,
    // availability: "Available for consulting",
    certifications: [
      "Digital Marketing Expert",
      "Business Strategy Specialist"
    ],
    contactInfo: {
      email: "ayan@cyberfortech.com",
      skype: "ayan.skype"
    },
    socialLinks: {
      linkedin: "https://www.linkedin.com/in/cyberfortech/",
      twitter: "https://twitter.com/johndoe",
      github: "https://github.com/cyberfortech",
      website: "https://cyberfortech.com",
      medium: "https://medium.com/@cyberfortech"
    }
  },
  {
    name: "Mohsin Manzoor Bhat",
    cardColor: "blue" as 'blue',
    role: "AWS & Full Stack Developer",
    image: "/team/mohsin.jpg",
    bio: "5+ Years of Experience in Cloud And Full Stack Development",
    // specialization: [
    //   "Marketing Strategy",
      // "Business Development",
      // "Leadership",
      // "Digital Marketing"
    // ],
    experience: "Web Dev Expert",
    achievements: [
       "Trained 1000+ Students",
      "Developed 50+ Full Stack Apps",
      "AWS Certified Solutions Architect"
    ],
    location: "Chennai, India",
    projects: 100,
    // availability: "Available for consulting",
    certifications: [
      "Digital Marketing Expert",
      "Business Strategy Specialist"
    ],
    contactInfo: {
      email: "ayan@cyberfortech.com",
      skype: "ayan.skype"
    },
    socialLinks: {
      linkedin: "https://www.linkedin.com/in/cyberfortech/",
      twitter: "https://twitter.com/johndoe",
      github: "https://github.com/cyberfortech",
      website: "https://cyberfortech.com",
      medium: "https://medium.com/@cyberfortech"
    }
  },
  {
    name: "Arsalan Rayees",
    cardColor: "orange" as 'orange',
    role: "AI & Machine Learning Engineer",
    image: "/team/arsalan.jpg",
    bio: "2+ years of experience in AI and Machine Learning",
    // specialization: [
    //   "AWS Cloud",
    //   "Full Stack",
    //   "DevOps",
    //   "System Architecture"
    // ],
    experience: "AI Expert",
    achievements: [
      "20+ AI Projects",
      "Developed 15+ AI Models",
      "Published 10+ Research Papers"
    ],
    location: "Tangmarg",
    projects: 25,
    // availability: "Available for Projects",
    certifications: [
      "AWS Solutions Architect",
      "Full Stack Developer"
    ],
    contactInfo: {
      email: "mohsin@cyberfortech.com",
      skype: "mohsin.skype"
    },
    socialLinks: {
      linkedin: "https://www.linkedin.com/in/cyberfortech/",
      twitter: "https://twitter.com/johndoe",
      github: "https://github.com/cyberfortech",
      website: "https://cyberfortech.com",
      medium: "https://medium.com/@cyberfortech"
    }
  },
  {
    name: "Areeba Bhat",
    cardColor: "green" as 'green',
    role: "Cybersecurity Engineer",
    image: "/testm/testm1.avif",
    bio: "3+ years of experience in Cybersecurity and Ethical Hacking",
    // specialization: [
    //   "AWS Cloud",
    //   "Full Stack",
    //   "DevOps",
    //   "System Architecture"
    // ],
    experience: "Cybersecurity Expert",
    achievements: [
      "30+ Cybersecurity Projects",
      "Performed 50+ Penetration Tests",
      "Led 10+ Security Audits"
    ],
    location: "Kashmir, India",
    projects: 35,
    // availability: "Available for Projects",
    certifications: [
      "AWS Solutions Architect",
      "Full Stack Developer"
    ],
    contactInfo: {
      email: "mohsin@cyberfortech.com",
      skype: "mohsin.skype"
    },
    socialLinks: {
      linkedin: "https://www.linkedin.com/in/cyberfortech/",
      twitter: "https://twitter.com/johndoe",
      github: "https://github.com/cyberfortech",
      website: "https://cyberfortech.com",
      medium: "https://medium.com/@cyberfortech"
    }
  }

];



  return (
    <div className={styles.aboutContainer}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <motion.div 
          className={styles.heroContent}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>Empowering the Future of Cybersecurity</h1>
          <p>Building a safer digital world through education, innovation, and community.</p>
        </motion.div>
        <div className={styles.heroBackground}>
          <div className={styles.overlay}></div>
          <Image
            src="/cyber1.png" // Add a relevant background image
            alt="Cybersecurity Background"
            fill
            className={styles.bgImage}
            priority
          />
        </div>
      </section>

      {/* Mission Section with Grid */}
      <section className={styles.mission}>
        <div className={styles.missionHeader}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Our Mission
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className={styles.missionSubtext}
          >
            Bridging the cybersecurity skills gap with practical, industry-ready education
          </motion.p>
        </div>

        <div className={styles.missionGrid}>
          <motion.div 
            className={styles.missionContent}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className={styles.missionText}>
              At CyberForTech, we believe that cybersecurity education should be
              accessible, practical, and up-to-date with the latest industry trends.
              Our mission is to bridge the cybersecurity skills gap by providing
              high-quality training that combines theoretical knowledge with
              hands-on experience.
            </p>
            <div className={styles.valueCards}>
              <motion.div 
                className={styles.valueCard}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h3>Quality Education</h3>
                <p>Expert-led courses with real-world applications</p>
              </motion.div>
              <motion.div 
                className={styles.valueCard}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h3>Practical Experience</h3>
                <p>Hands-on labs and real-world scenarios</p>
              </motion.div>
              <motion.div 
                className={styles.valueCard}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h3>Community Support</h3>
                <p>Active learning community and mentorship</p>
              </motion.div>
              <motion.div 
                className={styles.valueCard}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h3>Community Support</h3>
                <p>Active learning community and mentorship</p>
              </motion.div>
            </div>
          </motion.div>
          <motion.div 
            className={styles.missionImage}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Image
              src="/cyber1.png"
              alt="Our Mission"
              fill
              className={styles.image}
            />
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.statsSection}>
        <KeyMetrics />
      </section>

      {/* Bento Grid Section */}
      <section className={styles.bentoSection}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={styles.bentoHeader}
        >
          <h2>Why Choose Us</h2>
          <p>Discover what makes our approach to cybersecurity education unique</p>
        </motion.div>
        <AcUiBentoGrid />
      </section>

      {/* Journey Timeline */}
      <section className={styles.journeySection}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={styles.journeyHeader}
        >
          <h2>Our Journey</h2>
          <p>The milestones that shaped our growth</p>
        </motion.div>
        <AcUITimeline />
      </section>

      {/* Team Section */}
      <section className={styles.teamSection}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={styles.sectionHeader}
        >
          <h2>Meet Our Team</h2>
          <p>The experts behind CyberForTech's success</p>
        </motion.div>

        <TeamGrid 
          members={teamMembers}
          centered={false} // Set to true if you want centered layout
        />
      </section>
    </div>
  );
}