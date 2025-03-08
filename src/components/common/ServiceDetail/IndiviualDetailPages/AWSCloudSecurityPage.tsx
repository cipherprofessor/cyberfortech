"use client";

import React from 'react';
import { ServerCrash } from 'lucide-react';
import ServiceDetail from '../ServiceDetail';

const AWSCloudSecurityPage = () => {
  return (
    <ServiceDetail
      title="AWS Cloud Security"
      description="Cyberfort Technologies offers specialized AWS cloud security services to ensure the protection of cloud environments. Our comprehensive approach helps businesses leverage AWS's capabilities while maintaining a strong security posture and meeting compliance requirements."
      icon={ServerCrash}
      color="#007bff"
      features={[
        "Cloud Security Assessments identifying vulnerabilities and risks specific to AWS infrastructures",
        "Data Protection implementing encryption, secure storage, and access controls for sensitive data",
        "Identity and Access Management (IAM) configuring robust authentication and authorization mechanisms",
        "Threat Monitoring utilizing tools like AWS Security Hub and GuardDuty for real-time threat detection",
        "Compliance Management ensuring adherence to standards like GDPR, HIPAA, and PCI DSS within AWS environments",
        "Secure Architecture Design building scalable and resilient AWS cloud infrastructures with security as a priority"
      ]}
      benefits={[
        {
          title: "AWS-Specific Expertise",
          description: "Work with specialists who understand AWS security best practices"
        },
        {
          title: "Optimized Security Controls",
          description: "Implement the right controls for your AWS environment"
        },
        {
          title: "Cost-Effective Security",
          description: "Maximize security while optimizing AWS spending"
        },
        {
          title: "Compliance Confidence",
          description: "Meet regulatory requirements in your AWS environment"
        }
      ]}
      caseStudies={[
        {
          title: "Enterprise AWS Migration",
          description: "Secured a large-scale migration to AWS for a financial services company, implementing comprehensive security controls and compliance measures.",
          link: "/case-studies/aws-financial-migration"
        },
        {
          title: "Healthcare AWS Environment",
          description: "Implemented HIPAA-compliant security for a healthcare provider's AWS infrastructure, protecting patient data while enabling innovation.",
          link: "/case-studies/aws-healthcare-security"
        },
        {
          title: "E-commerce Platform Protection",
          description: "Secured a high-traffic e-commerce platform on AWS, implementing robust security measures and PCI DSS compliance controls.",
          link: "/case-studies/aws-ecommerce-security"
        }
      ]}
    />
  );
};

export default AWSCloudSecurityPage;