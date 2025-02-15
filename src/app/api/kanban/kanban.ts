// api/kanban.ts
import { Task } from '@/app/(super-admin)/myworkspace/components/ui/KanbanBoard/types';
import axios from 'axios';


const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const kanbanApi = {
  getTasks: () => api.get('/tasks'),
  createTask: (task: Partial<Task>) => api.post('/tasks', task),
  updateTask: (id: string, task: Partial<Task>) => api.put(`/tasks/${id}`, task),
  deleteTask: (id: string) => api.delete(`/tasks/${id}`),
  createBoard: (board: { name: string, description: string }) => api.post('/boards', board),
};