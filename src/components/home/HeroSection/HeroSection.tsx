import { motion } from "framer-motion";
// import { BackgroundBeams } from "../ui/background-beams";
// import { TypewriterEffect } from "../ui/typewriter-effect";
// import { Button } from "@/components/ui/button";
import styles from "./HeroSection.module.scss";

const words = [
  {
    text: "Master",
  },
  {
    text: "Cybersecurity",
  },
  {
    text: "with",
  },
  {
    text: "CyberForTech.",
    className: "text-blue-500 dark:text-blue-500",
  },
];

const HeroSection = () => {
  return (
    <div className={styles.heroSection}>
      <BackgroundBeams />
      <div className={styles.content}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={styles.textContent}
        >
          <TypewriterEffect words={words} />
          <p className={styles.description}>
            Unlock your potential in cybersecurity with expert-led courses, 
            hands-on labs, and real-world projects. Join thousands of successful 
            graduates in the tech industry.
          </p>
          <div className={styles.cta}>
            <Button size="lg" className={styles.primaryButton}>
              Explore Courses
            </Button>
            <Button variant="outline" size="lg" className={styles.secondaryButton}>
              Learn More
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={styles.statsContainer}
        >
          <div className={styles.stat}>
            <h3>10k+</h3>
            <p>Students</p>
          </div>
          <div className={styles.stat}>
            <h3>50+</h3>
            <p>Courses</p>
          </div>
          <div className={styles.stat}>
            <h3>95%</h3>
            <p>Success Rate</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;