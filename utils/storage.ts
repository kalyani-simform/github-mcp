import { Todo } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TODOS_STORAGE_KEY = 'todos';

export const todoStorage = {
  // Get all todos from storage
  async getTodos(): Promise<Todo[]> {
    try {
      const todosJson = await AsyncStorage.getItem(TODOS_STORAGE_KEY);
      if (!todosJson) return [];

      const todos = JSON.parse(todosJson);
      // Convert date strings back to Date objects
      return todos.map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
        updatedAt: new Date(todo.updatedAt),
        dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
      }));
    } catch (error) {
      console.error('Error loading todos:', error);
      return [];
    }
  },

  // Save todos to storage
  async saveTodos(todos: Todo[]): Promise<void> {
    try {
      const todosJson = JSON.stringify(todos);
      await AsyncStorage.setItem(TODOS_STORAGE_KEY, todosJson);
    } catch (error) {
      console.error('Error saving todos:', error);
      throw error;
    }
  },

  // Clear all todos from storage
  async clearTodos(): Promise<void> {
    try {
      await AsyncStorage.removeItem(TODOS_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing todos:', error);
      throw error;
    }
  },
};
