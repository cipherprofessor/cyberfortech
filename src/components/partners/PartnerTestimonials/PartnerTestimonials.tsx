"use client"
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import Image from 'next/image';
import styles from './PartnerTestimonials.module.scss';

interface TestimonialProps {
  id: number;
  quote: string;
  name: string;
  title: string;
  company: string;
  logo: string;
  image: string;
  rating: number;
}

export function PartnerTestimonials() {
  const testimonials: TestimonialProps[] = [
    {
      id: 1,
      quote: "Partnering with CyberFort has been a game-changer for our security offerings. Their expertise and platform have allowed us to provide comprehensive solutions that truly differentiate us in the market.",
      name: "Sarah Johnson",
      title: "VP of Strategic Partnerships",
      company: "TechShield Security",
      logo: "/partners/partner-logo-1.svg",
      image: "/partners/testimonial-1.jpg",
      rating: 5
    },
    {
      id: 2,
      quote: "As an educational institution, our partnership with CyberFort has elevated our cybersecurity curriculum to industry standards. Their training materials and certification pathways have been invaluable for our students.",
      name: "Michael Chen",
      title: "Director of Technology Programs",
      company: "SecureNet Academy",
      logo: "/partners/partner-logo-2.svg",
      image: "/partners/testimonial-2.jpg",
      rating: 5
    },
    {
      id: 3,
      quote: "The level of support and collaboration we've received as a CyberFort partner has exceeded expectations. Their team works as an extension of our own, helping us deliver exceptional security solutions to our clients.",
      name: "Alex Rivera",
      title: "Chief Security Officer",
      company: "DataGuard Solutions",
      logo: "/partners/partner-logo-3.svg",
      image: "/partners/testimonial-3.jpg",
      rating: 5
    }
  ];

  const [current, setCurrent] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (autoplay) {
      timer = setTimeout(() => {
        setCurrent((prev) => (prev + 1) % testimonials.length);
      }, 5000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [current, autoplay, testimonials.length]);

  const handlePrev = () => {
    setAutoplay(false);
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setAutoplay(false);
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };

  // Animation variants
  const slideVariants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? 1000 : -1000,
        opacity: 0
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0
      };
    }
  };

  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const handleNext = () => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % testimonials.length);
    };

    const timer = setTimeout(handleNext, 5000);
    return () => clearTimeout(timer);
  }, [current, testimonials.length]);

  const handleDirectionChange = (newDirection: number) => {
    setDirection(newDirection);
    if (newDirection > 0) {
      handleNext();
    } else {
      handlePrev();
    }
  };

  const currentTestimonial = testimonials[current];

  return (
    <div className={styles.testimonialsContainer}>
      <div className={styles.testimonialsWrapper}>
        <div className={styles.quoteIconWrapper}>
          <Quote size={40} className={styles.quoteIcon} />
        </div>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div 
            key={current}
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
            <div className={styles.testimonialContent}>
              <p className={styles.quote}>{currentTestimonial.quote}</p>
              
              <div className={styles.ratingContainer}>
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={18} 
                    className={i < currentTestimonial.rating ? styles.starFilled : styles.starEmpty} 
                    fill={i < currentTestimonial.rating ? "#F59E0B" : "none"}
                  />
                ))}
              </div>
            </div>
            
            <div className={styles.testimonialFooter}>
              <div className={styles.personInfo}>
                <div className={styles.personImage}>
                  <Image 
                    src={currentTestimonial.image || "/partners/placeholder-avatar.jpg"} 
                    alt={currentTestimonial.name}
                    width={60}
                    height={60}
                    className={styles.avatar}
                  />
                </div>
                <div className={styles.personDetails}>
                  <h4 className={styles.personName}>{currentTestimonial.name}</h4>
                  <p className={styles.personTitle}>{currentTestimonial.title}</p>
                  <p className={styles.companyName}>{currentTestimonial.company}</p>
                </div>
              </div>
              
              <div className={styles.companyLogo}>
                <Image 
                  src={currentTestimonial.logo || "/partners/placeholder-logo.svg"} 
                  alt={currentTestimonial.company}
                  width={100}
                  height={40}
                />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className={styles.navigationControls}>
          <button 
            className={styles.navButton} 
            onClick={() => handleDirectionChange(-1)}
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={24} />
          </button>
          
          <div className={styles.indicators}>
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`${styles.indicator} ${index === current ? styles.active : ''}`}
                onClick={() => {
                  setDirection(index > current ? 1 : -1);
                  setCurrent(index);
                  setAutoplay(false);
                }}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
          
          <button 
            className={styles.navButton} 
            onClick={() => handleDirectionChange(1)}
            aria-label="Next testimonial"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}