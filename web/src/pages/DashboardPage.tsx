import { useMemo, useState } from 'react';
import { Check, Plus } from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import { useStore } from '../store/useStore';

export function DashboardPage() {
  const { lists, tasks, createTask, completeTask, reopenTask } = useStore();

  const [newDailyTaskTitle, setNewDailyTaskTitle] = useState('');
  const [newTodoTaskTitle, setNewTodoTaskTitle] = useState('');

  const today = format(new Date(), 'EEEE, MMMM d');

  const dailyList = useMemo(() => lists.find((list) => list.type === 'daily'), [lists]);
  const todoList = useMemo(() => lists.find((list) => list.type === 'todo'), [lists]);

  const dailyTasks = useMemo(() => (dailyList ? tasks[dailyList.id] || [] : []), [dailyList, tasks]);
  const todoTasks = useMemo(() => (todoList ? tasks[todoList.id] || [] : []), [todoList, tasks]);

  const todaysDailyTasks = useMemo(() => {
    if (!dailyList) return [];

    const dayOfWeek = new Date().getDay();
    const daysOfWeek = dailyList.config.daysOfWeek || [0, 1, 2, 3, 4, 5, 6];

    if (!daysOfWeek.includes(dayOfWeek)) return [];
    return dailyTasks;
  }, [dailyList, dailyTasks]);

  const handleCreateDailyTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDailyTaskTitle.trim() || !dailyList) return;

    await createTask({
      listId: dailyList.id,
      title: newDailyTaskTitle,
      completed: false,
      order: dailyTasks.length + 1,
    });

    setNewDailyTaskTitle('');
  };

  const handleCreateTodoTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTaskTitle.trim() || !todoList) return;

    await createTask({
      listId: todoList.id,
      title: newTodoTaskTitle,
      completed: false,
      order: todoTasks.length + 1,
    });

    setNewTodoTaskTitle('');
  };

  const renderTask = (task: { id: string; title: string; completed: boolean; completedAt?: string }, isDaily = false) => {
    const isDone = isDaily
      ? task.completed && !!task.completedAt && isSameDay(new Date(task.completedAt), new Date())
      : task.completed;

    return (
      <div
        key={task.id}
        className="px-4 py-3 flex items-center gap-3 border-b border-gray-100 last:border-b-0"
      >
        <button
          onClick={() => (isDone ? reopenTask(task.id) : completeTask(task.id))}
          className={`w-5 h-5 rounded-full border flex items-center justify-center ${
            isDone ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-green-500'
          }`}
        >
          {isDone && <Check className="h-3 w-3 text-white" />}
        </button>
        <span className={isDone ? 'text-gray-500 line-through' : 'text-gray-800'}>{task.title}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-1">{today}</p>
      </div>

      {!dailyList || !todoList ? (
        <div className="bg-white rounded-lg shadow p-6 text-gray-600">
          Core lists (Daily and To Do) are not available yet. Please sync lists and try again.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="bg-white rounded-lg shadow">
            <div className="px-4 py-3 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Daily</h2>
              <p className="text-sm text-gray-500">Tasks for your recurring routine</p>
            </div>

            <form onSubmit={handleCreateDailyTask} className="px-4 py-3 border-b border-gray-200 flex gap-2">
              <input
                type="text"
                value={newDailyTaskTitle}
                onChange={(e) => setNewDailyTaskTitle(e.target.value)}
                placeholder="Add daily task"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={!newDailyTaskTitle.trim()}
                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="h-4 w-4" />
              </button>
            </form>

            <div>
              {todaysDailyTasks.length === 0 ? (
                <p className="px-4 py-6 text-sm text-gray-500">No daily tasks for today.</p>
              ) : (
                todaysDailyTasks
                  .slice()
                  .sort((a, b) => a.order - b.order)
                  .map((task) => renderTask(task, true))
              )}
            </div>
          </section>

          <section className="bg-white rounded-lg shadow">
            <div className="px-4 py-3 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">To Do</h2>
              <p className="text-sm text-gray-500">Tasks to complete once</p>
            </div>

            <form onSubmit={handleCreateTodoTask} className="px-4 py-3 border-b border-gray-200 flex gap-2">
              <input
                type="text"
                value={newTodoTaskTitle}
                onChange={(e) => setNewTodoTaskTitle(e.target.value)}
                placeholder="Add to do task"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="submit"
                disabled={!newTodoTaskTitle.trim()}
                className="px-3 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="h-4 w-4" />
              </button>
            </form>

            <div>
              {todoTasks.length === 0 ? (
                <p className="px-4 py-6 text-sm text-gray-500">No to do tasks yet.</p>
              ) : (
                todoTasks
                  .slice()
                  .sort((a, b) => a.order - b.order)
                  .map((task) => renderTask(task))
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}