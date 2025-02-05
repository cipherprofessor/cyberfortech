// src/components/Forum/AttachmentViewer/AttachmentViewer.tsx
'use client';

import { useState } from 'react';
import { File, Image, X, Download, Eye, FileText } from 'lucide-react';
import styles from './AttachmentViewer.module.scss';

interface Attachment {
  id: number;
  fileName: string;
  originalName: string;
  fileType: string;
  fileSize: number;
  url: string;
}

interface AttachmentViewerProps {
  attachments: Attachment[];
  onRemove?: (id: number) => void;
  isEditing?: boolean;
}

export function AttachmentViewer({ 
  attachments, 
  onRemove, 
  isEditing = false 
}: AttachmentViewerProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image size={24} />;
    if (fileType.includes('pdf')) return <FileText size={24} />;
    return <File size={24} />;
  };

  const openPreview = (attachment: Attachment) => {
    if (attachment.fileType.startsWith('image/')) {
      setPreviewUrl(attachment.url);
    }
  };

  return (
    <div className={styles.attachmentsContainer}>
      <div className={styles.attachmentsList}>
        {attachments.map((attachment) => (
          <div key={attachment.id} className={styles.attachmentItem}>
            <div className={styles.attachmentInfo}>
              {getFileIcon(attachment.fileType)}
              <div className={styles.fileDetails}>
                <span className={styles.fileName}>{attachment.originalName}</span>
                <span className={styles.fileSize}>
                  {formatFileSize(attachment.fileSize)}
                </span>
              </div>
            </div>
            
            <div className={styles.attachmentActions}>
              {attachment.fileType.startsWith('image/') && (
                <button
                  type="button"
                  onClick={() => openPreview(attachment)}
                  className={styles.actionButton}
                >
                  <Eye size={16} />
                </button>
              )}
              
              <a 
                href={attachment.url} 
                download={attachment.originalName}
                className={styles.actionButton}
              >
                <Download size={16} />
              </a>

              {isEditing && onRemove && (
                <button
                  type="button"
                  onClick={() => onRemove(attachment.id)}
                  className={`${styles.actionButton} ${styles.removeButton}`}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Image Preview Modal */}
      {previewUrl && (
        <div className={styles.previewModal} onClick={() => setPreviewUrl(null)}>
          <button className={styles.closePreview}>
            <X size={24} />
          </button>
          <img src={previewUrl} alt="Preview" />
        </div>
      )}
    </div>
  );
}