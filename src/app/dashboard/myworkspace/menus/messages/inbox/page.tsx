"use client"
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import styles from './page.module.scss';
import DashboardHeader from './components/DashboardHeader/DashboardHeader';
import LoadingState from './components/LoadingState/LoadingState';
import MessagesFilters from './components/MessagesFilters/MessagesFilters';
import MessagesInsightCards from './components/MessagesInsightCards/MessagesInsightCards';
import MessagesTable from './components/MessagesTable/MessagesTable';
import ErrorStateInbox from './components/ErrorState/page';

export default function MessagesDashboard() {
  const [messagesData, setMessagesData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<string>('all');
  const [messagesStats, setMessagesStats] = useState({
    total: 0,
    new: 0,
    inProgress: 0,
    resolved: 0,
    responseTime: 0,
    partnersSource: 0,
    contactSource: 0,
    other: 0
  });

  // Fetch messages data
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/contact?page=${currentPage}&limit=10${statusFilter !== 'all' ? `&status=${statusFilter}` : ''}${searchTerm ? `&search=${searchTerm}` : ''}${sourceFilter !== 'all' ? `&sourcePage=${sourceFilter}` : ''}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }
        
        const data = await response.json();
        setMessagesData(data.contacts);
        setFilteredData(data.contacts);
        setTotalPages(data.pagination.totalPages);
        
        // Calculate stats
        calculateStats(data.contacts);
        
        setLoading(false);
      } catch (err) {
        setError((err as Error).message);
        setLoading(false);
      }
    };

    fetchMessages();
  }, [currentPage, statusFilter, searchTerm, sourceFilter]);

  // Calculate message stats for KPI cards
  const calculateStats = (messages: any[]) => {
    // Get all messages for proper counting
    fetch('/api/contact?limit=1000')
      .then(res => res.json())
      .then(data => {
        const allMessages = data.contacts;
        
        // Status counts
        const newCount = allMessages.filter(msg => msg.status === 'new' || msg.status === null).length;
        const inProgressCount = allMessages.filter(msg => msg.status === 'in_progress').length;
        const resolvedCount = allMessages.filter(msg => msg.status === 'resolved').length;
        
        // Source counts
        const partnersCount = allMessages.filter(msg => {
          const metadata = msg.metadata || {};
          return metadata.sourcePage === 'partners' || 
                 (typeof metadata === 'string' && metadata.includes('partners'));
        }).length;
        
        const contactCount = allMessages.filter(msg => {
          const metadata = msg.metadata || {};
          return metadata.sourcePage === 'contact' || 
                 (typeof metadata === 'string' && metadata.includes('contact'));
        }).length;
        
        const otherCount = allMessages.length - partnersCount - contactCount;
        
        // Response time calculation (average hours to response for responded messages)
        const respondedMessages = allMessages.filter(msg => msg.responded_at);
        let avgResponseTime = 0;
        
        if (respondedMessages.length > 0) {
          const totalResponseTime = respondedMessages.reduce((acc, msg) => {
            const createdDate = new Date(msg.created_at);
            const respondedDate = new Date(msg.responded_at);
            const diffHours = (respondedDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60);
            return acc + diffHours;
          }, 0);
          
          avgResponseTime = Math.round(totalResponseTime / respondedMessages.length);
        }
        
        setMessagesStats({
          total: allMessages.length,
          new: newCount,
          inProgress: inProgressCount,
          resolved: resolvedCount,
          responseTime: avgResponseTime,
          partnersSource: partnersCount,
          contactSource: contactCount,
          other: otherCount
        });
      })
      .catch(err => console.error('Error fetching stats:', err));
  };

  // Handle search
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle status filter
  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Handle source filter
  const handleSourceFilter = (source: string) => {
    setSourceFilter(source);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Handle time filter
  const handleTimeFilter = (time: string) => {
    setTimeFilter(time);
    // Implement time-based filtering logic here
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle message status change
  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: newStatus,
          action: 'status_change',
          action_by: 'dashboard_user' // In a real app, this would be the current user's ID
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update message status');
      }
      
      // Update local data
      setMessagesData(prevData => 
        prevData.map(msg => 
          msg.id === id ? { ...msg, status: newStatus } : msg
        )
      );
      
      // Recalculate stats
      calculateStats(messagesData);
      
    } catch (err) {
      console.error('Error updating message status:', err);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div 
      className={styles.dashboardContainer}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <DashboardHeader 
        totalMessages={messagesStats.total} 
        newMessages={messagesStats.new}
      />
      
      <MessagesInsightCards stats={messagesStats} />
      
      <MessagesFilters 
        onSearch={handleSearch}
        onStatusFilter={handleStatusFilter}
        onSourceFilter={handleSourceFilter}
        onTimeFilter={handleTimeFilter}
        currentStatusFilter={statusFilter}
        currentSourceFilter={sourceFilter}
        currentTimeFilter={timeFilter}
      />
      
      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorStateInbox  />
      ) : (
        <MessagesTable 
          messages={filteredData}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onStatusChange={handleStatusChange}
        />
      )}
    </motion.div>
  );
}