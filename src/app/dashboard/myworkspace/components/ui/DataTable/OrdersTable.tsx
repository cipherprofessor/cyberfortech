"use client";
import React, { useState } from 'react';
import DataTable, { Column } from './DataTable';
import { useTheme } from 'next-themes';

import styles from './OrdersTable.module.scss';
import { formatCurrency, formatDate } from '@/utils/formattingData';
import Avatar from './Avatar';

interface Customer {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

interface Order {
  id: string;
  customer: Customer;
  product: string;
  quantity: number;
  amount: number;
  status: 'inProgress' | 'pending' | 'success';
  dateOrdered: string;
}



  const columns: Column<Order>[] = [
    {
      key: 'customer',
      label: 'Customer',
      sortable: true,
      visible: true,
      render: (customer: Customer) => (
        <div className={styles.customerCell}>
          <Avatar
            src={customer.avatar}
            name={customer.name}
            size="md"
            className={styles.avatar}
          />
          <div className={styles.customerInfo}>
            <span className={styles.customerName}>{customer.name}</span>
            <span className={styles.customerEmail}>{customer.email}</span>
          </div>
        </div>
      )
    },
    {
      key: 'product',
      label: 'Product',
      sortable: true,
      visible: true,
      width: '200px'
    },
    {
      key: 'quantity',
      label: 'Quantity',
      sortable: true,
      visible: true,
      width: '100px',
      render: (quantity: number) => (
        <span className={styles.quantityCell}>{quantity}</span>
      )
    },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      visible: true,
      width: '120px',
      render: (amount: number) => (
        <span className={styles.amountCell}>
          {formatCurrency(amount)}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      visible: true,
      width: '130px',
      render: (status: Order['status']) => {
        const statusText = {
          inProgress: 'In Progress',
          pending: 'Pending',
          success: 'Success'
        };
    
  
        return (
          <span className={`${styles.status} ${styles[status]}`}>
            {statusText[status]}
          </span>
        );
      }
    },
    {
      key: 'dateOrdered',
      label: 'Date Ordered',
      sortable: true,
      visible: true,
      width: '150px',
      render: (date: string) => formatDate(date)
    },
    {
      key: 'actions',
      label: 'Actions',
      visible: true,
      width: '100px'
    }
  ];
  

  const mockOrders: Order[] = [
    {
      id: '1',
      customer: {
        id: '101',
        name: 'Elena Smith',
        email: 'elenasmith387@gmail.com',
        avatar: '/team/mohsin.jpg'
      },
      product: 'All-Purpose Cleaner',
      quantity: 3,
      amount: 9.99,
      status: 'inProgress',
      dateOrdered: '2024-09-03'
    },
    {
      id: '2',
      customer: {
        id: '102',
        name: 'Nelson Gold',
        email: 'noahrussell556@gmail.com',
        avatar: '/avatars/nelson.jpg'
      },
      product: 'Kitchen Knife Set',
      quantity: 4,
      amount: 49.99,
      status: 'pending',
      dateOrdered: '2024-07-26'
    },
    {
      id: '3',
      customer: {
        id: '103',
        name: 'Grace Mitchell',
        email: 'gracemitchell79@gmail.com',
        avatar: '/avatars/grace.jpg'
      },
      product: 'Velvet Throw Blanket',
      quantity: 2,
      amount: 29.99,
      status: 'success',
      dateOrdered: '2024-05-12'
    },
    {
      id: '4',
      customer: {
        id: '104',
        name: 'Spencer Robin',
        email: 'leophillips124@gmail.com',
        avatar: '/avatars/spencer.jpg'
      },
      product: 'Aromatherapy Diffuser',
      quantity: 4,
      amount: 19.99,
      status: 'success',
      dateOrdered: '2024-08-15'
    },
    {
      id: '5',
      customer: {
        id: '105',
        name: 'Chloe Lewis',
        email: 'chloelewis67@gmail.com',
        avatar: '/avatars/chloe.jpg'
      },
      product: 'Insulated Water Bottle',
      quantity: 2,
      amount: 14.99,
      status: 'pending',
      dateOrdered: '2024-10-11'
    },
    {
        id: '6',
        customer: {
          id: '101',
          name: 'Elena Smith',
          email: 'elenasmith387@gmail.com',
          avatar: '/team/mohsin.jpg'
        },
        product: 'All-Purpose Cleaner',
        quantity: 3,
        amount: 9.99,
        status: 'inProgress',
        dateOrdered: '2024-09-03'
      },
      {
        id: '7',
        customer: {
          id: '102',
          name: 'Nelson Gold',
          email: 'noahrussell556@gmail.com',
          avatar: '/avatars/nelson.jpg'
        },
        product: 'Kitchen Knife Set',
        quantity: 4,
        amount: 49.99,
        status: 'pending',
        dateOrdered: '2024-07-26'
      },
      {
        id: '8',
        customer: {
          id: '103',
          name: 'Grace Mitchell',
          email: 'gracemitchell79@gmail.com',
          avatar: '/avatars/grace.jpg'
        },
        product: 'Velvet Throw Blanket',
        quantity: 2,
        amount: 29.99,
        status: 'success',
        dateOrdered: '2024-05-12'
      },
      {
        id: '9',
        customer: {
          id: '104',
          name: 'Spencer Robin',
          email: 'leophillips124@gmail.com',
          avatar: '/avatars/spencer.jpg'
        },
        product: 'Aromatherapy Diffuser',
        quantity: 4,
        amount: 19.99,
        status: 'success',
        dateOrdered: '2024-08-15'
      },
      {
        id: '10',
        customer: {
          id: '105',
          name: 'Chloe Lewis',
          email: 'chloelewis67@gmail.com',
          avatar: '/avatars/chloe.jpg'
        },
        product: 'Insulated Water Bottle',
        quantity: 2,
        amount: 14.99,
        status: 'pending',
        dateOrdered: '2024-10-11'
      },
      {
        id: '11',
        customer: {
          id: '101',
          name: 'Elena Smith',
          email: 'elenasmith387@gmail.com',
          avatar: '/team/mohsin.jpg'
        },
        product: 'All-Purpose Cleaner',
        quantity: 3,
        amount: 9.99,
        status: 'inProgress',
        dateOrdered: '2024-09-03'
      },
      {
        id: '12',
        customer: {
          id: '102',
          name: 'Nelson Gold',
          email: 'noahrussell556@gmail.com',
          avatar: '/avatars/nelson.jpg'
        },
        product: 'Kitchen Knife Set',
        quantity: 4,
        amount: 49.99,
        status: 'pending',
        dateOrdered: '2024-07-26'
      },
      {
        id: '13',
        customer: {
          id: '103',
          name: 'Grace Mitchell',
          email: 'gracemitchell79@gmail.com',
          avatar: '/avatars/grace.jpg'
        },
        product: 'Velvet Throw Blanket',
        quantity: 2,
        amount: 29.99,
        status: 'success',
        dateOrdered: '2024-05-12'
      },
      {
        id: '14',
        customer: {
          id: '104',
          name: 'Spencer Robin',
          email: 'leophillips124@gmail.com',
          avatar: '/avatars/spencer.jpg'
        },
        product: 'Aromatherapy Diffuser',
        quantity: 4,
        amount: 19.99,
        status: 'success',
        dateOrdered: '2024-08-15'
      },
      {
        id: '15',
        customer: {
          id: '105',
          name: 'Chloe Lewis',
          email: 'chloelewis67@gmail.com',
          avatar: '/avatars/chloe.jpg'
        },
        product: 'Insulated Water Bottle',
        quantity: 2,
        amount: 14.99,
        status: 'pending',
        dateOrdered: '2024-10-11'
      }
  ];



  const OrdersTable = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedOrders, setSelectedOrders] = useState<Order[]>([]);
  
    const handleEdit = async (order: Order) => {
      try {
        setIsLoading(true);
        // API call logic here
        console.log('Editing order:', order);
      } catch (error) {
        console.error('Error editing order:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    const handleDelete = async (orders: Order[]) => {
      try {
        setIsLoading(true);
        // API call logic here
        console.log('Deleting orders:', orders);
      } catch (error) {
        console.error('Error deleting orders:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    const handleSelectionChange = (orders: Order[]) => {
      setSelectedOrders(orders);
    };
  

    return (
        <div className={styles.pageContainer}>
          <DataTable
            data={mockOrders}
            columns={columns}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSelectionChange={handleSelectionChange}
            showSearch={true}
            searchPlaceholder="Search orders..."
            className={styles.ordersTable}
          />
        </div>
      );
    };

    export default OrdersTable;
