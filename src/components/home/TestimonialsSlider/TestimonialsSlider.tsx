// src/components/home/TestimonialsSlider/TestimonialsSlider.tsx
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import styles from './TestimonialsSlider.module.scss';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Security Analyst at TechCorp',
    avatar: '/testm/testimonial1.jpg',
    content: 'The cybersecurity courses provided by CyberFort were instrumental in advancing my career. The hands-on labs and real-world scenarios helped me develop practical skills that I use daily.',
    rating: 5,
    company: {
      name: 'TechCorp',
      logo: '/testm/testimonial1.jpg'
    }
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Network Security Engineer',
    avatar: '/testm/testm1.avif',
    content: 'I particularly appreciated the depth of knowledge shared in the advanced penetration testing course. The instructors are clearly experts in their field and provide valuable insights beyond just the theoretical concepts.',
    rating: 5,
    company: {
      name: 'SecureNet',
      logo: '/testm/testm1.avif'
    }
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Information Security Manager',
    avatar: '/testm/testm2.avif',
    content: 'After completing multiple certifications through CyberFort, I was able to secure a senior position in cybersecurity. The curriculum is comprehensive and up-to-date with current industry trends.',
    rating: 5,
    company: {
      name: 'CyberGuard',
      logo: '/testm/testm2.avif'
    }
  },
  {
    id: 4,
    name: 'David Wilson',
    role: 'Cloud Security Architect',
    avatar: '/testm/testm3.webp',
    content: 'The cloud security certification program exceeded my expectations. It provided deep insights into securing cloud infrastructure and helped me transition into cloud security architecture.',
    rating: 5,
    company: {
      name: 'CloudSafe',
      logo: '/testm/testm3.webp'
    }
  }
];

export function TestimonialsSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (autoplay) {
      timer = setInterval(() => {
        setDirection(1);
        setCurrentIndex((prevIndex) => 
          prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);
    }
    return () => clearInterval(timer);
  }, [autoplay]);

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

  const navigate = (newDirection: number) => {
    setAutoplay(false);
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      if (newDirection === 1) {
        return prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1;
      }
      return prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1;
    });
  };

  const handleDotClick = (index: number) => {
    setAutoplay(false);
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  return (
    <section className={styles.testimonialSection}>
      <div className={styles.container}>
        <motion.div 
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2>What Our Students Say</h2>
          <p>Hear from our successful graduates about their learning experience</p>
        </motion.div>

        <div className={styles.sliderContainer}>
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              className={styles.testimonialCard}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
            >
              <Quote className={styles.quoteIcon} />
              <div className={styles.content}>
                <p>{testimonials[currentIndex].content}</p>
              </div>

              <div className={styles.rating}>
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <Star key={i} className={styles.star} />
                ))}
              </div>

              <div className={styles.author}>
                <div className={styles.avatarWrapper}>
                  <Image
                    src={testimonials[currentIndex].avatar}
                    alt={testimonials[currentIndex].name}
                    width={64}
                    height={64}
                    className={styles.avatar}
                  />
                </div>
                <div className={styles.authorInfo}>
                  <h3>{testimonials[currentIndex].name}</h3>
                  <p>{testimonials[currentIndex].role}</p>
                </div>
                <div className={styles.companyLogo}>
                  <Image
                    src={testimonials[currentIndex].company.logo}
                    alt={testimonials[currentIndex].company.name}
                    width={100}
                    height={40}
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <button 
            className={`${styles.navButton} ${styles.prev}`}
            onClick={() => navigate(-1)}
            aria-label="Previous testimonial"
          >
            <ChevronLeft />
          </button>
          <button 
            className={`${styles.navButton} ${styles.next}`}
            onClick={() => navigate(1)}
            aria-label="Next testimonial"
          >
            <ChevronRight />
          </button>
        </div>

        <div className={styles.dots}>
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${index === currentIndex ? styles.active : ''}`}
              onClick={() => handleDotClick(index)}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}