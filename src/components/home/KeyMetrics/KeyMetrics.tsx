// src/components/home/KeyMetrics/KeyMetrics.tsx
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
    value: 10000,
    suffix: '+',
    label: 'Satisfied Students',
    description: 'Globally trained professionals'
  },
  {
    icon: Award,
    value: 50,
    suffix: '+',
    label: 'Industry Awards',
    description: 'Recognition for excellence'
  },
  {
    icon: BookOpen,
    value: 100,
    suffix: '+',
    label: 'Courses',
    description: 'In-depth learning paths'
  },
  {
    icon: Briefcase,
    value: 85,
    suffix: '%',
    label: 'Placement Rate',
    description: 'Career success stories'
  },
  {
    icon: GraduationCap,
    value: 200,
    suffix: '+',
    label: 'Expert Trainers',
    description: 'Industry professionals'
  },
  {
    icon: Building,
    value: 20,
    suffix: '+',
    label: 'Global Locations',
    description: 'Training centers worldwide'
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
          <motion.h2
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            Our Impact in Numbers
          </motion.h2>
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            Delivering excellence in cybersecurity education worldwide
          </motion.p>
        </div>

        <div className={styles.metricsGrid}>
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              className={styles.metricCard}
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
                scale: 1.05,
                transition: { duration: 0.2 } 
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
              <h3 className={styles.label}>{metric.label}</h3>
              <p className={styles.description}>{metric.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className={styles.background}>
        <motion.div
          className={styles.gradientOrb}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
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