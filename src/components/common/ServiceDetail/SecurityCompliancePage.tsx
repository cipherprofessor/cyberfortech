"use client";

import React from 'react';
import { ShieldCheck, Shield } from 'lucide-react';
import ServiceDetail from './ServiceDetail';


const SecurityCompliancePage = () => {
  return (
    <ServiceDetail
      title="Security Compliance"
      description="Cyberfort Technologies specializes in security compliance services to help organizations meet industry standards and regulatory requirements. Our comprehensive approach ensures that businesses not only meet regulatory obligations but also strengthen their overall security posture."
      icon={ShieldCheck}
      color="#28a745"
      features={[
        "Compliance Assessments evaluating systems and processes against standards like GDPR, ISO 27001, HIPAA, and PCI DSS",
        "Policy Development crafting security policies and procedures tailored to organizational needs",
        "Audit Support assisting with internal and external audits to demonstrate compliance",
        "Risk Management identifying and mitigating risks to maintain compliance",
        "Continuous Monitoring ensuring ongoing adherence to compliance requirements",
        "Compliance Training educating staff on security best practices and requirements"
      ]}
      benefits={[
        {
          title: "Regulatory Confidence",
          description: "Operate with confidence knowing you meet all required standards"
        },
        {
          title: "Risk Reduction",
          description: "Identify and address compliance risks before they become issues"
        },
        {
          title: "Customer Trust",
          description: "Build trust with customers through demonstrated compliance"
        },
        {
          title: "Avoid Penalties",
          description: "Prevent costly fines and sanctions for non-compliance"
        }
      ]}
      caseStudies={[
        {
          title: "Healthcare HIPAA Compliance",
          description: "Helped a healthcare provider achieve and maintain HIPAA compliance, implementing comprehensive controls and documentation.",
          link: "/case-studies/hipaa-compliance"
        },
        {
          title: "Financial Institution PCI DSS Compliance",
          description: "Guided a financial services company through PCI DSS certification, securing cardholder data and passing all compliance audits.",
          link: "/case-studies/pci-compliance"
        },
        {
          title: "Multinational GDPR Implementation",
          description: "Assisted a global organization in implementing GDPR requirements across all operations, avoiding potential penalties.",
          link: "/case-studies/gdpr-compliance"
        }
      ]}
    />
  );
};

export default SecurityCompliancePage;