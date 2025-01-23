// src/components/home/ContactSection/ContactSection.tsx
"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  ChevronDown,
  Send 
} from 'lucide-react';
 
import styles from './ContactSection.module.scss';
import { ContactForm } from '@/app/(routes)/contact/ContactForm/ContactForm';
import AccordianWithIcons from '@/components/ui/OriginUI/Accordainwithicon';
import HeroUIAccordian from '@/components/ui/HeroUI/Accordian/Accordian';

const faqs = [
  {
    question: "What courses do you offer?",
    answer: "We offer a wide range of cybersecurity courses including Network Security, Penetration Testing, Cloud Security, and more. Our courses are designed for both beginners and advanced professionals."
  },
  {
    question: "How long are the courses?",
    answer: "Course duration varies depending on the program. Most courses range from 8-12 weeks, with flexible learning options to fit your schedule."
  },
  {
    question: "Do you provide job assistance?",
    answer: "Yes, we provide comprehensive job assistance including resume building, interview preparation, and connections with our industry partners."
  },
  {
    question: "Are the courses certified?",
    answer: "Yes, all our courses are industry-certified. We partner with leading organizations to ensure our certifications are globally recognized."
  },
  {
    question: "What are the payment options?",
    answer: "We offer flexible payment options including installments, scholarships, and EMI options. Contact our finance team for more details."
  }
];

export function ContactSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  // const [isSubmitting, setIsSubmitting] = useState(false);
  // const [formData, setFormData] = useState({
  //   name: '',
  //   email: '',
  //   phone: '',
  //   subject: '',
  //   message: ''
  // });

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   // setIsSubmitting(true);

  //   try {
  //     const response = await fetch('/api/contact', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(formData)
  //     });

  //     const result = await response.json();

  //     if (response.ok) {
  //       toast.success(result.message);
  //       // Reset form
  //       setFormData({
  //         name: '',
  //         email: '',
  //         phone: '',
  //         subject: '',
  //         message: ''
  //       });
  //     } else {
  //       toast.error(result.error || 'Failed to submit form');
  //     }
  //   } catch (error) {
  //     toast.error('An unexpected error occurred');
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };


  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  //   const { name, value } = e.target;
  //   setFormData(prev => ({
  //     ...prev,
  //     [name]: value
  //   }));
  // };

  return (
    <section className={styles.contactSection}>
      <motion.div 
        className={styles.container}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className={styles.content}>
          <div className={styles.contactInfo}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className={styles.header}
            >
              <h2>Get in Touch</h2>
              <p>Have questions? We're here to help!</p>
            </motion.div>

            <motion.div 
              className={styles.infoCards}
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div 
                className={styles.infoCard}
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0 }
                }}
              >
                <Mail className={styles.icon} />
                <h3>Email Us</h3>
                <p>info@cyberfortech.com</p>
                <p>support@cyberfortech.com</p>
              </motion.div>

              <motion.div 
                className={styles.infoCard}
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0 }
                }}
              >
                <Phone className={styles.icon} />
                <h3>Call Us</h3>
                <p>+1 (555) 123-4567</p>
                <p>Mon-Fri 9AM-6PM</p>
              </motion.div>

              <motion.div 
                className={styles.infoCard}
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0 }
                }}
              >
                <MapPin className={styles.icon} />
                <h3>Visit Us</h3>
                <p>123 Tech Street</p>
                <p>Cyber City, CC 12345</p>
              </motion.div>
            </motion.div>

            <div className={styles.faqSection}>
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Frequently Asked Questions
              </motion.h3>

              <div className={styles.faqList}>
                 {/* <AccordianWithIcons /> */}
                 <HeroUIAccordian />
                {/* {faqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    className={styles.faqItem}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <button
                      className={styles.faqButton}
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    >
                      <span>{faq.question}</span>
                      <ChevronDown 
                        className={`${styles.chevron} ${openFaq === index ? styles.rotate : ''}`}
                      />
                    </button>
                    <AnimatePresence>
                      {openFaq === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className={styles.faqAnswer}
                        >
                          <p>{faq.answer}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))} */}
              </div>
            </div>
          </div>
          <ContactForm/>

        </div>
      </motion.div>
    </section>
  );
}