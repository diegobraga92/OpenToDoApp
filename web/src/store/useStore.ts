import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, List, Task } from '../types';
import { api } from '../lib/api';

type AppState = {
  // Auth state
  user: User | null;
  isAuthenticated: boolean;
  
  // Data state
  lists: List[];
  tasks: Record<string, Task[]>; // listId -> tasks
  
  // UI state
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  fetchLists: () => Promise<void>;
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  completeTask: (id: string) => Promise<void>;
  reopenTask: (id: string) => Promise<void>;
  clearError: () => void;
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      lists: [],
      tasks: {},
      isLoading: false,
      error: null,

      // Actions
      login: async (email: string, password: string) => {
        console.log('STORE: login called with', email);
        set({ isLoading: true, error: null });
        try {
          const response = await api.login(email, password);
          console.log('STORE: login successful', response.data.user);
          set({
            user: response.data.user,
            isAuthenticated: true,
            isLoading: false
          });
          await get().fetchLists();
        } catch (error: unknown) {
          console.error('STORE: login error', error);
          set({ 
            error: error instanceof Error ? error.message : 'Login failed', 
            isLoading: false 
          });
        }
      },

      fetchLists: async () => {
        console.log('STORE: fetchLists called');
        set({ isLoading: true, error: null });
        try {
          const response = await api.getLists();
          console.log('STORE: fetchLists successful', response.data.length, 'lists');
          const fetchedLists = response.data;

          // Load tasks for all lists so simplified dashboard has complete data.
          const taskResponses = await Promise.all(
            fetchedLists.map(async (list) => {
              const tasksResponse = await api.getTasks(list.id);
              return [list.id, tasksResponse.data] as const;
            })
          );

          const tasksByList = Object.fromEntries(taskResponses);

          set(() => ({
            lists: fetchedLists,
            tasks: tasksByList,
            isLoading: false
          }));
        } catch (error: unknown) {
          console.error('STORE: fetchLists error', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch lists', 
            isLoading: false 
          });
        }
      },

      createTask: async (taskData) => {
        console.log('STORE: createTask called', taskData);
        set({ isLoading: true, error: null });
        try {
          const response = await api.createTask(taskData);
          console.log('STORE: createTask successful', response.data);
          const listId = taskData.listId;
          
          set(state => ({
            tasks: {
              ...state.tasks,
              [listId]: [...(state.tasks[listId] || []), response.data]
            },
            isLoading: false
          }));
        } catch (error: unknown) {
          console.error('STORE: createTask error', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to create task', 
            isLoading: false 
          });
        }
      },

      completeTask: async (id) => {
        console.log('STORE: completeTask called', id);
        set({ isLoading: true, error: null });
        try {
          const response = await api.completeTask(id);
          console.log('STORE: completeTask successful', response.data);
          const updatedTask = response.data;
          
          set(state => ({
            tasks: {
              ...state.tasks,
              [updatedTask.listId]: (state.tasks[updatedTask.listId] || [])
                .map(task => task.id === id ? updatedTask : task)
            },
            isLoading: false
          }));
        } catch (error: unknown) {
          console.error('STORE: completeTask error', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to complete task', 
            isLoading: false 
          });
        }
      },

      reopenTask: async (id) => {
        console.log('STORE: reopenTask called', id);
        set({ isLoading: true, error: null });
        try {
          const response = await api.reopenTask(id);
          console.log('STORE: reopenTask successful', response.data);
          const updatedTask = response.data;
          
          set(state => ({
            tasks: {
              ...state.tasks,
              [updatedTask.listId]: (state.tasks[updatedTask.listId] || [])
                .map(task => task.id === id ? updatedTask : task)
            },
            isLoading: false
          }));
        } catch (error: unknown) {
          console.error('STORE: reopenTask error', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to reopen task', 
            isLoading: false 
          });
        }
      },

      clearError: () => {
        console.log('STORE: clearError called');
        set({ error: null });
      },
    }),
    {
      name: 'todo-app-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        lists: state.lists,
        tasks: state.tasks
      })
    }
  )
);
