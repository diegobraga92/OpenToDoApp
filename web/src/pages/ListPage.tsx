import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Check, X, Edit2, ChevronUp, ChevronDown } from 'lucide-react';
import { useStore } from '../store/useStore';

export function ListPage() {
  const { listId } = useParams<{ listId: string }>();
  const { 
    lists, 
    tasks, 
    currentListId, 
    updateTask, 
    completeTask, 
    reopenTask, 
    createTask,
    updateList 
  } = useStore();
  
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState('');
  const [showCompleted, setShowCompleted] = useState(true);
  
  const list = lists.find(l => l.id === (listId || currentListId));
  const listTasks = tasks[list?.id || ''] || [];
  
  if (!list) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">List not found</p>
      </div>
    );
  }
  
  const filteredTasks = listTasks.filter(task => 
    showCompleted ? true : !task.completed
  );
  
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    await createTask({
      listId: list.id,
      title: newTaskTitle,
      completed: false,
      order: listTasks.length + 1
    });
    
    setNewTaskTitle('');
  };
  
  const handleUpdateTask = async (taskId: string) => {
    if (!editingTaskTitle.trim()) return;
    
    await updateTask(taskId, { title: editingTaskTitle });
    setEditingTaskId(null);
    setEditingTaskTitle('');
  };
  
  const handleToggleShowCompleted = () => {
    const newValue = !showCompleted;
    setShowCompleted(newValue);
    
    // Update list config
    updateList(list.id, {
      config: { ...list.config, showCompleted: newValue }
    });
  };
  
  const handleReorderTask = async (taskId: string, direction: 'up' | 'down') => {
    const taskIndex = listTasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;
    
    const newIndex = direction === 'up' ? taskIndex - 1 : taskIndex + 1;
    if (newIndex < 0 || newIndex >= listTasks.length) return;
    
    // Swap order values
    const task1 = listTasks[taskIndex];
    const task2 = listTasks[newIndex];
    
    await updateTask(task1.id, { order: task2.order });
    await updateTask(task2.id, { order: task1.order });
  };
  
  return (
    <div className="space-y-6">
      {/* List Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{list.name}</h1>
          <p className="text-gray-600 mt-1">
            {list.type === 'todo' && 'Regular todo list'}
            {list.type === 'daily' && 'Daily recurring tasks'}
            {list.type === 'collection' && 'Collection of lists'}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleToggleShowCompleted}
            className={`px-4 py-2 text-sm rounded-md ${
              showCompleted
                ? 'bg-primary-100 text-primary-700 border border-primary-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {showCompleted ? 'Hide Completed' : 'Show Completed'}
          </button>
          
          {list.type === 'daily' && (
            <button
              onClick={() => window.location.href = '/daily'}
              className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
            >
              Daily View
            </button>
          )}
        </div>
      </div>
      
      {/* List Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Total Tasks</p>
          <p className="text-2xl font-bold text-gray-800">{listTasks.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-2xl font-bold text-gray-800">
            {listTasks.filter(t => t.completed).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-gray-800">
            {listTasks.filter(t => !t.completed).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Completion Rate</p>
          <p className="text-2xl font-bold text-gray-800">
            {listTasks.length > 0 
              ? Math.round((listTasks.filter(t => t.completed).length / listTasks.length) * 100) 
              : 0}%
          </p>
        </div>
      </div>
      
      {/* Add Task Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleCreateTask} className="flex space-x-2">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!newTaskTitle.trim()}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add
          </button>
        </form>
      </div>
      
      {/* Task List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No tasks yet. Add one above!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredTasks
              .sort((a, b) => a.order - b.order)
              .map((task) => (
                <div 
                  key={task.id} 
                  className={`px-6 py-4 flex items-center justify-between ${
                    task.completed ? 'bg-gray-50' : ''
                  }`}
                >
                  <div className="flex items-center flex-1">
                    <button
                      onClick={() => 
                        task.completed 
                          ? reopenTask(task.id)
                          : completeTask(task.id)
                      }
                      className={`w-6 h-6 rounded-full border flex items-center justify-center mr-3 ${
                        task.completed
                          ? 'bg-green-500 border-green-500'
                          : 'border-gray-300 hover:border-green-500'
                      }`}
                    >
                      {task.completed && (
                        <Check className="h-4 w-4 text-white" />
                      )}
                    </button>
                    
                    {editingTaskId === task.id ? (
                      <div className="flex-1 flex items-center space-x-2">
                        <input
                          type="text"
                          value={editingTaskTitle}
                          onChange={(e) => setEditingTaskTitle(e.target.value)}
                          className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                          autoFocus
                        />
                        <button
                          onClick={() => handleUpdateTask(task.id)}
                          className="p-1 text-green-600 hover:text-green-800"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingTaskId(null);
                            setEditingTaskTitle('');
                          }}
                          className="p-1 text-red-600 hover:text-red-800"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex-1">
                        <span 
                          className={`${
                            task.completed 
                              ? 'line-through text-gray-500' 
                              : 'text-gray-800'
                          }`}
                        >
                          {task.title}
                        </span>
                        {task.streakCount && task.streakCount > 0 && (
                          <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                            🔥 {task.streakCount} day streak
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleReorderTask(task.id, 'up')}
                      className="p-1 text-gray-400 hover:text-gray-600"
                      disabled={task.order <= 1}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleReorderTask(task.id, 'down')}
                      className="p-1 text-gray-400 hover:text-gray-600"
                      disabled={task.order >= listTasks.length}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        setEditingTaskId(task.id);
                        setEditingTaskTitle(task.title);
                      }}
                      className="p-1 text-gray-400 hover:text-blue-600"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
      
      {/* List Configuration */}
      {list.type === 'daily' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Daily Configuration</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">Active Days</p>
              <div className="flex space-x-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => {
                  const isActive = list.config.daysOfWeek?.includes(index) ?? true;
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => {
                        const currentDays = list.config.daysOfWeek || [0, 1, 2, 3, 4, 5, 6];
                        const newDays = isActive
                          ? currentDays.filter(d => d !== index)
                          : [...currentDays, index];
                        
                        updateList(list.id, {
                          config: { ...list.config, daysOfWeek: newDays }
                        });
                      }}
                      className={`px-3 py-1 text-sm rounded-md ${
                        isActive
                          ? 'bg-primary-100 text-primary-700 border border-primary-300'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="analyticsEnabled"
                checked={list.config.analyticsEnabled ?? true}
                onChange={(e) => {
                  updateList(list.id, {
                    config: { ...list.config, analyticsEnabled: e.target.checked }
                  });
                }}
                className="h-4 w-4 text-primary-600 rounded focus:ring-primary-500"
              />
              <label htmlFor="analyticsEnabled" className="ml-2 text-sm text-gray-700">
                Enable analytics for this list
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
