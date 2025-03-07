"use client";

import React from 'react';
import { Atom } from 'lucide-react';
import ServiceDetail from './ServiceDetail';

const FullStackDevelopmentPage = () => {
  return (
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
          description: "Benefit from seamless integration between front-end and back-end systems"
        },
        {
          title: "Security By Design",
          description: "Applications built with security as a core principle from the start"
        },
        {
          title: "Scalable Solutions",
          description: "Create applications that can grow with your business needs"
        },
        {
          title: "Optimized User Experience",
          description: "Develop intuitive interfaces that enhance user satisfaction"
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
  );
};

export default FullStackDevelopmentPage;