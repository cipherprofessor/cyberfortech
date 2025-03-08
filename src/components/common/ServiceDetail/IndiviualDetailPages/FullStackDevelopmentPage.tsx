"use client";

import React from 'react';
import { Atom, Code, Database, Layout, Globe, Shield, Smartphone } from 'lucide-react';

import Image from 'next/image';
import styles from './ServicePages.module.scss';
import ServiceDetail from '../ServiceDetail';

const FullStackDevelopmentPage = () => {
  return (
    <div className={styles.servicePage}>
      {/* Technology background elements */}
      <div className={styles.bgElements}>
        <div className={styles.techIcon} style={{ top: '10%', left: '5%', animationDelay: '0s' }}>
          <Code size={24} />
        </div>
        <div className={styles.techIcon} style={{ top: '15%', right: '8%', animationDelay: '0.3s' }}>
          <Database size={24} />
        </div>
        <div className={styles.techIcon} style={{ top: '60%', left: '7%', animationDelay: '0.6s' }}>
          <Layout size={24} />
        </div>
        <div className={styles.techIcon} style={{ top: '70%', right: '10%', animationDelay: '0.9s' }}>
          <Smartphone size={24} />
        </div>
        
        <div className={styles.codeSnippet} style={{ top: '25%', left: '3%' }}>
          {`function App() {
  return (
    <div>
      <Component />
    </div>
  );
}`}
        </div>
        
        <div className={styles.codeSnippet} style={{ bottom: '15%', right: '3%' }}>
          {`const server = express();
app.get('/api', (req, res) => {
  res.json({ data });
});`}
        </div>
      </div>
      
      <ServiceDetail
        title="Full Stack Development"
        description="Cyberfort Technologies offers full-stack development services to build scalable, secure, and user-friendly web applications. Our expertise spans both front-end and back-end development, ensuring seamless integration and functionality for businesses across various domains."
        icon={Atom}
        color="#00bcd4"
        features={[
          "Front-End Development crafting intuitive and responsive user interfaces using technologies like HTML, CSS, JavaScript, and frameworks such as React or Angular",
          "Back-End Development building robust server-side logic and APIs using languages like Python, Node.js, or Java, and databases like MySQL or MongoDB",
          "End-to-End Solutions providing complete development services, from ideation and design to deployment and maintenance",
          "Security Integration embedding security best practices throughout the development lifecycle",
          "Custom Solutions tailoring applications to meet specific business needs and industry requirements",
          "Mobile Application Development creating responsive applications for iOS and Android platforms"
        ]}
        benefits={[
          {
            title: "Unified Development Approach",
            description: "Benefit from seamless integration between front-end and back-end systems for optimal performance and user experience."
          },
          {
            title: "Security By Design",
            description: "Applications built with security as a core principle from the start, protecting your data and your users."
          },
          {
            title: "Scalable Solutions",
            description: "Create applications that can grow with your business needs and handle increasing user loads effortlessly."
          },
          {
            title: "Optimized User Experience",
            description: "Develop intuitive interfaces that enhance user satisfaction and drive engagement with your platforms."
          }
        ]}
        caseStudies={[
          {
            title: "Healthcare Management System",
            description: "Developed a comprehensive healthcare management system for a multi-location medical practice, improving patient care and operational efficiency.",
            link: "/case-studies/healthcare-management-system"
          },
          {
            title: "E-commerce Platform Development",
            description: "Built a secure and scalable e-commerce platform handling thousands of transactions daily for a retail business, increasing sales by 45%.",
            link: "/case-studies/ecommerce-platform"
          },
          {
            title: "Financial Services Dashboard",
            description: "Created a custom financial analytics dashboard for investment professionals, providing real-time insights and secure data visualization.",
            link: "/case-studies/financial-dashboard"
          }
        ]}
      />
      
      {/* Showcase section */}
      <div className={styles.showcaseSection}>
        <h2 className={styles.showcaseTitle}>Our Development Approach</h2>
        
        <div className={styles.showcaseGrid}>
          <div className={styles.showcaseItem}>
            <div className={styles.showcaseIconContainer}>
              <Layout className={styles.showcaseIcon} />
            </div>
            <h3>Front-End Excellence</h3>
            <p>Creating responsive, intuitive, and visually appealing user interfaces that enhance user engagement</p>
          </div>
          
          <div className={styles.showcaseItem}>
            <div className={styles.showcaseIconContainer}>
              <Database className={styles.showcaseIcon} />
            </div>
            <h3>Back-End Robustness</h3>
            <p>Building secure, scalable server architectures and databases that handle complex business logic efficiently</p>
          </div>
          
          <div className={styles.showcaseItem}>
            <div className={styles.showcaseIconContainer}>
              <Shield className={styles.showcaseIcon} />
            </div>
            <h3>Security-First Development</h3>
            <p>Implementing best security practices throughout the development lifecycle to protect your data</p>
          </div>
          
          <div className={styles.showcaseItem}>
            <div className={styles.showcaseIconContainer}>
              <Globe className={styles.showcaseIcon} />
            </div>
            <h3>Scalable Architecture</h3>
            <p>Designing systems that can grow with your business and adapt to changing requirements</p>
          </div>
        </div>
      </div>
      
      {/* Technology stack */}
      <div className={styles.techStackSection}>
        <h2 className={styles.techStackTitle}>Technologies We Use</h2>
        
        <div className={styles.techStackContainer}>
          <div className={styles.techCategory}>
            <h3>Front-End</h3>
            <div className={styles.techLogos}>
              <div className={styles.techLogo}>
                <div className={styles.logoPlaceholder}>React</div>
              </div>
              <div className={styles.techLogo}>
                <div className={styles.logoPlaceholder}>Angular</div>
              </div>
              <div className={styles.techLogo}>
                <div className={styles.logoPlaceholder}>Vue.js</div>
              </div>
              <div className={styles.techLogo}>
                <div className={styles.logoPlaceholder}>Next.js</div>
              </div>
            </div>
          </div>
          
          <div className={styles.techCategory}>
            <h3>Back-End</h3>
            <div className={styles.techLogos}>
              <div className={styles.techLogo}>
                <div className={styles.logoPlaceholder}>Node.js</div>
              </div>
              <div className={styles.techLogo}>
                <div className={styles.logoPlaceholder}>Python</div>
              </div>
              <div className={styles.techLogo}>
                <div className={styles.logoPlaceholder}>Java</div>
              </div>
              <div className={styles.techLogo}>
                <div className={styles.logoPlaceholder}>.NET</div>
              </div>
            </div>
          </div>
          
          <div className={styles.techCategory}>
            <h3>Databases</h3>
            <div className={styles.techLogos}>
              <div className={styles.techLogo}>
                <div className={styles.logoPlaceholder}>MongoDB</div>
              </div>
              <div className={styles.techLogo}>
                <div className={styles.logoPlaceholder}>MySQL</div>
              </div>
              <div className={styles.techLogo}>
                <div className={styles.logoPlaceholder}>PostgreSQL</div>
              </div>
              <div className={styles.techLogo}>
                <div className={styles.logoPlaceholder}>Redis</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullStackDevelopmentPage;