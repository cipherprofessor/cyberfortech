
export interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
  mode: 'create' | 'edit';
  onSubmit: (task: Partial<Task>) => void;
  availableUsers: User[];
  columnId: string;
}



  
export interface KanbanBoardProps {
  columns: Column[];
  onTaskMove: (taskId: string, sourceColumn: string, targetColumn: string) => void;
  onTaskUpdate: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
  onAddTask: (columnId: string, task: Partial<Task>) => void;
}

export interface KanbanColumnProps {
  column: Column;
  onAddTask: (task: Partial<Task>) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onTaskUpdate: (task: Task) => void;
  isDraggingOver?: boolean;
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
  role?: string;
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
  

  export interface DraggingState {
    isDragging: boolean;
    draggingId?: string;
  }
  