

  


  
  export interface KanbanBoardProps extends ThemeProps {
    columns: Column[];
    onTaskMove?: (taskId: string, sourceColumn: string, targetColumn: string) => void;
    onTaskUpdate?: (task: Task) => void;
    onAddTask?: (columnId: string) => void;
    className?: string;
    theme?: 'light' | 'dark';
  }

  export interface Task {
    id: string;
    taskNumber: string;
    title: string;
    description: string;
    priority: 'Low' | 'Medium' | 'High';
    status: 'NEW' | 'TODO' | 'ON GOING' | 'IN REVIEW' | 'COMPLETED';
    tags: {
      id: string;
      name: string;
      color: string;
    }[];
    assignees: {
      id: string;
      name: string;
      avatar: string;
    }[];
    likes: number;
    comments: number;
    createdAt: string;
    updatedAt: string;
  }
  
export type TaskPriority = 'Low' | 'Medium' | 'High';
export type TaskStatus = 'NEW' | 'TODO' | 'ON GOING' | 'IN REVIEW' | 'COMPLETED';

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface Task {
  id: string;
  taskNumber: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  tags: Tag[];
  assignees: User[];
  likes: number;
  comments: number;
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: string;
  title: string;
  count: number;
  color: string;
  tasks: Task[];
}

export interface KanbanData {
  columns: Column[];
}

export interface ThemeProps {
    theme?: 'light' | 'dark';
  }
  