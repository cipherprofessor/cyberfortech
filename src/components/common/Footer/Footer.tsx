import Link from 'next/link';
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import styles from './Footer.module.scss';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.section}>
            <Link href="/" className={styles.logo}>
              CyberForTech
            </Link>
            <p className={styles.description}>
              Empowering individuals with expert-led cybersecurity education and hands-on training.
            </p>
            <div className={styles.socialLinks}>
              <a href="#" className={styles.socialLink} aria-label="Facebook">
                <Facebook />
              </a>
              <a href="#" className={styles.socialLink} aria-label="Twitter">
                <Twitter />
              </a>
              <a href="#" className={styles.socialLink} aria-label="LinkedIn">
                <Linkedin />
              </a>
              <a href="#" className={styles.socialLink} aria-label="Instagram">
                <Instagram />
              </a>
            </div>
          </div>

          <div className={styles.linksGrid}>
            <div className={styles.linkSection}>
              <h3>Company</h3>
              <nav>
                <Link href="/about">About Us</Link>
                <Link href="/careers">Careers</Link>
                <Link href="/press">Press</Link>
                <Link href="/contact">Contact</Link>
              </nav>
            </div>

            <div className={styles.linkSection}>
              <h3>Courses</h3>
              <nav>
                <Link href="/courses/network-security">Network Security</Link>
                <Link href="/courses/web-security">Web Security</Link>
                <Link href="/courses/cloud-security">Cloud Security</Link>
                <Link href="/courses/malware-analysis">Malware Analysis</Link>
              </nav>
            </div>

            <div className={styles.linkSection}>
              <h3>Resources</h3>
              <nav>
                <Link href="/blog">Blog</Link>
                <Link href="/webinars">Webinars</Link>
                <Link href="/documentation">Documentation</Link>
                <Link href="/faq">FAQ</Link>
              </nav>
            </div>

            <div className={styles.linkSection}>
              <h3>Legal</h3>
              <nav>
                <Link href="/privacy">Privacy Policy</Link>
                <Link href="/terms">Terms of Service</Link>
                <Link href="/cookies">Cookie Policy</Link>
                <Link href="/security">Security</Link>
              </nav>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} CyberForTech. All rights reserved.
          </p>
          <div className={styles.additionalLinks}>
            <Link href="/sitemap">Sitemap</Link>
            <Link href="/accessibility">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}