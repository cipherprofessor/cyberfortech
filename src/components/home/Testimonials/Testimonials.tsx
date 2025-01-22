// src/components/home/Testimonials/Testimonials.tsx
import { useState } from 'react';
import Image from 'next/image';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Testimonials.module.scss';

type Testimonial = {
  id: number;
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
  courseName: string;
};

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Security Engineer',
    company: 'TechCorp Inc.',
    avatar: '/testimonials/sarah.jpg',
    content: 'The advanced penetration testing course was exactly what I needed to level up my career. The hands-on labs and real-world scenarios were incredibly valuable.',
    rating: 5,
    courseName: 'Advanced Penetration Testing',
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Security Analyst',
    company: 'SecureNet',
    avatar: '/testimonials/michael.jpg',
    content: 'I started as a complete beginner, and now I am working as a security analyst. The curriculum is well-structured and the support from instructors is outstanding.',
    rating: 5,
    courseName: 'Web Application Security',
  },
  {
    id: 3,
    name: 'Emily Brown',
    role: 'Network Administrator',
    company: 'DataDefense LLC',
    avatar: '/testimonials/emily.jpg',
    content: 'The malware analysis course gave me deep insights into threat detection. The virtual lab environment made learning complex concepts much easier.',
    rating: 5,
    courseName: 'Malware Analysis Fundamentals',
  },
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) nextIndex = testimonials.length - 1;
      if (nextIndex >= testimonials.length) nextIndex = 0;
      return nextIndex;
    });
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className={styles.testimonials}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>What Our Students Say</h2>
          <p>Success stories from our cybersecurity professionals</p>
        </div>

        <div className={styles.testimonialSlider}>
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);
                if (swipe < -swipeConfidenceThreshold) {
                  paginate(1);
                } else if (swipe > swipeConfidenceThreshold) {
                  paginate(-1);
                }
              }}
              className={styles.testimonialCard}
            >
              <div className={styles.quoteIcon}>
                <Quote className={styles.icon} />
              </div>
              
              <p className={styles.content}>{currentTestimonial.content}</p>

              <div className={styles.courseInfo}>
                <span className={styles.label}>Course Taken:</span>
                <span className={styles.courseName}>{currentTestimonial.courseName}</span>
              </div>

              <div className={styles.rating}>
                {Array.from({ length: currentTestimonial.rating }).map((_, i) => (
                  <Star key={i} className={styles.starIcon} fill="currentColor" />
                ))}
              </div>

              <div className={styles.author}>
                <Image
                  src={currentTestimonial.avatar}
                  alt={currentTestimonial.name}
                  width={64}
                  height={64}
                  className={styles.avatar}
                />
                <div className={styles.info}>
                  <h3>{currentTestimonial.name}</h3>
                  <p>{currentTestimonial.role}</p>
                  <span>{currentTestimonial.company}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <button 
            className={`${styles.navButton} ${styles.prev}`}
            onClick={() => paginate(-1)}
          >
            <ChevronLeft />
          </button>
          <button 
            className={`${styles.navButton} ${styles.next}`}
            onClick={() => paginate(1)}
          >
            <ChevronRight />
          </button>

          <div className={styles.dots}>
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`${styles.dot} ${index === currentIndex ? styles.active : ''}`}
                onClick={() => {
                  const direction = index > currentIndex ? 1 : -1;
                  setDirection(direction);
                  setCurrentIndex(index);
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}