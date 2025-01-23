"use client"
import { FileText, Download, File } from 'lucide-react';
import styles from './CourseResources.module.scss';

type Resource = {
  id: number;
  title: string;
  type: string;
  size: string;
  url: string;
};

type CourseResourcesProps = {
  resources: Resource[];
};

export function CourseResources({ resources }: CourseResourcesProps) {
  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return <FileText className={`${styles.icon} ${styles.pdf}`} />;
      case 'doc':
      case 'docx':
        return <FileText className={`${styles.icon} ${styles.doc}`} />;
      default:
        return <File className={`${styles.icon} ${styles.default}`} />;
    }
  };

  const handleDownload = (resource: Resource) => {
    // In a real app, you might want to handle downloads differently
    window.open(resource.url, '_blank');
  };

  return (
    <div className={styles.resourcesContainer}>
      <div className={styles.header}>
        <h2>Course Resources</h2>
        <p>Download supplementary materials for your learning</p>
      </div>

      <div className={styles.resources}>
        {resources.map((resource) => (
          <div key={resource.id} className={styles.resourceCard}>
            <div className={styles.resourceInfo}>
              {getFileIcon(resource.type)}
              <div className={styles.details}>
                <h3>{resource.title}</h3>
                <div className={styles.meta}>
                  <span className={styles.type}>{resource.type.toUpperCase()}</span>
                  <span className={styles.size}>{resource.size}</span>
                </div>
              </div>
            </div>
            <button 
              className={styles.downloadButton}
              onClick={() => handleDownload(resource)}
            >
              <Download className={styles.downloadIcon} />
              Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}