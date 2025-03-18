"use client"
import { motion } from 'framer-motion';
import { MessageSquare, FileCheck, Handshake, Rocket } from 'lucide-react';
import styles from './PartnershipProcess.module.scss';
import { JSX } from 'react';

interface ProcessStepProps {
  number: number;
  title: string;
  description: string;
  icon: JSX.Element;
}

export function PartnershipProcess() {
  const processSteps: ProcessStepProps[] = [
    {
      number: 1,
      title: 'Initial Consultation',
      description: 'We start with a conversation to understand your business, goals, and how we might work together.',
      icon: <MessageSquare size={24} />
    },
    {
      number: 2,
      title: 'Partnership Agreement',
      description: 'Once we identify mutual opportunities, we formalize our partnership with clear terms and expectations.',
      icon: <FileCheck size={24} />
    },
    {
      number: 3,
      title: 'Onboarding Process',
      description: 'Our dedicated team will guide you through the integration process, providing all necessary resources.',
      icon: <Handshake size={24} />
    },
    {
      number: 4,
      title: 'Launch & Growth',
      description: 'With everything in place, we launch our partnership and implement strategies for mutual growth.',
      icon: <Rocket size={24} />
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <motion.div 
      className={styles.processContainer}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {processSteps.map((step, index) => (
        <motion.div 
          key={index} 
          className={styles.processStep}
          variants={itemVariants}
        >
          <div className={styles.stepContent}>
            <div className={styles.stepNumber}>
              <span>{step.number}</span>
            </div>
            <div className={styles.iconContainer}>
              {step.icon}
            </div>
            <h3 className={styles.stepTitle}>{step.title}</h3>
            <p className={styles.stepDescription}>{step.description}</p>
          </div>
          
          {index < processSteps.length - 1 && (
            <div className={styles.connector}>
              <motion.div 
                className={styles.connectorLine}
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                transition={{ delay: 0.5, duration: 0.8 }}
                viewport={{ once: true }}
              ></motion.div>
            </div>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}