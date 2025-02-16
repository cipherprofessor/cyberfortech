// types.ts
export type ActivityType = 
  | 'product_update'
  | 'user_added'
  | 'order_status'
  | 'group_add'
  | 'comment_added';

  export interface Activity {
    id: string;
    timestamp: string;
    type: 'product_update' | 'user_added' | 'order_status' | 'group_add' | 'comment_added';
    user: {
      name: string;
      avatar?: string;
    };
    details: {
      action: string;
      target: string;
      additionalInfo?: string;
    };
    color: string;
  }