"use client";
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import styles from './AnimatedTestimonials.module.scss';

const AnimatedTestimonials = dynamic(
  () => import('./animated-testimonials').then(mod => mod.AnimatedTestimonials),
  { ssr: false }
);




export function AceternityUIAnimatedTestimonialsUse() {
  const testimonials = [
    {
      quote:
        "I particularly appreciated the depth of knowledge shared in the advanced penetration testing course. The instructors are clearly experts in their field and provide valuable insights beyond just the theoretical concepts.",
      name: "Sarah Chen",
      designation: "Network Security Engineer",
      src: "/testm/testimonial1.jpg",
    },
    {
      quote:
        "After completing multiple certifications through CyberFort, I was able to secure a senior position in cybersecurity. The curriculum is comprehensive and up-to-date with current industry trends.",
      name: "Michael Rodriguez",
      designation: "Information Security Manager",
      src: "/testm/testm1.avif",
    },
    {
      quote:
        "The cloud security certification program exceeded my expectations. It provided deep insights into securing cloud infrastructure and helped me transition into cloud security architecture.",
      name: "Emily Watson",
      designation: "Cloud Security Architect",
      src: "/testm/testm2.avif",
    },
    {
      quote:
        "Outstanding support and robust features. It's rare to find a product that delivers on all its promises.",
      name: "James Kim",
      designation: "Engineering Lead at DataPro",
      src: "/testm/testm3.webp",
    },
    {
      quote:
        "The scalability and performance have been game-changing for our organization. Highly recommend to any growing business.",
      name: "Lisa Thompson",
      designation: "VP of Technology at FutureNet",
      src: "/testm/testm4.jpg",
    },
  ];
  

  return (
    <div className={styles.testimonialSection}>
      <div className={styles.headerWrapper}>
        <motion.div 
          className={styles.titleContent}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2
              }
            }
          }}
        >
          <div className={styles.glowBg} />
          
          <motion.h2
            className={styles.title}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { 
                opacity: 1, 
                y: 0,
                transition: {
                  type: "spring",
                  stiffness: 100
                }
              }
            }}
          >
            Real Stories, Real Success
            <div className={styles.underline} />
          </motion.h2>

          <motion.p
            className={styles.subtitle}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { 
                opacity: 1, 
                y: 0,
                transition: {
                  type: "spring",
                  stiffness: 100
                }
              }
            }}
          >
            Transforming careers through expert-led cybersecurity education
          </motion.p>

          <div className={styles.decorativeElements}>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className={styles.dot}
                initial={{ scale: 0 }}
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3] 
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.4
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>

      <AnimatedTestimonials testimonials={testimonials} />
    </div>
  );
}
 