"use client";

import React from 'react';
import { Search, ShieldAlert } from 'lucide-react';
import ServiceDetail from './ServiceDetail';


const PenetrationTestingPage = () => {
  return (
    <ServiceDetail
      title="Penetration Testing"
      description="Cyberfort Technologies offers comprehensive penetration testing services to identify and address vulnerabilities across various IT environments. Our expert team simulates real-world attack scenarios to provide actionable insights, helping organizations strengthen their defenses and comply with regulatory standards."
      icon={Search}
      color="#dc3545"
      features={[
        "Network Penetration Testing assessing internal and external networks to uncover security gaps",
        "Web and Mobile Application Testing evaluating applications for common vulnerabilities",
        "Cloud Security Testing ensuring cloud environments are secure against misconfigurations",
        "IoT and OT Testing identifying risks in Internet of Things devices and Operational Technology systems",
        "Code Reviews analyzing source code to detect and fix security flaws",
        "AI/LLM Testing evaluating AI models and large language models for potential vulnerabilities"
      ]}
      benefits={[
        {
          title: "Proactive Security",
          description: "Identify vulnerabilities before they can be exploited by real attackers"
        },
        {
          title: "Risk Reduction",
          description: "Reduce the likelihood and impact of successful cyberattacks"
        },
        {
          title: "Compliance Support",
          description: "Meet penetration testing requirements for regulatory frameworks"
        },
        {
          title: "Strategic Remediation",
          description: "Prioritize security fixes based on real-world exploit potential"
        }
      ]}
      caseStudies={[
        {
          title: "Financial Services Security Assessment",
          description: "Conducted comprehensive penetration testing for a financial institution, identifying critical vulnerabilities before they could be exploited.",
          link: "/case-studies/financial-pentest"
        },
        {
          title: "Healthcare System Security Testing",
          description: "Performed penetration testing on a healthcare provider's network and applications, ensuring patient data security and HIPAA compliance.",
          link: "/case-studies/healthcare-pentest"
        },
        {
          title: "Retail E-commerce Platform Testing",
          description: "Identified and remediated critical vulnerabilities in a major retail e-commerce platform, preventing potential data breaches.",
          link: "/case-studies/retail-pentest"
        }
      ]}
    />
  );
};

export default PenetrationTestingPage;