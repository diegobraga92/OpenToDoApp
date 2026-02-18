export interface User {
  id: string;
  email: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'auto';
  notifications?: boolean;
  syncInterval?: number;
}

export type ListType = 'todo' | 'daily' | 'collection';

export interface List {
  id: string;
  userId: string;
  name: string;
  type: ListType;
  config: ListConfig;
  createdAt: string;
  updatedAt: string;
}

export interface ListConfig {
  // Common config
  showCompleted?: boolean;
  
  // Todo list config
  autoArchive?: boolean;
  
  // Daily list config
  daysOfWeek?: number[]; // 0-6, Sunday-Saturday
  analyticsEnabled?: boolean;
  
  // Collection list config
  displayStyle?: 'grid' | 'list';
  sortOrder?: 'name' | 'created' | 'updated';
}

export interface Task {
  id: string;
  listId: string;
  title: string;
  completed: boolean;
  order: number;
  dueDate?: string;
  recurrence?: string;
  streakCount?: number;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SyncState {
  entityId: string;
  entityType: 'user' | 'list' | 'task';
  localVersion: number;
  serverVersion: number;
  pendingChanges: Record<string, unknown>;
  lastSyncedAt?: string;
  syncStatus: 'pending' | 'synced' | 'conflicted';
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface DailyAnalytics {
  date: string;
  completedTasks: number;
  totalTasks: number;
  streak: number;
}
