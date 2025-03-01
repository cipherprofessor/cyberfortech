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
    className: "text-zinc-900 dark:text-white",
  },
  {
    text: "Your",
    className: "text-zinc-900 dark:text-white",
  },
  {
    text: "Career",
    className: "text-zinc-900 dark:text-white",
  },
  {
    text: "with",
    className: "text-zinc-900 dark:text-white",
  },
  {
    text: "CyberFort",
    className: "text-blue-600 mt-6 dark:text-blue-400 font-bold",
  },
];

const stats = [
  { icon: "🧑‍💻", number: "175+", label: "Active Students", increment: 50 },
  { icon: "🏆", number: "95%", label: "Success Rate", increment: 1 },
  { icon: "👩‍🏫", number: "50+", label: "Expert Trainers", increment: 1 }
];

const features = [
  { icon: "🎯", title: "Targeted Learning", description: "Customized pathways for your goals" },
  { icon: "🌟", title: "Industry Experts", description: "Learn from the best in cybersecurity" },
  { icon: "🛡️", title: "Real-world Projects", description: "Hands-on practical experience" },
];

export function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const [animatedStats, setAnimatedStats] = useState(stats.map(() => 0));
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    // Animate stats
    stats.forEach((stat, index) => {
      const target = parseInt(stat.number) || 0;
      let current = 0;
      const increment = stat.increment;
      const interval = setInterval(() => {
        if (current < target) {
          current += increment;
          setAnimatedStats(prev => {
            const newStats = [...prev];
            newStats[index] = Math.min(current, target);
            return newStats;
          });
        } else {
          clearInterval(interval);
        }
      }, 50);
    });
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
                Contact Us
              </Button>
            </motion.div>

            {/* Features moved inside the text content div for mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className={styles.featureGrid}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className={styles.featureCard}
                >
                  <div className={styles.featureIconWrapper}>
                    <span className={styles.featureIcon}>{feature.icon}</span>
                    <h3 className={styles.featureTitle}>{feature.title}</h3>
                  </div>
                  <p className={styles.featureDescription}>{feature.description}</p>
                </motion.div>
              ))}
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
                src="/logo/cyber4.png"
                alt="Cybersecurity Training"
                width={600}
                height={600}
                className={styles.heroImage}
                priority
              />
            </div>

            {/* Stats Grid */}
            <div className={styles.statsGrid}>
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1 + index * 0.2, type: "spring" }}
                  className={styles.stat}
                >
                  <span className={styles.statIcon}>{stat.icon}</span>
                  <span className={styles.number}>
                    {typeof animatedStats[index] === 'number' 
                      ? Math.round(animatedStats[index]) + (stat.number.includes('%') ? '%' : '') 
                      : '0'}
                  </span>
                  <span className={styles.label}>{stat.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
        
        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className={styles.trustBadges}
        >
          {[
            "aws", "ceh", "cisco-ar21", "gcp", 
            "hashicorp", "nextjs-ar21", "nginx-ar21", "reactjs-ar21"
          ].map((logo, index) => (
            <motion.div
              key={logo}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 + index * 0.1 }}
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