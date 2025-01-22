
"use client";
import { motion } from "framer-motion";
import Image from 'next/image';
import { Button } from "@/components/common/Button/Button";
import { TypewriterEffect } from "@/components/ui/AcUI/TypeWritterEffect/typewriter-effect";
// import { BackgroundBeams } from "@/components/ui/AcUI/BackgroundBeams/background-beams";
// import { SparklesCore } from "@/components/ui/AcUI/Sparkles/sparkles";
import styles from "./HeroSection.module.scss";
// import { SparklesCore } from "@/components/common/sparkles/sparkles";

const words = [
  {
    text: "Transform",
    className: "text-white dark:text-blue-500",
  },
  {
    text: "Your",
    className: "text-white dark:text-blue-500",
  },
  {
    text: "Career",
    className: "text-white dark:text-blue-500",
  },
  {
    text: "with",
    className: "text-white dark:text-blue-500",
  },
  {
    text: "CyberForTech",
    className: "text-blue-400 dark:text-blue-500",
  },
];

export function HeroSection() {
  return (
    <section className={styles.heroSection}>
      {/* <BackgroundBeams /> */}
      {/* <div className="w-full absolute inset-0 h-screen">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div> */}
      
      <div className={styles.content}>
        <div className={styles.gridContainer}>
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
              Master the skills that matter. Join our comprehensive cybersecurity program 
              and transform your career with expert-led training, hands-on projects, 
              and industry-recognized certifications.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className={styles.ctaGroup}
            >
              <Button size="lg" className={styles.primaryButton}>
                Explore Programs
              </Button>
              <Button variant="outline" size="lg" className={styles.secondaryButton}>
                Free Demo Class
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className={styles.trustBadges}
            >
              <div className={styles.badge}>
                <Image
                  src="/usacaw.png"
                  alt="ISACA Certified"
                  width={80}
                  height={40}
                />
              </div>
              <div className={styles.badge}>
                <Image
                  src="/comptia1.jpg"
                  alt="CompTIA Partner"
                  width={80}
                  height={40}
                />
              </div>
              <div className={styles.badge}>
                <Image
                  src="/CISSP2.png"
                  alt="CISSP Certified"
                  width={80}
                  height={40}
                />
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={styles.imageContent}
          >
            <div className={styles.imageWrapper}>
              <Image
                src="/cyberlogo.png"
                alt="Cybersecurity Training"
                width={600}
                height={600}
                className={styles.heroImage}
              />
            </div>

            <div className={styles.statsGrid}>
              <div className={styles.stat}>
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1, type: "spring" }}
                  className={styles.number}
                >
                  10k+
                </motion.span>
                <span className={styles.label}>Active Students</span>
              </div>
              <div className={styles.stat}>
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.2, type: "spring" }}
                  className={styles.number}
                >
                  95%
                </motion.span>
                <span className={styles.label}>Success Rate</span>
              </div>
              <div className={styles.stat}>
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.4, type: "spring" }}
                  className={styles.number}
                >
                  50+
                </motion.span>
                <span className={styles.label}>Expert Trainers</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}