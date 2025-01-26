'use client' 
// src/components/ui/Mine/StudentDashboard/Certificates.tsx
import React from 'react';

import { motion } from 'framer-motion';
import axios from 'axios';
import { BackgroundGradient } from '../../AcUI/background-gradient';

interface Certificate {
  id: string;
  courseName: string;
  issueDate: string;
  certificateUrl: string;
}

export const Certificates = () => {
  const [certificates, setCertificates] = React.useState<Certificate[]>([]);

  React.useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await axios.get('/api/student/certificates');
        setCertificates(response.data);
      } catch (error) {
        console.error('Error fetching certificates:', error);
      }
    };

    fetchCertificates();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
      {certificates.map((certificate) => (
        <BackgroundGradient key={certificate.id} className="rounded-[22px] p-4 sm:p-10 bg-white dark:bg-zinc-900">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative overflow-hidden rounded-lg"
          >
            <div className="p-4">
              <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">
                {certificate.courseName}
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Issued on: {new Date(certificate.issueDate).toLocaleDateString()}
              </p>
              <button
                onClick={() => window.open(certificate.certificateUrl)}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Download Certificate
              </button>
            </div>
          </motion.div>
        </BackgroundGradient>
      ))}
    </div>
  );
};