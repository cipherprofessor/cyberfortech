"use client";

import React from 'react';
import { Cloud, CloudLightning } from 'lucide-react';
import ServiceDetail from './ServiceDetail';

const CloudSecurityPage = () => {
  return (
    <ServiceDetail
      title="Cloud Security"
      description="Cyberfort Technologies provides comprehensive cloud security services to protect businesses' cloud environments from evolving threats. Our solutions ensure that organizations can leverage the benefits of cloud computing while maintaining security, compliance, and operational continuity."
      icon={Cloud}
      color="#6610f2"
      features={[
        "Cloud Security Assessments identifying vulnerabilities in public, private, and hybrid cloud infrastructures",
        "Data Protection implementing encryption, access controls, and secure data storage solutions",
        "Identity and Access Management (IAM) ensuring secure access to cloud resources",
        "Compliance Management aligning cloud operations with industry standards",
        "Threat Monitoring and Incident Response proactively detecting and mitigating cloud-based threats",
        "Secure Cloud Architecture Design building resilient and scalable cloud environments"
      ]}
      benefits={[
        {
          title: "Secure Cloud Migration",
          description: "Migrate to the cloud with confidence knowing security is built in from the start"
        },
        {
          title: "Data Protection",
          description: "Keep sensitive data secure with encryption and strong access controls"
        },
        {
          title: "Cost Efficiency",
          description: "Benefit from cloud economics without compromising on security"
        },
        {
          title: "Regulatory Compliance",
          description: "Meet industry compliance requirements in cloud environments"
        }
      ]}
      caseStudies={[
        {
          title: "Enterprise Cloud Migration",
          description: "Secured a Fortune 500 company's migration to a multi-cloud environment, ensuring data protection and compliance throughout the transition.",
          link: "/case-studies/enterprise-cloud-migration"
        },
        {
          title: "SaaS Provider Security Enhancement",
          description: "Implemented comprehensive cloud security measures for a SaaS provider, protecting customer data and ensuring business continuity.",
          link: "/case-studies/saas-security"
        }
      ]}
    />
  );
};

export default CloudSecurityPage;