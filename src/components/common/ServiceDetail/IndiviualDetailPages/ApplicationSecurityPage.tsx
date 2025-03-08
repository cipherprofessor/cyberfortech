"use client";

import React from 'react';
import { Code2, FileCode2 } from 'lucide-react';
import ServiceDetail from '../ServiceDetail';

const ApplicationSecurityPage = () => {
  return (
    <ServiceDetail
      title="Application Security"
      description="Cyberfort Technologies offers robust application security services to protect software applications from vulnerabilities and cyber threats. Our tailored solutions help organizations safeguard their applications, protect sensitive data, and maintain user trust."
      icon={Code2}
      color="#00bcd4"
      features={[
        "Application Vulnerability Assessments to identify and address security weaknesses",
        "Secure Code Reviews analyzing source code to detect and fix vulnerabilities during development",
        "Advanced Penetration Testing simulating attacks to evaluate application defenses",
        "Web Application Firewall (WAF) Implementation protecting applications from common threats",
        "DevSecOps Integration embedding security practices into the software development lifecycle",
        "Compliance Management ensuring applications meet industry standards and regulatory requirements"
      ]}
      benefits={[
        {
          title: "Vulnerability Reduction",
          description: "Identify and fix security flaws before they can be exploited by attackers"
        },
        {
          title: "Secure Software Development",
          description: "Integrate security into every stage of the development process"
        },
        {
          title: "Data Protection",
          description: "Safeguard sensitive customer and business data within your applications"
        },
        {
          title: "Compliance Assurance",
          description: "Meet industry standards and regulations for application security"
        }
      ]}
      caseStudies={[
        {
          title: "E-commerce Platform Security",
          description: "Secured a major e-commerce platform handling sensitive payment data for millions of users, implementing robust protection against OWASP Top 10 vulnerabilities.",
          link: "/case-studies/ecommerce-security"
        },
        {
          title: "Healthcare Application Protection",
          description: "Implemented comprehensive security for a patient management system, ensuring HIPAA compliance and protection of sensitive medical information.",
          link: "/case-studies/healthcare-app-security"
        }
      ]}
    />
  );
};

export default ApplicationSecurityPage;