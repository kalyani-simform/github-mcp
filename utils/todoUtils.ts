import { Todo, TodoFilter } from '@/types';

// Generate unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Sort todos based on filter criteria
export const sortTodos = (
  todos: Todo[],
  sortBy: string,
  sortOrder: 'asc' | 'desc',
): Todo[] => {
  return [...todos].sort((a, b) => {
    let compareValue = 0;

    switch (sortBy) {
      case 'title':
        compareValue = a.title.localeCompare(b.title);
        break;
      case 'createdAt':
        compareValue = a.createdAt.getTime() - b.createdAt.getTime();
        break;
      case 'updatedAt':
        compareValue = a.updatedAt.getTime() - b.updatedAt.getTime();
        break;
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        compareValue = priorityOrder[a.priority] - priorityOrder[b.priority];
        break;
      case 'dueDate':
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        compareValue = a.dueDate.getTime() - b.dueDate.getTime();
        break;
      default:
        compareValue = 0;
    }

    return sortOrder === 'desc' ? -compareValue : compareValue;
  });
};

// Filter todos based on filter criteria
export const filterTodos = (todos: Todo[], filter: TodoFilter): Todo[] => {
  let filteredTodos = [...todos];

  // Search filter
  if (filter.search) {
    const searchLower = filter.search.toLowerCase();
    filteredTodos = filteredTodos.filter(
      (todo) =>
        todo.title.toLowerCase().includes(searchLower) ||
        todo.description?.toLowerCase().includes(searchLower),
    );
  }

  // Status filter
  if (filter.status) {
    const isCompleted = filter.status === 'completed';
    filteredTodos = filteredTodos.filter(
      (todo) => todo.completed === isCompleted,
    );
  }

  // Priority filter
  if (filter.priority) {
    filteredTodos = filteredTodos.filter(
      (todo) => todo.priority === filter.priority,
    );
  }

  // Category filter
  if (filter.category) {
    filteredTodos = filteredTodos.filter(
      (todo) => todo.category === filter.category,
    );
  }

  // Sort
  if (filter.sortBy) {
    filteredTodos = sortTodos(
      filteredTodos,
      filter.sortBy,
      filter.sortOrder || 'desc',
    );
  }

  return filteredTodos;
};

// Format date for display
export const formatDate = (date: Date): string => {
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString();
  }
};

// Get priority color
export const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'high':
      return '#FF6B6B';
    case 'medium':
      return '#FFB347';
    case 'low':
      return '#4ECDC4';
    default:
      return '#6C7B7F';
  }
};
