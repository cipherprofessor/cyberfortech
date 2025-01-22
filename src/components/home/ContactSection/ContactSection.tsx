// src/components/home/ContactSection/ContactSection.tsx
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
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add form submission logic here
    console.log('Form submitted:', formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

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
                {faqs.map((faq, index) => (
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
                ))}
              </div>
            </div>
          </div>

          <div className={styles.formContainer}>
            <motion.form
              className={styles.contactForm}
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className={styles.formGroup}>
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                />
              </div>

              <motion.button
                type="submit"
                className={styles.submitButton}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Send Message
                <Send className={styles.icon} />
              </motion.button>
            </motion.form>
          </div>
        </div>
      </motion.div>
    </section>
  );
}