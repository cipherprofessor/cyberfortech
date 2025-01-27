// src/components/home/ContactSection/ContactSection.tsx
"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {Accordion, AccordionItem, Avatar} from "@heroui/react";
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

const defaultContent =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

export function ContactSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const Accordian1Content ="We offer a wide range of cybersecurity courses including Network Security, Penetration Testing, Cloud Security, and more. Our courses are designed for both beginners and advanced professionals.";
 const Accordian2Content = "Course duration varies depending on the program. Most courses range from 8-12 weeks, with flexible learning options to fit your schedule.";
 const Accordian3Content = "Yes, we provide comprehensive job assistance including resume building, interview preparation, and connections with our industry partners.";
  
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
                 {/* <HeroUIAccordian /> */}

                 <Accordion selectionMode="multiple">
      <AccordionItem
        key="1"
        aria-label="Chung Miller"
        startContent={
          <Avatar
            isBordered
            color="primary"
            radius="lg"
            src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
          />
        }
        subtitle="4 unread messages"
        title="Chung Miller"
      >
        {defaultContent}
      </AccordionItem>
      <AccordionItem
        key="2"
        aria-label="Janelle Lenard"
        startContent={
          <Avatar
            isBordered
            color="success"
            radius="lg"
            src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
          />
        }
        subtitle="3 incompleted steps"
        title="Janelle Lenard"
      >
        {defaultContent}
      </AccordionItem>
      <AccordionItem
        key="3"
        aria-label="Zoey Lang"
        startContent={
          <Avatar
            isBordered
            color="warning"
            radius="lg"
            src="https://i.pravatar.cc/150?u=a04258114e29026702d"
          />
        }
        subtitle={
          <p className="flex">
            2 issues to<span className="text-primary ml-1">fix now</span>
          </p>
        }
        title="Zoey Lang"
      >
        {defaultContent}
      </AccordionItem>
    </Accordion>

                
              </div>
            </div>
          </div>
          <ContactForm/>

        </div>
      </motion.div>
    </section>
  );
}