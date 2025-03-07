"use client";

import React from 'react';
import { Lock, Database } from 'lucide-react';
import ServiceDetail from './ServiceDetail';

const IncidentResponsePage = () => {
  return (
    <ServiceDetail
      title="Incident Response"
      description="Cyberfort Technologies provides robust incident response services to help organizations detect, contain, and recover from cyberattacks efficiently. Our expert team is available 24/7 to assist with incident handling, minimizing the impact of cyber incidents while enhancing overall resilience."
      icon={Lock}
      color="#fd7e14"
      features={[
        "Incident Detection and Analysis monitoring systems to identify and analyze potential threats in real-time",
        "Containment and Mitigation isolating affected systems to prevent the spread of an attack",
        "Root Cause Investigation performing forensic analysis to determine the origin and scope of the incident",
        "Recovery and Restoration assisting in restoring systems and data, ensuring minimal downtime",
        "Post-Incident Reporting preparing detailed reports and actionable insights",
        "Proactive Readiness developing and testing incident response plans"
      ]}
      benefits={[
        {
          title: "Rapid Response",
          description: "Get immediate expert assistance when security incidents occur"
        },
        {
          title: "Minimize Damage",
          description: "Contain incidents quickly to reduce their impact on your business"
        },
        {
          title: "Business Continuity",
          description: "Recover quickly from incidents with minimal disruption"
        },
        {
          title: "Continuous Improvement",
          description: "Learn from incidents to strengthen your security posture"
        }
      ]}
      caseStudies={[
        {
          title: "Ransomware Attack Recovery",
          description: "Successfully contained and remediated a ransomware attack for a manufacturing company, restoring operations within 24 hours with no data loss.",
          link: "/case-studies/ransomware-recovery"
        },
        {
          title: "Data Breach Response",
          description: "Responded to a major data breach at a retail organization, containing the incident, identifying the source, and implementing enhanced security measures.",
          link: "/case-studies/data-breach-response"
        },
        {
          title: "Supply Chain Attack Mitigation",
          description: "Identified and mitigated a supply chain compromise affecting multiple systems, preventing widespread data exfiltration.",
          link: "/case-studies/supply-chain-response"
        }
      ]}
    />
  );
};

export default IncidentResponsePage;