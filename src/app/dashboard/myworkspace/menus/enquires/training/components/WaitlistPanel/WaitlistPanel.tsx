"use client"
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertCircle, 
  Loader2,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Bell,
  User,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import styles from './WaitlistPanel.module.scss';

interface WaitlistPanelProps {
  filters: any;
}

// Mock data that would come from the API
const MOCK_WAITLIST = [
  {
    id: 'wait1',
    courseId: 'course1',
    userId: 'user1',
    courseTitle: 'Advanced Penetration Testing',
    joinedAt: '2023-05-15T10:30:00Z',
    status: 'waiting',
    notificationSent: false,
    notificationDate: null,
    user: {
      fullName: 'Alex Johnson',
      email: 'alex@example.com',
      phone: '+91 98765 43210',
      avatarUrl: null
    }
  },
  {
    id: 'wait2',
    courseId: 'course2',
    userId: 'user2',
    courseTitle: 'Cloud Security Architecture',
    joinedAt: '2023-05-16T14:15:00Z',
    status: 'invited',
    notificationSent: true,
    notificationDate: '2023-05-20T09:45:00Z',
    user: {
      fullName: 'Sarah Williams',
      email: 'sarah@example.com',
      phone: '+91 87654 32109',
      avatarUrl: null
    }
  },
  {
    id: 'wait3',
    courseId: 'course1',
    userId: 'user3',
    courseTitle: 'Advanced Penetration Testing',
    joinedAt: '2023-05-17T11:20:00Z',
    status: 'waiting',
    notificationSent: false,
    notificationDate: null,
    user: {
      fullName: 'Mike Davis',
      email: 'mike@example.com',
      phone: '+91 76543 21098',
      avatarUrl: null
    }
  }
];

export default function WaitlistPanel({ filters }: WaitlistPanelProps) {
  const [waitlist, setWaitlist] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  // Fetch waitlist entries
  useEffect(() => {
    const fetchWaitlist = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setWaitlist(MOCK_WAITLIST);
        setPagination({
          page: 1,
          limit: 10,
          total: MOCK_WAITLIST.length,
          totalPages: Math.ceil(MOCK_WAITLIST.length / 10)
        });
      } catch (err) {
        setError('Failed to fetch waitlist entries. Please try again.');
        console.error('Error fetching waitlist:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWaitlist();
  }, [filters]);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({
      ...prev,
      page: newPage
    }));
  };

  // Handle notification button click
  const handleSendNotification = (waitlistId: string) => {
    // In a real app, this would call an API endpoint
    setWaitlist(prev => 
      prev.map(item => 
        item.id === waitlistId 
          ? {
              ...item,
              notificationSent: true,
              notificationDate: new Date().toISOString(),
              status: 'invited'
            }
          : item
      )
    );
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format time
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  // Render status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'invited':
        return (
          <span className={`${styles.statusBadge} ${styles.invited}`}>
            <Bell size={14} />
            Invited
          </span>
        );
      case 'waiting':
        return (
          <span className={`${styles.statusBadge} ${styles.waiting}`}>
            <Clock size={14} />
            Waiting
          </span>
        );
      case 'enrolled':
        return (
          <span className={`${styles.statusBadge} ${styles.enrolled}`}>
            <CheckCircle size={14} />
            Enrolled
          </span>
        );
      case 'expired':
        return (
          <span className={`${styles.statusBadge} ${styles.expired}`}>
            <XCircle size={14} />
            Expired
          </span>
        );
      default:
        return (
          <span className={`${styles.statusBadge} ${styles.default}`}>
            {status}
          </span>
        );
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader2 size={36} className={styles.loadingSpinner} />
        <p>Loading waitlist...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <AlertCircle size={36} className={styles.errorIcon} />
        <p>{error}</p>
        <button 
          className={styles.retryButton}
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  // Empty state
  if (waitlist.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <Bell size={48} className={styles.emptyIcon} />
        <h3>No Waitlist Entries</h3>
        <p>There are currently no students on any waitlists.</p>
      </div>
    );
  }

  return (
    <div className={styles.waitlistContainer}>
      <div className={styles.waitlistHeader}>
        <div>
          <h2>Course Waitlists</h2>
          <p>Manage students waiting for spot availability</p>
        </div>
      </div>
      
      <motion.div 
        className={styles.waitlistGrid}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {waitlist.map((entry) => (
          <motion.div 
            key={entry.id} 
            className={styles.waitlistCard}
            variants={itemVariants}
          >
            <div className={styles.cardHeader}>
              <div className={styles.courseInfo}>
                <h3 className={styles.courseTitle}>{entry.courseTitle}</h3>
                {renderStatusBadge(entry.status)}
              </div>
              <div className={styles.joinDate}>
                <Calendar size={14} />
                <span>Joined {formatDate(entry.joinedAt)}</span>
              </div>
            </div>
            
            <div className={styles.cardContent}>
              <div className={styles.studentInfo}>
                <div className={styles.studentAvatar}>
                  {entry.user.avatarUrl ? (
                    <img src={entry.user.avatarUrl} alt={entry.user.fullName} />
                  ) : (
                    <div className={styles.defaultAvatar}>
                      {entry.user.fullName.charAt(0)}
                    </div>
                  )}
                </div>
                <div className={styles.studentDetails}>
                  <div className={styles.studentName}>{entry.user.fullName}</div>
                  <div className={styles.studentContact}>
                    <Mail size={12} />
                    <span>{entry.user.email}</span>
                  </div>
                  <div className={styles.studentContact}>
                    <Phone size={12} />
                    <span>{entry.user.phone}</span>
                  </div>
                </div>
              </div>
              
              {entry.notificationSent && entry.notificationDate && (
                <div className={styles.notificationInfo}>
                  <Bell size={14} />
                  <span>Notification sent on {formatDate(entry.notificationDate)} at {formatTime(entry.notificationDate)}</span>
                </div>
              )}
            </div>
            
            <div className={styles.cardActions}>
              {!entry.notificationSent && entry.status === 'waiting' && (
                <button 
                  className={styles.notifyButton}
                  onClick={() => handleSendNotification(entry.id)}
                >
                  <Bell size={14} />
                  Send Notification
                </button>
              )}
              
              <button className={styles.viewButton}>
                View Details
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>
      
      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className={styles.pagination}>
          <button 
            className={styles.paginationButton}
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            <ChevronLeft size={16} />
            Previous
          </button>
          
          <span className={styles.paginationInfo}>
            Page {pagination.page} of {pagination.totalPages}
          </span>
          
          <button 
            className={styles.paginationButton}
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}