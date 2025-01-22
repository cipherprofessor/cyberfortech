"use client"
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './FAQ.module.scss';

type Question = {
  question: string;
  answer: string;
};

type FAQProps = {
  questions: Question[];
};

export function FAQ({ questions }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={styles.faqContainer}>
      {questions.map((item, index) => (
        <div key={index} className={styles.faqItem}>
          <button
            className={`${styles.question} ${openIndex === index ? styles.active : ''}`}
            onClick={() => toggleQuestion(index)}
          >
            <span>{item.question}</span>
            {openIndex === index ? (
              <ChevronUp className={styles.icon} />
            ) : (
              <ChevronDown className={styles.icon} />
            )}
          </button>

          <AnimatePresence>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={styles.answerContainer}
              >
                <div className={styles.answer}>
                  {item.answer}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
