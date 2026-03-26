import { Todo, TodoFilter, TodoFormData } from '@/types';
import { filterTodos, generateId, todoStorage } from '@/utils';
import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useReducer,
} from 'react';

interface TodoState {
  todos: Todo[];
  filteredTodos: Todo[];
  filter: TodoFilter;
  loading: boolean;
  error: string | null;
}

type TodoAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOAD_TODOS_SUCCESS'; payload: Todo[] }
  | { type: 'ADD_TODO'; payload: Todo }
  | { type: 'UPDATE_TODO'; payload: Todo }
  | { type: 'DELETE_TODO'; payload: string }
  | { type: 'TOGGLE_TODO'; payload: string }
  | { type: 'SET_FILTER'; payload: TodoFilter }
  | { type: 'CLEAR_FILTER' };

const initialState: TodoState = {
  todos: [],
  filteredTodos: [],
  filter: {
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
  loading: false,
  error: null,
};

function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };

    case 'LOAD_TODOS_SUCCESS':
      const filteredOnLoad = filterTodos(action.payload, state.filter);
      return {
        ...state,
        todos: action.payload,
        filteredTodos: filteredOnLoad,
        loading: false,
        error: null,
      };

    case 'ADD_TODO':
      const todosAfterAdd = [...state.todos, action.payload];
      const filteredAfterAdd = filterTodos(todosAfterAdd, state.filter);
      return {
        ...state,
        todos: todosAfterAdd,
        filteredTodos: filteredAfterAdd,
      };

    case 'UPDATE_TODO':
      const todosAfterUpdate = state.todos.map((todo) =>
        todo.id === action.payload.id ? action.payload : todo,
      );
      const filteredAfterUpdate = filterTodos(todosAfterUpdate, state.filter);
      return {
        ...state,
        todos: todosAfterUpdate,
        filteredTodos: filteredAfterUpdate,
      };

    case 'DELETE_TODO':
      const todosAfterDelete = state.todos.filter(
        (todo) => todo.id !== action.payload,
      );
      const filteredAfterDelete = filterTodos(todosAfterDelete, state.filter);
      return {
        ...state,
        todos: todosAfterDelete,
        filteredTodos: filteredAfterDelete,
      };

    case 'TOGGLE_TODO':
      const todosAfterToggle = state.todos.map((todo) =>
        todo.id === action.payload
          ? { ...todo, completed: !todo.completed, updatedAt: new Date() }
          : todo,
      );
      const filteredAfterToggle = filterTodos(todosAfterToggle, state.filter);
      return {
        ...state,
        todos: todosAfterToggle,
        filteredTodos: filteredAfterToggle,
      };

    case 'SET_FILTER':
      const newFilter = { ...state.filter, ...action.payload };
      const newFilteredTodos = filterTodos(state.todos, newFilter);
      return {
        ...state,
        filter: newFilter,
        filteredTodos: newFilteredTodos,
      };

    case 'CLEAR_FILTER':
      const clearedFilter = {
        sortBy: 'createdAt',
        sortOrder: 'desc',
      } as TodoFilter;
      const clearedFilteredTodos = filterTodos(state.todos, clearedFilter);
      return {
        ...state,
        filter: clearedFilter,
        filteredTodos: clearedFilteredTodos,
      };

    default:
      return state;
  }
}

interface TodoContextType {
  state: TodoState;
  loadTodos: () => Promise<void>;
  addTodo: (todoData: TodoFormData) => Promise<void>;
  updateTodo: (id: string, todoData: Partial<TodoFormData>) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  setFilter: (filter: Partial<TodoFilter>) => void;
  clearFilter: () => void;
  getTodoById: (id: string) => Todo | undefined;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export function TodoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  // Load todos from storage
  const loadTodos = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const todos = await todoStorage.getTodos();
      dispatch({ type: 'LOAD_TODOS_SUCCESS', payload: todos });
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load todos' });
    }
  };

  // Add new todo
  const addTodo = async (todoData: TodoFormData) => {
    try {
      const newTodo: Todo = {
        id: generateId(),
        ...todoData,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      dispatch({ type: 'ADD_TODO', payload: newTodo });

      const updatedTodos = [...state.todos, newTodo];
      await todoStorage.saveTodos(updatedTodos);
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add todo' });
    }
  };

  // Update existing todo
  const updateTodo = async (id: string, todoData: Partial<TodoFormData>) => {
    try {
      const existingTodo = state.todos.find((todo) => todo.id === id);
      if (!existingTodo) {
        throw new Error('Todo not found');
      }

      const updatedTodo: Todo = {
        ...existingTodo,
        ...todoData,
        updatedAt: new Date(),
      };

      dispatch({ type: 'UPDATE_TODO', payload: updatedTodo });

      const updatedTodos = state.todos.map((todo) =>
        todo.id === id ? updatedTodo : todo,
      );
      await todoStorage.saveTodos(updatedTodos);
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update todo' });
    }
  };

  // Delete todo
  const deleteTodo = async (id: string) => {
    try {
      dispatch({ type: 'DELETE_TODO', payload: id });

      const updatedTodos = state.todos.filter((todo) => todo.id !== id);
      await todoStorage.saveTodos(updatedTodos);
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete todo' });
    }
  };

  // Toggle todo completion
  const toggleTodo = async (id: string) => {
    try {
      dispatch({ type: 'TOGGLE_TODO', payload: id });

      const updatedTodos = state.todos.map((todo) =>
        todo.id === id
          ? { ...todo, completed: !todo.completed, updatedAt: new Date() }
          : todo,
      );
      await todoStorage.saveTodos(updatedTodos);
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to toggle todo' });
    }
  };

  // Set filter
  const setFilter = (filter: Partial<TodoFilter>) => {
    dispatch({ type: 'SET_FILTER', payload: filter });
  };

  // Clear filter
  const clearFilter = () => {
    dispatch({ type: 'CLEAR_FILTER' });
  };

  // Get todo by ID
  const getTodoById = (id: string): Todo | undefined => {
    return state.todos.find((todo) => todo.id === id);
  };

  // Load todos on mount
  useEffect(() => {
    loadTodos();
  }, []);

  const value: TodoContextType = {
    state,
    loadTodos,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    setFilter,
    clearFilter,
    getTodoById,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}

export function useTodo() {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
}
