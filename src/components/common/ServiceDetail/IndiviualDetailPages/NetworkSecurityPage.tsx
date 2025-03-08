"use client";

import React from 'react';
import { Network, CircuitBoard } from 'lucide-react';
import ServiceDetail from '../ServiceDetail';

const NetworkSecurityPage = () => {
  return (
    <ServiceDetail
      title="Network Security"
      description="Cyberfort Technologies provides a range of network security services aimed at protecting organizations from evolving cyber threats. Our comprehensive solutions safeguard your networks, protect your data, maintain operational continuity, and keep you ahead of cyber risks."
      icon={Network}
      color="#007bff"
      features={[
        "Network Vulnerability Assessments to identify and address weaknesses in network infrastructure",
        "Professional Penetration Testing simulating real-world attacks to evaluate network defenses",
        "Firewall and Intrusion Detection/Prevention Systems (IDS/IPS) implementation and management",
        "Secure Network Design creating architectures that prioritize security and resilience",
        "24/7 Continuous Monitoring proactively detecting and responding to threats in real-time",
        "Compliance Management ensuring networks meet industry standards and regulatory requirements"
      ]}
      benefits={[
        {
          title: "Proactive Protection",
          description: "Identify and address vulnerabilities before they can be exploited by attackers"
        },
        {
          title: "Reduced Risk",
          description: "Minimize the likelihood of successful cyberattacks through robust security measures"
        },
        {
          title: "Business Continuity",
          description: "Ensure your network remains operational even in the face of cyber threats"
        },
        {
          title: "Regulatory Compliance",
          description: "Meet industry standards and legal requirements for network security"
        }
      ]}
      caseStudies={[
        {
          title: "Financial Institution Security Upgrade",
          description: "Helped a regional bank improve their network security, resulting in a 95% reduction in security incidents over 12 months.",
          link: "/case-studies/financial-security"
        },
        {
          title: "Healthcare Provider Protection",
          description: "Implemented advanced network protection for a healthcare system, securing patient data and ensuring HIPAA compliance.",
          link: "/case-studies/healthcare-protection"
        }
      ]}
    />
  );
};

export default NetworkSecurityPage;