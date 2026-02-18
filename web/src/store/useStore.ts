import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, List, Task } from '../types';
import { api } from '../lib/api';

type AppState = {
  // Auth state
  user: User | null;
  isAuthenticated: boolean;
  
  // Data state
  lists: List[];
  tasks: Record<string, Task[]>; // listId -> tasks
  currentListId: string | null;
  
  // UI state
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchLists: () => Promise<void>;
  fetchTasks: (listId: string) => Promise<void>;
  createList: (list: Omit<List, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateList: (id: string, updates: Partial<List>) => Promise<void>;
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  completeTask: (id: string) => Promise<void>;
  reopenTask: (id: string) => Promise<void>;
  setCurrentList: (listId: string | null) => void;
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
      currentListId: null,
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

      logout: () => {
        console.log('STORE: logout called');
        set({
          user: null,
          isAuthenticated: false,
          lists: [],
          tasks: {},
          currentListId: null
        });
      },

      fetchLists: async () => {
        console.log('STORE: fetchLists called');
        set({ isLoading: true, error: null });
        try {
          const response = await api.getLists();
          console.log('STORE: fetchLists successful', response.data.length, 'lists');
          set({ 
            lists: response.data,
            isLoading: false 
          });
          
          // If we have lists but no current list, set the first one
          if (response.data.length > 0 && !get().currentListId) {
            console.log('STORE: Setting current list to first list');
            set({ currentListId: response.data[0].id });
            await get().fetchTasks(response.data[0].id);
          }
        } catch (error: unknown) {
          console.error('STORE: fetchLists error', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch lists', 
            isLoading: false 
          });
        }
      },

      fetchTasks: async (listId: string) => {
        console.log('STORE: fetchTasks called for list', listId);
        set({ isLoading: true, error: null });
        try {
          const response = await api.getTasks(listId);
          console.log('STORE: fetchTasks successful', response.data.length, 'tasks');
          set(state => ({
            tasks: {
              ...state.tasks,
              [listId]: response.data
            },
            isLoading: false
          }));
        } catch (error: unknown) {
          console.error('STORE: fetchTasks error', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch tasks', 
            isLoading: false 
          });
        }
      },

      createList: async (listData) => {
        console.log('STORE: createList called', listData);
        set({ isLoading: true, error: null });
        try {
          const response = await api.createList(listData);
          console.log('STORE: createList successful', response.data);
          set(state => ({
            lists: [...state.lists, response.data],
            isLoading: false
          }));
        } catch (error: unknown) {
          console.error('STORE: createList error', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to create list', 
            isLoading: false 
          });
        }
      },

      updateList: async (id, updates) => {
        console.log('STORE: updateList called', id, updates);
        set({ isLoading: true, error: null });
        try {
          const response = await api.updateList(id, updates);
          console.log('STORE: updateList successful', response.data);
          set(state => ({
            lists: state.lists.map(list => 
              list.id === id ? response.data : list
            ),
            isLoading: false
          }));
        } catch (error: unknown) {
          console.error('STORE: updateList error', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update list', 
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

      updateTask: async (id, updates) => {
        console.log('STORE: updateTask called', id, updates);
        set({ isLoading: true, error: null });
        try {
          const response = await api.updateTask(id, updates);
          console.log('STORE: updateTask successful', response.data);
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
          console.error('STORE: updateTask error', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update task', 
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

      setCurrentList: (listId) => {
        console.log('STORE: setCurrentList called', listId);
        set({ currentListId: listId });
        if (listId) {
          get().fetchTasks(listId);
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
        tasks: state.tasks,
        currentListId: state.currentListId
      })
    }
  )
);
