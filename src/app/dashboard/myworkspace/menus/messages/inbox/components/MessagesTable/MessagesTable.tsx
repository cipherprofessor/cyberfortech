"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Mail, Calendar, ExternalLink, User, MessageSquare } from 'lucide-react';
import styles from './MessagesTable.module.scss';

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  status: string | null;
  created_at: string;
  metadata?: any;
}

interface MessagesTableProps {
  messages: Message[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onStatusChange: (id: string, status: string) => void;
}

export default function MessagesTable({
  messages,
  currentPage,
  totalPages,
  onPageChange,
  onStatusChange
}: MessagesTableProps) {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const getSourceLabel = (message: Message) => {
    if (message.metadata && typeof message.metadata === 'object') {
      if (message.metadata.sourcePage === 'partners' || message.metadata.partnerType) {
        return 'Partners Page';
      } else if (message.metadata.sourcePage === 'contact') {
        return 'Contact Page';
      }
    }
    return 'Unknown Source';
  };
  
  const getStatusColor = (status: string | null) => {
    switch(status) {
      case 'new':
        return styles.statusNew;
      case 'in_progress':
        return styles.statusInProgress;
      case 'resolved':
        return styles.statusResolved;
      case 'spam':
        return styles.statusSpam;
      default:
        return styles.statusNew; // Default to new if null
    }
  };
  
  const getPartnerType = (message: Message) => {
    if (message.metadata && typeof message.metadata === 'object' && message.metadata.partnerType) {
      return message.metadata.partnerType;
    }
    return 'Not specified';
  };
  
  const openMessageDetail = (message: Message) => {
    setSelectedMessage(message);
  };
  
  const closeMessageDetail = () => {
    setSelectedMessage(null);
  };
  
  // Animation variants
  const tableVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };
  
  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className={styles.tableContainer}>
      <motion.div
        className={styles.tableWrapper}
        variants={tableVariants}
        initial="hidden"
        animate="visible"
      >
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Status</th>
              <th>From</th>
              <th>Subject</th>
              <th>Source</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {messages.length > 0 ? (
              messages.map((message, index) => (
                <motion.tr 
                  key={message.id}
                  className={styles.messageRow}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.05 }}
                  onClick={() => openMessageDetail(message)}
                >
                  <td>
                    <div className={styles.statusBadgeContainer}>
                      <span className={`${styles.statusBadge} ${getStatusColor(message.status)}`}>
                        {message.status ? message.status.replace('_', ' ') : 'new'}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className={styles.senderInfo}>
                      <div className={styles.senderName}>
                        {message.name || 'Anonymous'}
                      </div>
                      <div className={styles.senderEmail}>
                        {message.email}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className={styles.subjectLine}>
                      {message.subject}
                    </div>
                  </td>
                  <td>
                    <div className={styles.sourceInfo}>
                      {getSourceLabel(message)}
                    </div>
                  </td>
                  <td>
                    <div className={styles.dateInfo}>
                      {formatDate(message.created_at)}
                    </div>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button 
                        className={styles.viewButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          openMessageDetail(message);
                        }}
                      >
                        View
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className={styles.noData}>
                  No messages found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </motion.div>
      
      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className={styles.paginationContainer}>
          <button 
            className={styles.paginationButton}
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} />
            Previous
          </button>
          
          <div className={styles.pageIndicator}>
            Page {currentPage} of {totalPages}
          </div>
          
          <button 
            className={styles.paginationButton}
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      )}
      
      {/* Message detail modal */}
      {selectedMessage && (
        <div className={styles.modalOverlay} onClick={closeMessageDetail}>
          <motion.div 
            className={styles.modalContent}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Message Details</h3>
              <button className={styles.closeButton} onClick={closeMessageDetail}>
                &times;
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.messageMetaRow}>
                <div className={styles.metaItem}>
                  <div className={styles.metaLabel}>
                    <User size={16} />
                    From
                  </div>
                  <div className={styles.metaValue}>
                    <div>{selectedMessage.name || 'Anonymous'}</div>
                    <div className={styles.emailValue}>{selectedMessage.email}</div>
                    {selectedMessage.phone && (
                      <div className={styles.phoneValue}>{selectedMessage.phone}</div>
                    )}
                  </div>
                </div>
                
                <div className={styles.metaItem}>
                  <div className={styles.metaLabel}>
                    <Calendar size={16} />
                    Date
                  </div>
                  <div className={styles.metaValue}>
                    {formatDate(selectedMessage.created_at)}
                  </div>
                </div>
                
                <div className={styles.metaItem}>
                  <div className={styles.metaLabel}>
                    <Mail size={16} />
                    Source
                  </div>
                  <div className={styles.metaValue}>
                    {getSourceLabel(selectedMessage)}
                    {getSourceLabel(selectedMessage) === 'Partners Page' && (
                      <div className={styles.partnerType}>
                        Partnership Type: {getPartnerType(selectedMessage)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className={styles.messageContent}>
                <div className={styles.subjectSection}>
                  <div className={styles.subjectLabel}>Subject:</div>
                  <div className={styles.subjectText}>{selectedMessage.subject}</div>
                </div>
                
                <div className={styles.messageTextSection}>
                  <div className={styles.messageLabel}>
                    <MessageSquare size={16} />
                    Message:
                  </div>
                  <div className={styles.messageText}>{selectedMessage.message}</div>
                </div>
              </div>
              
              <div className={styles.responseSection}>
                <div className={styles.statusOptions}>
                  <div className={styles.statusLabel}>Update Status:</div>
                  <div className={styles.statusButtons}>
                    <button 
                      className={`${styles.statusButton} ${selectedMessage.status === 'new' ? styles.active : ''}`}
                      onClick={() => onStatusChange(selectedMessage.id, 'new')}
                    >
                      New
                    </button>
                    <button 
                      className={`${styles.statusButton} ${selectedMessage.status === 'in_progress' ? styles.active : ''}`}
                      onClick={() => onStatusChange(selectedMessage.id, 'in_progress')}
                    >
                      In Progress
                    </button>
                    <button 
                      className={`${styles.statusButton} ${selectedMessage.status === 'resolved' ? styles.active : ''}`}
                      onClick={() => onStatusChange(selectedMessage.id, 'resolved')}
                    >
                      Resolved
                    </button>
                    <button 
                      className={`${styles.statusButton} ${selectedMessage.status === 'spam' ? styles.active : ''}`}
                      onClick={() => onStatusChange(selectedMessage.id, 'spam')}
                    >
                      Spam
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}