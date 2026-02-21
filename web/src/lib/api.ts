import type { User, List, Task, ApiResponse } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class ApiClient {
  constructor() {
    console.log('API: Using local mock backend');
  }

  // Mock data storage (in real app, this would be IndexedDB)
  private mockUsers: User[] = [
    { id: '1', email: 'test@example.com' }
  ];

  private mockLists: List[] = [
    {
      id: '1',
      userId: '1',
      name: 'Daily Routine',
      type: 'daily',
      config: {
        daysOfWeek: [1, 2, 3, 4, 5], // Monday-Friday
        analyticsEnabled: true,
        showCompleted: true
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      userId: '1',
      name: 'Shopping List',
      type: 'todo',
      config: {
        showCompleted: false,
        autoArchive: true
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '3',
      userId: '1',
      name: 'Project Ideas',
      type: 'collection',
      config: {
        displayStyle: 'grid',
        sortOrder: 'name'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  private mockTasks: Task[] = [
    {
      id: '1',
      listId: '1',
      title: 'Morning exercise',
      completed: false,
      order: 1,
      recurrence: 'daily',
      streakCount: 5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      listId: '1',
      title: 'Read 30 minutes',
      completed: true,
      order: 2,
      recurrence: 'daily',
      streakCount: 3,
      completedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '3',
      listId: '2',
      title: 'Buy groceries',
      completed: false,
      order: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  // Auth endpoints
  async login(email: string, password: string): Promise<ApiResponse<{ token: string; user: User }>> {
    void password;
    // Mock login - in real app, this would call the backend
    const user = this.mockUsers.find(u => u.email === email);
    if (!user) {
      throw new Error('User not found');
    }
    
    return {
      data: {
        token: 'mock-jwt-token',
        user
      },
      success: true
    };
  }

  // List endpoints
  async getLists(): Promise<ApiResponse<List[]>> {
    return {
      data: this.mockLists,
      success: true
    };
  }

  // Task endpoints
  async getTasks(listId: string): Promise<ApiResponse<Task[]>> {
    const tasks = this.mockTasks.filter(t => t.listId === listId);
    return {
      data: tasks,
      success: true
    };
  }

  async createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Task>> {
    const newTask: Task = {
      ...task,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.mockTasks.push(newTask);
    
    return {
      data: newTask,
      success: true
    };
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<ApiResponse<Task>> {
    const index = this.mockTasks.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }
    
    this.mockTasks[index] = {
      ...this.mockTasks[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return {
      data: this.mockTasks[index],
      success: true
    };
  }

  async completeTask(id: string): Promise<ApiResponse<Task>> {
    const task = this.mockTasks.find(t => t.id === id);
    if (!task) {
      throw new Error('Task not found');
    }
    
    const updates: Partial<Task> = {
      completed: true,
      completedAt: new Date().toISOString(),
      streakCount: (task.streakCount || 0) + 1
    };
    
    return this.updateTask(id, updates);
  }

  async reopenTask(id: string): Promise<ApiResponse<Task>> {
    const updates: Partial<Task> = {
      completed: false,
      completedAt: undefined
    };
    
    return this.updateTask(id, updates);
  }
}

// Singleton instance
export const api = new ApiClient();
