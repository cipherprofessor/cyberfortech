"use client"
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
  MessageSquare,
  ArrowRight,
  ExternalLink,
  Twitter,
  Notebook
} from 'lucide-react';
import { Accordion, AccordionItem, Avatar, Badge, Tooltip } from "@heroui/react";
import { ContactForm } from '@/app/(routes)/contact/ContactForm/ContactForm';
import styles from './contact.module.scss';
import { Calendar, FileCheck, BookOpen, Shield } from 'lucide-react';
import { OfficeLocations } from './Map/Map';


type FaqColor = "primary" | "success" | "warning" | "danger";

const faqData: { id: string; avatar: string; color: FaqColor; question: string; answer: string; }[] = [
  {
    id: "1",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    color: "primary",
    question: "What courses do you offer?",
    answer: "We offer comprehensive cybersecurity courses including Network Security, Penetration Testing, Cloud Security, Application Security, and more. Our curriculum is regularly updated to match industry demands and covers both theory and practical applications. Programs are available for beginners to advanced professionals."
  },
  {
    id: "2",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    color: "success",
    question: "How long are the courses?",
    answer: "Course durations vary based on the program level and content depth. Most courses range from 8-12 weeks, with flexible learning options including part-time and self-paced schedules. We also offer intensive bootcamp formats and extended professional certification tracks."
  },
  {
    id: "3",
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
    color: "warning",
    question: "Do you provide job assistance?",
    answer: "Yes, we provide comprehensive career support including resume building, interview preparation, and industry networking opportunities. Our career services team offers one-on-one mentoring, mock interviews, and connections with our extensive network of industry partners. We also organize regular job fairs and networking events."
  },
  {
    id: "4",
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026702e",
    color: "danger",
    question: "What certifications do you offer?",
    answer: "We offer preparation courses for major industry certifications including CompTIA Security+, CEH, CISSP, and more. Our programs include exam vouchers and practice tests. Additionally, we provide our own specialized certifications recognized by leading cybersecurity companies."
  },
  {
    id: "5",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    color: "primary",
    question: "Why should I choose CyberFort?",
    answer: "CyberFort is a leading cybersecurity training provider with a proven track record of success. Our instructors are industry experts with years of experience in the field. We offer hands-on training, real-world projects, and personalized mentorship. Our platform is user-friendly and accessible from anywhere, with 24/7 support and resources."
  }
];

const quickLinks = [
  {
    icon: <Calendar className={styles.quickIcon} />,
    title: "About Us",
    description: "Learn more about CyberFort Tech",
    link: "/about"
  },
  {
    icon: <FileCheck className={styles.quickIcon} />,
    title: "Course Catalog",
    description: "Browse available courses",
    link: "/courses"
  },
  {
    icon: <BookOpen className={styles.quickIcon} />,
    title: "Forum",
    description: "Join the community discussion",
    link: "/forum"
  },
  {
    icon: <Notebook className={styles.quickIcon} />,
    title: "Checkout Blog",
    description: "Latest news, updates and articles",
    link: "/blog"
  }
];


export default function ContactPage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const contactInfo = [
    {
      icon: <Mail />,
      title: "Email Support",
      details: [
        "General: hello@cyberfort.tech",
        "Support: hello@cyberfortech.in"
      ],
      description: "24/7 email support with average response time of 2 hours",
      color: "blue"
    },
    {
      icon: <Phone />,
      title: "Phone Support",
      details: [
        "General Inquiries: 7006712347",
        "Support Line: +91 9650443642"
      ],
      description: "Available Mon-Sat, 9AM-6PM EST",
      color: "green"
    },
    {
      icon: <Globe />,
      title: "Online Resources",
      details: [
        "Knowledge Base",
        "Video Tutorials"
      ],
      description: "Access our extensive library of resources and guides",
      color: "purple"
    },
    {
      icon: <Clock />,
      title: "Business Hours",
      details: [
        "Monday - Friday: 9:00 AM - 6:00 PM",
        "Weekend Support Available"
      ],
      description: "Extended hours for premium members",
      color: "orange"
    },
    {
      icon: <MapPin />,
      title: "Visit Us",
      details: [
        "Mig-3 Colony ",
        "Aligarh Uttar Pradesh"
      ],
      description: "Book an appointment for in-person consultation",
      color: "red"
    },
    {
      icon: <MessageSquare />,
      title: "Contact Us",
      details: [
        "Sales : +91 9205838868",
        "Operations : +91 942842322"
      ],
      description: "Instant support for urgent queries",
      color: "indigo"
    }
  ];

  const socialLinks = [
    {
      icon: <Linkedin />,
      url: "https://www.linkedin.com/company/cyberfort-tech",
      name: "LinkedIn",
      description: "Career updates & industry insights",
      color: "linkedin"
    },
    {
      icon: <Youtube />,
      url: "https://www.youtube.com/@CYBER-FORT-TECH",
      name: "YouTube",
      description: "Tutorial videos & tech talks",
      color: "youtube"
    },
    {
      icon: <Instagram />,
      url: "https://www.instagram.com/cyberfort_tech/",
      name: "Instagram",
      description: "Behind the scenes & community",
      color: "instagram"
    },
    {
      icon: <Twitter />,
      url: "https://instagram.com/CyberFort",
      name: "Twitter",
      description: "Latest updates & announcements",
      color: "twitter"
    }
  ];

  return (
    <section className={styles.contactSection}>
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={styles.container}
    >
      <motion.div 
        className={styles.header}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Get in Touch
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Have questions? We're here to help! Choose your preferred way to connect with us.
        </motion.p>
      </motion.div>

      <div className={styles.content}>
        <div className={styles.mainContent}>
          <div className={styles.contactGrid}>
          {contactInfo.map((info, index) => (
  <div className={styles.cardWrapper} key={info.title}>
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`${styles.contactCard} ${styles[`color${info.color}`]}`}
      onMouseEnter={() => setHoveredCard(info.title)}
      onMouseLeave={() => setHoveredCard(null)}
    >
      <div className={styles.cardIcon}>
        {info.icon}
      </div>
      <div className={styles.cardContent}>
        <h3>{info.title}</h3>
        {info.details.map((detail, i) => (
          <p key={i}>{detail}</p>
        ))}
        {hoveredCard === info.title && (
          <motion.p 
            className={styles.description}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {info.description}
          </motion.p>
        )}
      </div>
    </motion.div>
  </div>
))}
          </div>

          <div className={styles.socialLinks}>
            {socialLinks.map((social, index) => (
              <Tooltip content={social.description} key={social.name}>
                <motion.a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  whileHover={{ y: -3 }}
                  transition={{ delay: index * 0.1 }}
                  className={`${styles.socialLink} ${styles[social.color]}`}
                >
                  {social.icon}
                  <span>{social.name}</span>
                  <ExternalLink size={14} className={styles.externalIcon} />
                </motion.a>
              </Tooltip>
            ))}
          </div>

          <div className={styles.faqSection}>
            <h3>Frequently Asked Questions</h3>
            {/* <Badge color="primary" content="5">
      <Avatar radius="md" size="lg" src="https://i.pravatar.cc/300?u=a042581f4e29026709d" />
    </Badge> */}
            <Accordion selectionMode="multiple">
              {faqData.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  aria-label={faq.question}
                  startContent={
                    <Avatar
                      isBordered
                      color={faq.color}
                      radius="lg"
                      src={faq.avatar}
                    />
                  }
                  title={faq.question}
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={styles.faqAnswer}
                  >
                    {faq.answer}
                  </motion.div>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        <div className={styles.rightSection}>
  <motion.div 
    className={styles.formWrapper}
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6 }}
  >
    <ContactForm />
  </motion.div>

  <motion.div 
    className={styles.quickLinksSection}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4 }}
  >
    <motion.h3
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      Quick Access
    </motion.h3>
    <div className={styles.quickLinksGrid}>
      {quickLinks.map((link, index) => (
        <motion.a
          key={link.title}
          href={link.link}
          className={styles.quickLink}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileHover={{ 
            y: -5,
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)'
          }}
          transition={{ 
            delay: index * 0.1,
            duration: 0.2,
            ease: "easeOut"
          }}
        >
          <div className={styles.quickLinkIcon}>{link.icon}</div>
          <div className={styles.quickLinkContent}>
            <h4>{link.title}</h4>
            <p>{link.description}</p>
          </div>
        </motion.a>
      ))}
    </div>
  </motion.div>
</div>
      </div>
    </motion.div>
  </section>
  );
}