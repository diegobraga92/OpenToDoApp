import { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Flame, Target } from 'lucide-react';
import { useStore } from '../store/useStore';
import { api } from '../lib/api';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import type { DailyAnalytics } from '../types';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

interface StreakStats {
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
}

export function DailyPage() {
  const { lists, tasks, completeTask, reopenTask } = useStore();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [analyticsData, setAnalyticsData] = useState<DailyAnalytics[]>([]);
  const [streakStats, setStreakStats] = useState<StreakStats | null>(null);
  
  const dailyLists = lists.filter(list => list.type === 'daily');
  const weekDays = eachDayOfInterval({
    start: startOfWeek(selectedDate, { weekStartsOn: 0 }),
    end: endOfWeek(selectedDate, { weekStartsOn: 0 })
  });
  
  // Get tasks for selected date
  const dailyTasks = Object.values(tasks).flat().filter(task => {
    const list = lists.find(l => l.id === task.listId);
    if (!list || list.type !== 'daily') return false;
    
    // Check if task should appear on selected day
    const dayOfWeek = selectedDate.getDay();
    const daysOfWeek = list.config.daysOfWeek || [0, 1, 2, 3, 4, 5, 6];
    
    return daysOfWeek.includes(dayOfWeek);
  });
  
  const completedToday = dailyTasks.filter(task => 
    task.completed && task.completedAt && isSameDay(new Date(task.completedAt), selectedDate)
  ).length;
  
  useEffect(() => {
    const fetchAnalytics = async () => {
      const startDate = format(startOfWeek(selectedDate, { weekStartsOn: 0 }), 'yyyy-MM-dd');
      const endDate = format(endOfWeek(selectedDate, { weekStartsOn: 0 }), 'yyyy-MM-dd');
      
      try {
        const [analyticsResponse, streakResponse] = await Promise.all([
          api.getDailyAnalytics(startDate, endDate),
          api.getStreakStats()
        ]);
        
        setAnalyticsData(analyticsResponse.data);
        setStreakStats(streakResponse.data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      }
    };
    
    fetchAnalytics();
  }, [selectedDate]);
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Daily View</h1>
        <p className="text-gray-600 mt-1">Track your daily routines and habits</p>
      </div>
      
      {/* Date Selector */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-gray-400 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </h2>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                const prevDay = new Date(selectedDate);
                prevDay.setDate(prevDay.getDate() - 1);
                setSelectedDate(prevDay);
              }}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Previous Day
            </button>
            <button
              onClick={() => setSelectedDate(new Date())}
              className="px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded-md hover:bg-primary-200"
            >
              Today
            </button>
            <button
              onClick={() => {
                const nextDay = new Date(selectedDate);
                nextDay.setDate(nextDay.getDate() + 1);
                setSelectedDate(nextDay);
              }}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Next Day
            </button>
          </div>
        </div>
        
        {/* Week Navigation */}
        <div className="mt-4 grid grid-cols-7 gap-1">
          {weekDays.map(day => (
            <button
              key={day.toString()}
              onClick={() => setSelectedDate(day)}
              className={`p-2 text-center rounded-md ${
                isSameDay(day, selectedDate)
                  ? 'bg-primary-600 text-white'
                  : isSameDay(day, new Date())
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className="text-xs font-medium">{format(day, 'EEE')}</div>
              <div className="text-lg font-semibold">{format(day, 'd')}</div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Daily Tasks</p>
              <p className="text-2xl font-bold text-gray-800">{dailyTasks.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Completed Today</p>
              <p className="text-2xl font-bold text-gray-800">{completedToday}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Flame className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Current Streak</p>
              <p className="text-2xl font-bold text-gray-800">
                {streakStats?.currentStreak || 0} days
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-800">
                {dailyTasks.length > 0 
                  ? Math.round((completedToday / dailyTasks.length) * 100) 
                  : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Daily Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Today's Tasks</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {dailyTasks.length === 0 ? (
              <div className="px-6 py-8 text-center">
                <p className="text-gray-500">No daily tasks scheduled for today</p>
              </div>
            ) : (
              dailyTasks.map(task => {
                const list = lists.find(l => l.id === task.listId);
                const isCompletedToday = task.completed && 
                  task.completedAt && 
                  isSameDay(new Date(task.completedAt), selectedDate);
                
                return (
                  <div 
                    key={task.id} 
                    className="px-6 py-4 flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <button
                        onClick={() => 
                          isCompletedToday
                            ? reopenTask(task.id)
                            : completeTask(task.id)
                        }
                        className={`w-6 h-6 rounded-full border flex items-center justify-center mr-3 ${
                          isCompletedToday
                            ? 'bg-green-500 border-green-500'
                            : 'border-gray-300 hover:border-green-500'
                        }`}
                      >
                        {isCompletedToday && (
                          <span className="text-white text-sm">✓</span>
                        )}
                      </button>
                      <div>
                        <span className={`${
                          isCompletedToday 
                            ? 'line-through text-gray-500' 
                            : 'text-gray-800'
                        }`}>
                          {task.title}
                        </span>
                        <p className="text-sm text-gray-500">
                          {list?.name}
                          {task.streakCount && task.streakCount > 0 && (
                            <span className="ml-2 text-orange-600">
                              🔥 {task.streakCount} day streak
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
        
        {/* Analytics Chart */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Weekly Progress</h2>
          </div>
          <div className="p-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => format(new Date(date), 'EEE')}
                    stroke="#666"
                  />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    labelFormatter={(date) => format(new Date(date), 'MMM d, yyyy')}
                    formatter={(value) => [value, 'Tasks']}
                  />
                  <Bar 
                    dataKey="completedTasks" 
                    name="Completed Tasks"
                    fill="#0ea5e9" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {streakStats && (
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Current Streak</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {streakStats.currentStreak} days
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Longest Streak</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {streakStats.longestStreak} days
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Daily Lists */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Your Daily Lists</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {dailyLists.map(list => {
            const listTasks = tasks[list.id] || [];
            const activeDays = list.config.daysOfWeek || [0, 1, 2, 3, 4, 5, 6];
            const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            
            return (
              <div key={list.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-800">{list.name}</h3>
                    <div className="flex items-center mt-1">
                      <span className="text-sm text-gray-500 mr-3">Active on:</span>
                      <div className="flex space-x-1">
                        {dayNames.map((day, index) => (
                          <span
                            key={day}
                            className={`text-xs px-2 py-0.5 rounded ${
                              activeDays.includes(index)
                                ? 'bg-primary-100 text-primary-700'
                                : 'bg-gray-100 text-gray-400'
                            }`}
                          >
                            {day}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {listTasks.length} task{listTasks.length !== 1 ? 's' : ''}
                    </p>
                    <button
                      onClick={() => window.location.href = `/list/${list.id}`}
                      className="mt-2 text-sm text-primary-600 hover:text-primary-800"
                    >
                      View List →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
