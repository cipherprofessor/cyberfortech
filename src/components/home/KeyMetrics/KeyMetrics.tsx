// src/components/home/KeyMetrics/KeyMetrics.tsx
"use client";
import { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { 
  Users, 
  Award, 
  BookOpen, 
  Briefcase, 
  GraduationCap,
  Building 
} from 'lucide-react';
import styles from './KeyMetrics.module.scss';

const metrics = [
  {
    icon: Users,
    value: 200,
    suffix: '+',
    label: 'Satisfied Students',
    description: 'Globally trained professionals',
    color: 'blue'
  },
  {
    icon: Award,
    value: 20,
    suffix: '+',
    label: 'Industry Awards',
    description: 'Recognition for excellence',
    color: 'purple'
  },
  {
    icon: BookOpen,
    value: 30,
    suffix: '+',
    label: 'Courses',
    description: 'In-depth learning paths',
    color: 'green'
  },
  {
    icon: Briefcase,
    value: 85,
    suffix: '%',
    label: 'Placement Rate',
    description: 'Career success stories',
    color: 'orange'
  },
  {
    icon: GraduationCap,
    value: 20,
    suffix: '+',
    label: 'Expert Trainers',
    description: 'Industry professionals',
    color: 'red'
  }
];

export function KeyMetrics() {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  return (
    <section className={styles.metricsSection}>
      <motion.div
        ref={ref}
        className={styles.container}
        initial="hidden"
        animate={controls}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
      >
       <div className={styles.header}>
          <motion.div 
            initial="hidden"
            animate="visible"
          >
            {[1, 2, 3].map((_, i) => (
              <motion.span
                key={i}
                className={styles.accentDot}
                variants={{
                  hidden: { scale: 0, opacity: 0 },
                  visible: {
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                    transition: {
                      repeat: Infinity,
                      duration: 3,
                      delay: i * 0.4,
                      ease: "easeInOut"
                    }
                  }
                }}
              />
            ))}
            <motion.h2
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: {
                    duration: 0.8,
                    ease: [0.4, 0, 0.2, 1]
                  }
                }
              }}
            >
              Our Impact in Numbers
            </motion.h2>
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: {
                    duration: 0.8,
                    delay: 0.2,
                    ease: [0.4, 0, 0.2, 1]
                  }
                }
              }}
            >
              Shaping Tomorrow's Cybersecurity Landscape
            </motion.p>
          </motion.div>
        </div>

        <div className={styles.metricsGrid}>
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              className={`${styles.metricCard} ${styles[`color${metric.color}`]}`}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.5,
                    ease: "easeOut"
                  }
                }
              }}
              whileHover={{ 
                y: -8,
                transition: { 
                  duration: 0.2,
                  ease: "easeOut"
                }
              }}
            >
              <div className={styles.iconWrapper}>
                <metric.icon className={styles.icon} />
              </div>
              <motion.div
                className={styles.value}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <CounterAnimation
                  from={0}
                  to={metric.value}
                  duration={2}
                />
                {metric.suffix}
              </motion.div>
              <motion.div 
                className={styles.content}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: index * 0.2 }}
              >
                <h3 className={styles.label}>{metric.label}</h3>
                <p className={styles.description}>{metric.description}</p>
                <div className={styles.chip}>View Details</div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

// Counter Animation Component
function CounterAnimation({ from, to, duration }: { from: number; to: number; duration: number }) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(nodeRef, { once: true });
  
  useEffect(() => {
    if (!nodeRef.current || !isInView) return;

    let startTimestamp: number;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = (timestamp - startTimestamp) / (duration * 1000);

      if (progress < 1) {
        const currentCount = Math.floor(from + (to - from) * progress);
        if (nodeRef.current) {
          nodeRef.current.textContent = currentCount.toString();
        }
        requestAnimationFrame(step);
      } else {
        if (nodeRef.current) {
          nodeRef.current.textContent = to.toString();
        }
      }
    };

    requestAnimationFrame(step);
  }, [from, to, duration, isInView]);

  return <span ref={nodeRef}>{from}</span>;
}