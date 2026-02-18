import type { User, List, Task, SyncState, ApiResponse, DailyAnalytics } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { format, isSameDay } from 'date-fns';

export class ApiClient {
  private baseURL: string;
  private isOnline: boolean = false;
  private syncQueue: SyncState[] = [];

  constructor(baseURL: string = 'http://localhost:3000/api') {
    console.log('API: Constructor called with baseURL:', baseURL);
    this.baseURL = baseURL;
    // Start offline - backend not implemented yet
    this.isOnline = false;
    console.log('API: Starting in offline mode (backend not implemented)');
  }

  private async checkConnection(): Promise<void> {
    // Backend not implemented yet, stay offline
    this.isOnline = false;
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
  async login(email: string, _password: string): Promise<ApiResponse<{ token: string; user: User }>> {
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

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return {
      data: this.mockUsers[0],
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

  async getList(id: string): Promise<ApiResponse<List>> {
    const list = this.mockLists.find(l => l.id === id);
    if (!list) {
      throw new Error('List not found');
    }
    return {
      data: list,
      success: true
    };
  }

  async createList(list: Omit<List, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<List>> {
    const newList: List = {
      ...list,
      id: uuidv4(),
      userId: '1', // Mock user ID
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.mockLists.push(newList);
    
    // Add to sync queue
    this.addToSyncQueue('list', newList.id, 'create', newList);
    
    return {
      data: newList,
      success: true
    };
  }

  async updateList(id: string, updates: Partial<List>): Promise<ApiResponse<List>> {
    const index = this.mockLists.findIndex(l => l.id === id);
    if (index === -1) {
      throw new Error('List not found');
    }
    
    this.mockLists[index] = {
      ...this.mockLists[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    // Add to sync queue
    this.addToSyncQueue('list', id, 'update', updates);
    
    return {
      data: this.mockLists[index],
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
    
    // Add to sync queue
    this.addToSyncQueue('task', newTask.id, 'create', newTask);
    
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
    
    // Add to sync queue
    this.addToSyncQueue('task', id, 'update', updates);
    
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

  // Daily tasks
  async getDailyTasks(date?: string): Promise<ApiResponse<Task[]>> {
    const targetDate = date ? new Date(date) : new Date();
    
    // Get daily lists
    const dailyLists = this.mockLists.filter(l => l.type === 'daily');
    
    // Get tasks from daily lists that should appear today
    const dailyTasks = this.mockTasks.filter(task => {
      const list = dailyLists.find(l => l.id === task.listId);
      if (!list) return false;
      
      // Check if today is in the list's configured days
      const today = targetDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const daysOfWeek = list.config.daysOfWeek || [0, 1, 2, 3, 4, 5, 6];
      
      return daysOfWeek.includes(today);
    });
    
    return {
      data: dailyTasks,
      success: true
    };
  }

  // Analytics
  async getDailyAnalytics(startDate: string, endDate: string): Promise<ApiResponse<DailyAnalytics[]>> {
    // Mock analytics data
    const analytics: DailyAnalytics[] = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    let currentDate = new Date(start);
    while (currentDate <= end) {
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      const dayTasks = this.mockTasks.filter(task => {
        if (!task.completedAt) return false;
        return isSameDay(new Date(task.completedAt), currentDate);
      });
      
      analytics.push({
        date: dateStr,
        completedTasks: dayTasks.length,
        totalTasks: 5, // Mock total
        streak: Math.floor(Math.random() * 10) // Mock streak
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return {
      data: analytics,
      success: true
    };
  }

  async getStreakStats(): Promise<ApiResponse<unknown>> {
    // Mock streak stats
    return {
      data: {
        currentStreak: 7,
        longestStreak: 21,
        completionRate: 0.85
      },
      success: true
    };
  }

  // Sync functionality
  private addToSyncQueue(entityType: 'list' | 'task', entityId: string, action: 'create' | 'update' | 'delete', data: unknown): void {
    const syncState: SyncState = {
      entityId,
      entityType,
      localVersion: Date.now(),
      serverVersion: 0,
      pendingChanges: { action, data },
      syncStatus: 'pending'
    };
    
    this.syncQueue.push(syncState);
    
    // Try to sync if online
    if (this.isOnline) {
      this.sync();
    }
  }

  async sync(): Promise<ApiResponse<{ synced: SyncState[]; conflicts: SyncState[] }>> {
    if (!this.isOnline || this.syncQueue.length === 0) {
      return {
        data: { synced: [], conflicts: [] },
        success: true
      };
    }
    
    // Mock sync - in real app, this would send to backend
    const synced = [...this.syncQueue];
    this.syncQueue = [];
    
    return {
      data: { synced, conflicts: [] },
      success: true
    };
  }

  async getSyncStatus(): Promise<ApiResponse<SyncState[]>> {
    return {
      data: this.syncQueue,
      success: true
    };
  }
}

// Singleton instance
export const api = new ApiClient();
