import { useState } from 'react';
import { Plus, Calendar, TrendingUp, CheckCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { ListType } from '../types';
import { format } from 'date-fns';

export function DashboardPage() {
  const { lists, tasks, createList, createTask, currentListId } = useStore();
  const [newListName, setNewListName] = useState('');
  const [newListType, setNewListType] = useState<ListType>('todo');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  
  const totalTasks = Object.values(tasks).flat().length;
  const completedTasks = Object.values(tasks).flat().filter(t => t.completed).length;
  const today = format(new Date(), 'EEEE, MMMM d');
  
  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    
    const config = {
      showCompleted: true,
      ...(newListType === 'todo' && { autoArchive: true }),
      ...(newListType === 'daily' && { 
        daysOfWeek: [1, 2, 3, 4, 5], // Monday-Friday
        analyticsEnabled: true 
      }),
      ...(newListType === 'collection' && { 
        displayStyle: 'list',
        sortOrder: 'name'
      })
    };
    
    await createList({
      name: newListName,
      type: newListType,
      config
    });
    
    setNewListName('');
  };
  
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !currentListId) return;
    
    await createTask({
      listId: currentListId,
      title: newTaskTitle,
      completed: false,
      order: Object.values(tasks).flat().length + 1
    });
    
    setNewTaskTitle('');
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-1">{today}</p>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Lists</p>
              <p className="text-2xl font-bold text-gray-800">{lists.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Tasks Completed</p>
              <p className="text-2xl font-bold text-gray-800">{completedTasks}/{totalTasks}</p>
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
                {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create New List */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Create New List</h2>
          <form onSubmit={handleCreateList} className="space-y-4">
            <div>
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="List name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="flex space-x-2">
              {(['todo', 'daily', 'collection'] as ListType[]).map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setNewListType(type)}
                  className={`flex-1 px-3 py-2 text-sm rounded-md ${
                    newListType === type
                      ? 'bg-primary-100 text-primary-700 border border-primary-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type === 'todo' && '📝 Todo'}
                  {type === 'daily' && '🔄 Daily'}
                  {type === 'collection' && '📁 Collection'}
                </button>
              ))}
            </div>
            <button
              type="submit"
              disabled={!newListName.trim()}
              className="w-full flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create List
            </button>
          </form>
        </div>
        
        {/* Quick Add Task */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Add Task</h2>
          <form onSubmit={handleCreateTask} className="space-y-4">
            <div>
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Task title"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={currentListId || ''}
                onChange={(e) => useStore.getState().setCurrentList(e.target.value || null)}
              >
                <option value="">Select a list</option>
                {lists.map(list => (
                  <option key={list.id} value={list.id}>
                    {list.name} ({list.type})
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={!newTaskTitle.trim() || !currentListId}
              className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </button>
          </form>
        </div>
      </div>
      
      {/* Recent Lists */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Your Lists</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {lists.map(list => {
            const listTasks = tasks[list.id] || [];
            const completed = listTasks.filter(t => t.completed).length;
            const total = listTasks.length;
            
            return (
              <div 
                key={list.id} 
                className="px-6 py-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => useStore.getState().setCurrentList(list.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-xl mr-3">
                      {list.type === 'todo' && '📝'}
                      {list.type === 'daily' && '🔄'}
                      {list.type === 'collection' && '📁'}
                    </span>
                    <div>
                      <h3 className="font-medium text-gray-800">{list.name}</h3>
                      <p className="text-sm text-gray-500">
                        {list.type.charAt(0).toUpperCase() + list.type.slice(1)} List • 
                        {total} task{total !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-800">
                      {completed}/{total} completed
                    </div>
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                      <div 
                        className="h-full bg-primary-600"
                        style={{ width: total > 0 ? `${(completed / total) * 100}%` : '0%' }}
                      />
                    </div>
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
