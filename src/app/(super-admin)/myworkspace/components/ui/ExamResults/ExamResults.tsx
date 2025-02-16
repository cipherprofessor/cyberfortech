import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import styles from './ExamResults.module.scss';
import { Search } from 'lucide-react';

export interface ExamResult {
  id: string;
  student: {
    name: string;
    avatar: string;
    subject: string;
  };
  subject: {
    name: string;
    icon?: React.ReactNode | string;
  };
  score: number;
}

interface ExamResultsProps {
  data: ExamResult[];
  title?: string;
  className?: string;
  onViewAll?: () => void;
}

const ExamResults: React.FC<ExamResultsProps> = ({
    data,
    title = "Exam Results",
    className = "",
    onViewAll
  }) => {
    const [searchTerm, setSearchTerm] = useState('');
  
    const filteredData = useMemo(() => {
      if (!searchTerm) return data;
      
      const searchLower = searchTerm.toLowerCase();
      return data.filter(result => {
        // Search through all relevant fields
        return (
          result.id.toLowerCase().includes(searchLower) ||
          result.student.name.toLowerCase().includes(searchLower) ||
          result.student.subject.toLowerCase().includes(searchLower) ||
          result.subject.name.toLowerCase().includes(searchLower) ||
          result.score.toString().includes(searchLower)
        );
      });
    }, [data, searchTerm]);
  
    const getScoreColor = (score: number) => {
      if (score >= 90) return styles.excellent;
      if (score >= 80) return styles.good;
      if (score >= 70) return styles.average;
      return styles.poor;
    };

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        
        <div className={styles.headerControls}>
          <div className={styles.searchWrapper}>
            <Search size={14} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <button onClick={onViewAll} className={styles.viewAll}>
            View All →
          </button>
        </div>
      </div>


      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Student</th>
            <th>Subject</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
        {filteredData.map((result, index) => (
            <motion.tr
              key={result.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={styles.row}
            >
              <td className={styles.idCell}>#{result.id}</td>
              <td>
                <div className={styles.studentInfo}>
                  <div className={styles.avatar}>
                    <Image
                      src={result.student.avatar}
                      alt={result.student.name}
                      width={28}
                      height={28}
                      className={styles.avatarImg}
                    />
                  </div>
                  <div className={styles.studentDetails}>
                    <span className={styles.studentName}>{result.student.name}</span>
                    <span className={styles.studentSubject}>{result.student.subject}</span>
                  </div>
                </div>
              </td>
              <td>
                <div className={styles.subjectInfo}>
                  {result.subject.icon && (
                    <div className={styles.subjectIcon}>
                      {typeof result.subject.icon === 'string' ? (
                        <Image
                          src={result.subject.icon}
                          alt={result.subject.name}
                          width={16}
                          height={16}
                        />
                      ) : (
                        result.subject.icon
                      )}
                    </div>
                  )}
                  <span>{result.subject.name}</span>
                </div>
              </td>
              <td>
                <span className={`${styles.score} ${getScoreColor(result.score)}`}>
                  {result.score}%
                </span>
              </td>
            </motion.tr>
          ))}
          {filteredData.length === 0 && (
            <tr>
              <td colSpan={4} className={styles.noResults}>
                No results found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ExamResults;