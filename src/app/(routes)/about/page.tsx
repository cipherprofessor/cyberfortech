"use client"
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Award, 
  Users, 
  Shield, 
  Zap, 
  Code, 
  Globe, 
  Clock,
  UserCheck
} from 'lucide-react';


import { KeyMetrics } from '@/components/home/KeyMetrics/KeyMetrics';



import styles from './about.module.scss';
import { FeatureCards } from '@/components/aboutus/FeatureCards/FeatureCards';
import { CyberFortTimeline } from '@/components/ui/AcUI/TimeLine/TimeLineDemo';
import { TeamGrid } from '@/components/aboutus/TeamCard/TeamGrid';

export default function AboutPage() {

const teamMembers = [
  {
    name: "Ayan Ali Dar",
    cardColor: "purple" as 'purple',
    role: "Founder & CEO",
    image: "/team/ayan.png",
    bio: "7+ years of experience in Marketing and Business Development",
    // experience: "Marketing Expert",
    achievements: [
      "100+ marketing campaigns",
      "Grew business revenue by 200%",
      "Partnerships with 50+ companies"
    ],
    location: "Cyber City, CC",
    projects: 150,
    certifications: [
      "Digital Marketing Expert",
      "Business Strategy Specialist"
    ],
    contactInfo: {
      email: "ayan@CyberFort.com",
      skype: "ayan.skype"
    },
    socialLinks: {
      linkedin: "https://www.linkedin.com/in/CyberFort/",
      twitter: "https://twitter.com/johndoe",
      github: "https://github.com/CyberFort",
      website: "https://CyberFort.com",
      medium: "https://medium.com/@CyberFort"
    }
  },
  {
    name: "Mohsin Manzoor Bhat",
    cardColor: "blue" as 'blue',
    role: "AWS & Full Stack Developer",
    image: "/team/mohsin.jpg",
    bio: "5+ Years of Experience in Cloud And Full Stack Development",
    // experience: "Web Dev Expert",
    achievements: [
       "Trained 1000+ Students",
      "Developed 50+ Full Stack Apps",
      "AWS Certified Solutions Architect"
    ],
    location: "Chennai, India",
    projects: 100,
    certifications: [
      "Digital Marketing Expert",
      "Business Strategy Specialist"
    ],
    contactInfo: {
      email: "ayan@CyberFort.com",
      skype: "ayan.skype"
    },
    socialLinks: {
      linkedin: "https://www.linkedin.com/in/CyberFort/",
      twitter: "https://twitter.com/johndoe",
      github: "https://github.com/CyberFort",
      website: "https://CyberFort.com",
      medium: "https://medium.com/@CyberFort"
    }
  },
  {
    name: "Arsalan Rayees",
    cardColor: "orange" as 'orange',
    role: "AI & Machine Learning Engineer",
    image: "/team/arsalan.jpg",
    bio: "2+ years of experience in AI and Machine Learning",
    // experience: "AI Expert",
    achievements: [
      "20+ AI Projects",
      "Developed 15+ AI Models",
      "Published 10+ Research Papers"
    ],
    location: "Tangmarg",
    projects: 25,
    certifications: [
      "AWS Solutions Architect",
      "Full Stack Developer"
    ],
    contactInfo: {
      email: "mohsin@CyberFort.com",
      skype: "mohsin.skype"
    },
    socialLinks: {
      linkedin: "https://www.linkedin.com/in/CyberFort/",
      twitter: "https://twitter.com/johndoe",
      github: "https://github.com/CyberFort",
      website: "https://CyberFort.com",
      medium: "https://medium.com/@CyberFort"
    }
  },
  {
    name: "Areeba Bhat",
    cardColor: "green" as 'green',
    role: "Cybersecurity Engineer",
    image: "/testm/testm1.avif",
    bio: "3+ years of experience in Cybersecurity and Ethical Hacking",
    // experience: "Cybersecurity Expert",
    achievements: [
      "30+ Cybersecurity Projects",
      "Performed 50+ Penetration Tests",
      "Led 10+ Security Audits"
    ],
    location: "Kashmir, India",
    projects: 35,
    certifications: [
      "AWS Solutions Architect",
      "Full Stack Developer"
    ],
    contactInfo: {
      email: "mohsin@CyberFort.com",
      skype: "mohsin.skype"
    },
    socialLinks: {
      linkedin: "https://www.linkedin.com/in/CyberFort/",
      twitter: "https://twitter.com/johndoe",
      github: "https://github.com/CyberFort",
      website: "https://CyberFort.com",
      medium: "https://medium.com/@CyberFort"
    }
  }
];

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5 }
  }
};

  return (
    <div className={styles.aboutContainer}>
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
            Cyberfort Technologies excels in delivering cutting-edge cybersecurity solutions to safeguard businesses, individuals, and government agencies against advanced threats. Services include threat detection, incident response, penetration testing, vulnerability assessments, compliance management, and security consulting, ensuring robust data protection and operational resilience.
            </p>
            <motion.div 
              className={styles.valueCards}
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div 
                className={styles.valueCard}
                variants={fadeIn}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className={styles.valueCardIcon}>
                  <BookOpen size={28} />
                </div>
                <h3>Quality Education</h3>
                <p>Expert-led courses with real-world applications</p>
              </motion.div>
              <motion.div 
                className={styles.valueCard}
                variants={fadeIn}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className={styles.valueCardIcon}>
                  <Zap size={28} />
                </div>
                <h3>Practical Experience</h3>
                <p>Hands-on labs and real-world scenarios</p>
              </motion.div>
              <motion.div 
                className={styles.valueCard}
                variants={fadeIn}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className={styles.valueCardIcon}>
                  <Users size={28} />
                </div>
                <h3>Community Support</h3>
                <p>Active learning community and mentorship</p>
              </motion.div>
              <motion.div 
                className={styles.valueCard}
                variants={fadeIn}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className={styles.valueCardIcon}>
                  <Shield size={28} />
                </div>
                <h3>Industry-Relevant</h3>
                <p>Curriculum aligned with current security practices</p>
              </motion.div>
            </motion.div>
          </motion.div>
          <motion.div 
            className={styles.missionImage}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200 }}
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={styles.statsSectionHeader}
        >
          <h2>Our Impact</h2>
          <p>The numbers that define our journey</p>
        </motion.div>
        <KeyMetrics />
      </section>

      {/* Why Choose Us Section - More Compact */}
      <section className={styles.whyChooseUs}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={styles.sectionHeader}
        >
          <h2>Why Choose Us</h2>
          <p>Discover what makes our approach to cybersecurity education unique</p>
        </motion.div>
        
        <FeatureCards />
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
          <p>From inception to becoming a leading cybersecurity education platform</p>
        </motion.div>
        <CyberFortTimeline />
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
          <p>The experts behind CyberFort's success</p>
        </motion.div>

        <TeamGrid 
          members={teamMembers}
          centered={false} // Set to true if you want centered layout
        />
      </section>
    </div>
  );
}