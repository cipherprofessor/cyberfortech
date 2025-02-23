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


const Accordian1Content ="We offer a wide range of cybersecurity courses including Network Security, Penetration Testing, Cloud Security, and more. Our courses are designed for both beginners and advanced professionals.";
 const Accordian2Content = "Course duration varies depending on the program. Most courses range from 8-12 weeks, with flexible learning options to fit your schedule.";
 const Accordian3Content = "Yes, we provide comprehensive job assistance including resume building, interview preparation, and connections with our industry partners.";


export function ContactSection() {
  const contactInfo = [
    {
      icon: <Mail className={styles.icon} />,
      title: "Email",
      details: ["info@CyberFort.com", "support@CyberFort.com"],
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
      details: ["www.CyberFort.com", "Online Support 24/7"],
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
      url: "https://linkedin.com/company/CyberFort",
      name: "LinkedIn",
      color: "linkedin"
    },
    {
      icon: <Youtube className={styles.icon} />,
      url: "https://youtube.com/CyberFort",
      name: "YouTube",
      color: "youtube"
    },
    {
      icon: <Instagram className={styles.icon} />,
      url: "https://instagram.com/CyberFort",
      name: "Instagram",
      color: "instagram"
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
        // subtitle="4 unread messages"
        title="What courses do you offer?"
      >
        {Accordian1Content}
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
        // subtitle="3 incompleted steps"
        title="How long are the courses?"
      >
        {Accordian2Content}
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
        // subtitle={
        //   <p className="flex">
        //     2 issues to<span className="text-primary ml-1">fix now</span>
        //   </p>
        // }
        title="Do you provide job assistance?"
      >
        {Accordian3Content}
      </AccordionItem>
    </Accordion>
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