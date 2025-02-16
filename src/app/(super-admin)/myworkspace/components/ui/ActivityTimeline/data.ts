// mockData.ts
import { Activity } from './types';

export const mockActivities: Activity[] = [
  {
    id: '1',
    timestamp: '12 Hrs',
    type: 'product_update',
    user: {
      name: 'John Doe'
    },
    details: {
      action: 'Updated the product description for',
      target: 'Widget X',
    },
    color: '#5B5FFF'
  },
  {
    id: '2',
    timestamp: '4:32pm',
    type: 'user_added',
    user: {
      name: 'Jane Smith'
    },
    details: {
      action: 'added a',
      target: 'new user',
      additionalInfo: 'janesmith89'
    },
    color: '#FF5BCD'
  },
  {
    id: '3',
    timestamp: '11:45am',
    type: 'order_status',
    user: {
      name: 'Michael Brown'
    },
    details: {
      action: 'Changed the status of order',
      target: '#12345',
      additionalInfo: 'Shipped'
    },
    color: '#FF5BCD'
  },
  {
    id: '4',
    timestamp: '9:27am',
    type: 'group_add',
    user: {
      name: 'David Wilson'
    },
    details: {
      action: 'added',
      target: 'John Smith',
      additionalInfo: 'to academy group this day'
    },
    color: '#FF8F5B'
  },
  {
    id: '5',
    timestamp: '8:56pm',
    type: 'comment_added',
    user: {
      name: 'Robert Jackson'
    },
    details: {
      action: 'added a comment to the task',
      target: 'Update website layout',
    },
    color: '#5B5FFF'
  }
];