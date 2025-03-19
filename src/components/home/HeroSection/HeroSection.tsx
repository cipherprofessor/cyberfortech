"use client";
import { motion } from "framer-motion";
import Image from 'next/image';
import { Button } from "@/components/common/Button/Button";
import { TypewriterEffect } from "@/components/ui/AcUI/TypeWritterEffect/typewriter-effect";
import { useState, useEffect } from 'react';
import styles from "./HeroSection.module.scss";
import { BackgroundBeams } from "@/components/ui/AcUI/BackgroundBeams/background-beams";
import { useRouter } from "next/navigation";

const words = [
  {
    text: "Transform",
    className: "text-zinc-100 dark:text-white",
  },
  {
    text: "Your",
    className: "text-zinc-200 dark:text-white",
  },
  {
    text: "Career",
    className: "text-zinc-300 dark:text-white",
  },
  {
    text: "with",
    className: "text-zinc-400 dark:text-white",
  },
  {
    text: "CyberFort Tech",
    className: "text-blue-600 mt-6 dark:text-blue-400 font-bold",
  },
];

const features = [
  { icon: "🎯", title: "Targeted Learning", description: "Customized pathways for your goals" },
  { icon: "🌟", title: "Industry Experts", description: "Learn from the best in cybersecurity" },
  { icon: "🛡️", title: "Real-world Projects", description: "Hands-on practical experience" },
];

export function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleExploreCoursesButton = () => {
    router.push('/courses');
  }

  const handleContactUsCoursesButton = () => {
    router.push('/contact');
  }

  if (!mounted) return null;

  return (
    <section className={styles.heroSection}>
      <BackgroundBeams className={styles.backgroundBeams} />
      <div className={styles.content}>
        <div className={styles.gridContainer}>
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={styles.textContent}
          >
            <div className={styles.headingWrapper}>
              <TypewriterEffect words={words} />
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className={styles.description}
            >
              Master the skills that matter in the ever-evolving world of cybersecurity. 
              Join our comprehensive program for expert-led training, hands-on projects, 
              and industry-recognized certifications.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className={styles.ctaGroup}
            >
              <Button size="lg" className={styles.primaryButton} onClick={handleExploreCoursesButton}>
                Explore our Courses
              </Button>
              <Button variant="outline" size="lg" className={styles.secondaryButton} onClick={handleContactUsCoursesButton}>
                Request For Demo
              </Button>
            </motion.div>
          </motion.div>

          {/* Image Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={styles.imageContent}
          >
            <div className={styles.imageWrapper}>
              <Image
                src="/logo/logoown.png"
                alt="Cybersecurity Training"
                width={600}
                height={600}
                className={styles.heroImage}
                priority
              />
            </div>
          </motion.div>
        </div>
        
        {/* Feature Cards - Now moved below the main hero content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className={styles.featureSection}
        >
          <div className={styles.featureGrid}>
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                className={styles.featureCard}
              >
                <div className={styles.featureIconWrapper}>
                  <span className={styles.featureIcon}>{feature.icon}</span>
                  <h3 className={styles.featureTitle}>{feature.title}</h3>
                </div>
                <p className={styles.featureDescription}>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className={styles.trustBadges}
        >
          {[
            "aws", "ceh", "cisco-ar21", "gcp", 
            "hashicorp", "nextjs-ar21", "nginx-ar21", "reactjs-ar21",
            "compTIAtransparent", "cyberark", "Ec_Council_Logo", "infosec", "okta copy", "sailpoint"
          ].map((logo, index) => (
            <motion.div
              key={logo}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 + index * 0.05 }}
              className={styles.badge}
            >
              <Image
                src={`/logocompanies/${logo}.svg`}
                alt={`${logo} certification`}
                width={80}
                height={40}
                style={{ objectFit: 'contain' }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}