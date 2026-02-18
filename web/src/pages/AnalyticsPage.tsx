import { useState, useEffect } from 'react';
import { TrendingUp, Calendar, Target, Award, BarChart as BarChartIcon } from 'lucide-react';
import { useStore } from '../store/useStore';
import { api } from '../lib/api';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import type { DailyAnalytics } from '../types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

interface StreakStats {
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
}

export function AnalyticsPage() {
  const { lists, tasks } = useStore();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  const [analyticsData, setAnalyticsData] = useState<DailyAnalytics[]>([]);
  const [streakStats, setStreakStats] = useState<StreakStats | null>(null);
  
  const allTasks = Object.values(tasks).flat();
  const completedTasks = allTasks.filter(task => task.completed);
  const completionRate = allTasks.length > 0 
    ? (completedTasks.length / allTasks.length) * 100 
    : 0;
  
  // Calculate task distribution by list type
  const taskDistribution = lists.map(list => {
    const listTasks = tasks[list.id] || [];
    const completed = listTasks.filter(t => t.completed).length;
    
    return {
      name: list.name,
      value: listTasks.length,
      completed,
      type: list.type,
      color: list.type === 'todo' ? '#0ea5e9' : 
             list.type === 'daily' ? '#10b981' : 
             '#8b5cf6'
    };
  }).filter(item => item.value > 0);
  
  useEffect(() => {
    const fetchAnalytics = async () => {
      let startDate: Date;
      let endDate = new Date();
      
      switch (timeRange) {
        case 'week':
          startDate = subDays(endDate, 7);
          break;
        case 'month':
          startDate = startOfMonth(endDate);
          endDate = endOfMonth(endDate);
          break;
        case 'year':
          startDate = subDays(endDate, 365);
          break;
      }
      
      try {
        const [analyticsResponse, streakResponse] = await Promise.all([
          api.getDailyAnalytics(format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd')),
          api.getStreakStats()
        ]);
        
        setAnalyticsData(analyticsResponse.data);
        setStreakStats(streakResponse.data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      }
    };
    
    fetchAnalytics();
  }, [timeRange]);
  
  // Calculate best performing day
  const bestDay = analyticsData.reduce((best, current) => {
    if (!best || current.completedTasks > best.completedTasks) {
      return current;
    }
    return best;
  }, null);
  
  // Calculate average daily completion
  const averageDailyCompletion = analyticsData.length > 0
    ? analyticsData.reduce((sum, day) => sum + day.completedTasks, 0) / analyticsData.length
    : 0;
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>
        <p className="text-gray-600 mt-1">Track your productivity and progress</p>
      </div>
      
      {/* Time Range Selector */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-gray-400 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">Time Range</h2>
          </div>
          <div className="flex space-x-2">
            {(['week', 'month', 'year'] as const).map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 text-sm rounded-md ${
                  timeRange === range
                    ? 'bg-primary-100 text-primary-700 border border-primary-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-800">{allTasks.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-800">
                {Math.round(completionRate)}%
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Award className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Current Streak</p>
              <p className="text-2xl font-bold text-gray-800">
                {streakStats?.currentStreak || 0} days
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChartIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Avg. Daily Tasks</p>
              <p className="text-2xl font-bold text-gray-800">
                {Math.round(averageDailyCompletion)}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completion Trend */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Completion Trend</h2>
          </div>
          <div className="p-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => format(new Date(date), 'MMM d')}
                    stroke="#666"
                  />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    labelFormatter={(date) => format(new Date(date), 'MMM d, yyyy')}
                    formatter={(value) => [value, 'Tasks']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="completedTasks" 
                    name="Completed Tasks"
                    stroke="#0ea5e9" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        {/* Task Distribution */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Task Distribution</h2>
          </div>
          <div className="p-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {taskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name, props) => [
                      `${value} tasks (${props.payload.completed} completed)`,
                      props.payload.name
                    ]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
      
      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Best Performing Day */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Best Day</h3>
          {bestDay ? (
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-800 mb-2">
                {format(new Date(bestDay.date), 'EEEE')}
              </p>
              <p className="text-gray-600">
                {bestDay.completedTasks} tasks completed
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {format(new Date(bestDay.date), 'MMM d, yyyy')}
              </p>
            </div>
          ) : (
            <p className="text-gray-500 text-center">No data available</p>
          )}
        </div>
        
        {/* Streak Stats */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Streak Statistics</h3>
          {streakStats ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Current Streak</p>
                <p className="text-2xl font-bold text-gray-800">
                  {streakStats.currentStreak} days
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Longest Streak</p>
                <p className="text-2xl font-bold text-gray-800">
                  {streakStats.longestStreak} days
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Overall Completion Rate</p>
                <p className="text-2xl font-bold text-gray-800">
                  {Math.round((streakStats.completionRate || 0) * 100)}%
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center">No streak data available</p>
          )}
        </div>
        
        {/* List Performance */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">List Performance</h3>
          <div className="space-y-3">
            {lists.map(list => {
              const listTasks = tasks[list.id] || [];
              const completed = listTasks.filter(t => t.completed).length;
              const completionRate = listTasks.length > 0 
                ? (completed / listTasks.length) * 100 
                : 0;
              
              return (
                <div key={list.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">{list.name}</p>
                    <p className="text-sm text-gray-500">
                      {completed}/{listTasks.length} completed
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">
                      {Math.round(completionRate)}%
                    </p>
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                      <div 
                        className="h-full bg-primary-600"
                        style={{ width: `${completionRate}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {completedTasks
            .sort((a, b) => new Date(b.completedAt || 0).getTime() - new Date(a.completedAt || 0).getTime())
            .slice(0, 10)
            .map(task => {
              const list = lists.find(l => l.id === task.listId);
              return (
                <div key={task.id} className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <div className="flex-1">
                      <p className="text-gray-800">Completed "{task.title}"</p>
                      <p className="text-sm text-gray-500">
                        {list?.name} • {task.completedAt && format(new Date(task.completedAt), 'MMM d, h:mm a')}
                      </p>
                    </div>
                    {task.streakCount && task.streakCount > 0 && (
                      <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">
                        🔥 {task.streakCount} day streak
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
