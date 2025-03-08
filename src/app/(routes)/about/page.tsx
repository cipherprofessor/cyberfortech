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
    name: "Animesh Parhi",
    cardColor: "purple" as 'purple',
    role: "Head of Cybersecurity",
    image: "/team/Animesh_Parhi.jpeg",
    bio: "Head Cybersecurity Consultant & Cybersecurity Testing Specialist With Experience Of Above 7+ Years",
    // experience: "Marketing Expert",
    achievements: [
      "100+ marketing campaigns",
      "Grew business revenue by 200%",
      "Partnerships with 50+ companies"
    ],
    // location: "Cyber City, CC",
    // projects: 150,
    // certifications: [
    //   "Digital Marketing Expert",
    //   "Business Strategy Specialist"
    // ],
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
    name: "Chirag Shah",
    cardColor: "orange" as 'orange',
    role: "Operations Manager",
    image: "/team/Chirag_Shah.jpeg",
    bio: "Operations Manager & IT Security Manager With 20+ Years Of Experience In The IT Industry",
    // experience: "AI Expert",
    achievements: [
      "20+ AI Projects",
      "Developed 15+ AI Models",
      "Published 10+ Research Papers"
    ],
    // location: "Tangmarg",
    // projects: 25,
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
    name: "Mohsin Manzoor Bhat",
    cardColor: "blue" as 'blue',
    role: "Technical Lead",
    image: "/team/mohsin.jpg",
    bio: "Technical lead,Cloud solutions Architect, Full Stack Developer 4 years + experience",
    // experience: "Web Dev Expert",
    achievements: [
       "Trained 1000+ Students",
      "Developed 50+ Full Stack Apps",
      "AWS Certified Solutions Architect"
    ],
    // location: "Chennai, India",
    // projects: 100,
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
    name: "Anuj Singh",
    cardColor: "green" as 'green',
    role: "Sales and Marketing Manager",
    image: "/team/Anuj_Singh.jpeg",
    bio: "Sales and Marketing Manager With Experience Of Above 5+ Years In The IT Industry",
    // experience: "Cybersecurity Expert",
    achievements: [
      "30+ Cybersecurity Projects",
      "Performed 50+ Penetration Tests",
      "Led 10+ Security Audits"
    ],
    // location: "Kashmir, India",
    // projects: 35,
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
            {/* Cyberfort Technologies excels in delivering cutting-edge cybersecurity solutions to safeguard businesses, individuals, and government agencies against advanced threats. Services include threat detection, incident response, penetration testing, vulnerability assessments, compliance management, and security consulting, ensuring robust data protection and operational resilience. */}
            CyberFort Tech's mission is to provide robust cybersecurity solutions that protect businesses, individuals, and government agencies from evolving cyber threats. Our focus on delivering tailored services like threat detection, incident response, penetration testing, and compliance management. Additionally, they aim to empower organizations and individuals through training programs in areas such as ethical hacking, security awareness, and certifications in various domains of cyber security
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