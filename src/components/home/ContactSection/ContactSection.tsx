import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Youtube, 
  Instagram,
  Globe,
  Clock,
  MessageSquare
} from 'lucide-react';
import { Accordion, AccordionItem, Avatar } from "@heroui/react";
import { ContactForm } from '@/app/(routes)/contact/ContactForm/ContactForm';
import styles from './ContactSection.module.scss';

export function ContactSection() {
  const contactInfo = [
    {
      icon: <Mail className={styles.icon} />,
      title: "Email",
      details: ["info@cyberfortech.com", "support@cyberfortech.com"],
      color: "blue"
    },
    {
      icon: <Phone className={styles.icon} />,
      title: "Phone",
      details: ["+1 (555) 123-4567", "Mon-Fri 9AM-6PM"],
      color: "green"
    },
    {
      icon: <Globe className={styles.icon} />,
      title: "Website",
      details: ["www.cyberfortech.com", "Online Support 24/7"],
      color: "purple"
    },
    {
      icon: <Clock className={styles.icon} />,
      title: "Working Hours",
      details: ["Monday - Friday", "9:00 AM - 6:00 PM"],
      color: "orange"
    },
    {
      icon: <MapPin className={styles.icon} />,
      title: "Location",
      details: ["123 Tech Street", "Cyber City, CC 12345"],
      color: "red"
    },
    {
      icon: <MessageSquare className={styles.icon} />,
      title: "Live Chat",
      details: ["Available 24/7", "Response time: 5 mins"],
      color: "indigo"
    }
  ];

  const socialLinks = [
    {
      icon: <Linkedin className={styles.icon} />,
      url: "https://linkedin.com/company/cyberfortech",
      name: "LinkedIn",
      color: "linkedin"
    },
    {
      icon: <Youtube className={styles.icon} />,
      url: "https://youtube.com/cyberfortech",
      name: "YouTube",
      color: "youtube"
    },
    {
      icon: <Instagram className={styles.icon} />,
      url: "https://instagram.com/cyberfortech",
      name: "Instagram",
      color: "instagram"
    }
  ];

  const faqs = [
    {
      question: "What courses do you offer?",
      answer: "We offer comprehensive cybersecurity courses including Network Security, Penetration Testing, Cloud Security, and more. Our curriculum is designed for both beginners and advanced professionals."
    },
    {
      question: "How long are the courses?",
      answer: "Course duration varies by program. Most courses range from 8-12 weeks, with flexible learning options to fit your schedule. We also offer intensive bootcamps and self-paced options."
    },
    {
      question: "Do you provide job assistance?",
      answer: "Yes, we provide comprehensive job assistance including resume building, interview preparation, and connections with our industry partners. Our career services team works one-on-one with students."
    },
    {
      question: "Are the courses certified?",
      answer: "Yes, all our courses are industry-certified. We partner with leading organizations to ensure our certifications are globally recognized and valued by employers."
    },
    {
      question: "What are the payment options?",
      answer: "We offer flexible payment options including installments, scholarships, and EMI options. Contact our finance team for detailed information about payment plans."
    }
  ];

  return (
    <section className={styles.contactSection}>
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className={styles.container}
      >
        <div className={styles.header}>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            Get in Touch
          </motion.h2>
          <p>Have questions? We're here to help! Connect with us through any of these channels.</p>
        </div>

        <div className={styles.content}>
          <div className={styles.mainContent}>
            <div className={styles.contactGrid}>
              {contactInfo.map((info, index) => (
                <motion.div 
                  key={info.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`${styles.contactCard} ${styles[`color${info.color}`]}`}
                >
                  <div className={styles.cardIcon}>
                    {info.icon}
                  </div>
                  <div className={styles.cardContent}>
                    <h3>{info.title}</h3>
                    {info.details.map((detail, i) => (
                      <p key={i}>{detail}</p>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className={styles.socialLinks}>
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`${styles.socialLink} ${styles[social.color]}`}
                >
                  {social.icon}
                  <span>{social.name}</span>
                </motion.a>
              ))}
            </div>

            <div className={styles.faqSection}>
              <h3>Frequently Asked Questions</h3>
              <div className={styles.faqGrid}>
                {faqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={styles.faqCard}
                  >
                    <h4>{faq.question}</h4>
                    <p>{faq.answer}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className={styles.formWrapper}
          >
            <h3>Send us a Message</h3>
            <ContactForm />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}