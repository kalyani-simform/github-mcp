export type Priority = 'low' | 'medium' | 'high';

export type TodoStatus = 'pending' | 'completed';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  category?: string;
}

export interface TodoFilter {
  search?: string;
  status?: TodoStatus;
  priority?: Priority;
  category?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'title' | 'priority' | 'dueDate';
  sortOrder?: 'asc' | 'desc';
}

export interface TodoFormData {
  title: string;
  description?: string;
  priority: Priority;
  dueDate?: Date;
  category?: string;
}
