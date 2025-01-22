// src/components/LandingPage/HeroSection/HeroSection.tsx
'use client'

import Link from 'next/link'
import { motion } from "framer-motion"
import { TypewriterEffect } from "@/components/ui/AcUI/TypeWritterEffect/typewriter-effect"
import { Button } from "@heroui/react"
import { BackgroundBeams } from "@/components/ui/AcUI/BackgroundBeams/background-beams"
import styles from './HeroSection.module.scss'

const words = [
  { text: "Master" },
  { text: "Cybersecurity" },
  { text: "with" },
  { 
    text: "CyberForTech.", 
    className: "text-blue-500 dark:text-blue-500" 
  }
]

const HeroSection = () => {
  return (
    <div className={styles.heroContainer}>
      {/* Background Beams for visual interest */}
      <BackgroundBeams />
      
      <div className={styles.heroContent}>
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={styles.heroTextWrapper}
        >
          {/* Typewriter Effect for Dynamic Title */}
          <TypewriterEffect words={words} />
          
          {/* Hero Description */}
          <p className={styles.heroDescription}>
            Unlock your potential in cybersecurity with expert-led courses, 
            hands-on labs, and real-world projects. Join thousands of successful 
            graduates in the tech industry.
          </p>
          
          {/* Call to Action Buttons */}
          <div className={styles.heroCTAButtons}>
            <Link href="/courses">
              <Button 
                variant="shadow" 
                size="lg" 
                className={styles.primaryCTA}
              >
                Explore Courses
              </Button>
            </Link>
            
            <Link href="/about">
              <Button 
                variant="shadow" 
                size="lg" 
                className={styles.secondaryCTA}
              >
                Learn More
              </Button>
            </Link>
          </div>
        </motion.div>
        
        {/* Hero Statistics */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className={styles.heroStatistics}
        >
          <div className={styles.statItem}>
            <h3>10k+</h3>
            <p>Students</p>
          </div>
          
          <div className={styles.statItem}>
            <h3>50+</h3>
            <p>Courses</p>
          </div>
          
          <div className={styles.statItem}>
            <h3>95%</h3>
            <p>Success Rate</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default HeroSection