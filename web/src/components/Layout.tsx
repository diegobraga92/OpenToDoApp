import React from 'react';
import { clsx } from 'clsx';

type LayoutProps = {
  children: React.ReactNode;
};

type SidebarProps = {
  className?: string;
};

type HeaderProps = {
  className?: string;
};

type MainContentProps = {
  children: React.ReactNode;
  className?: string;
};

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {children}
    </div>
  );
}

export function Sidebar({ className }: SidebarProps) {
  const { lists, currentListId, setCurrentList, logout } = useStore();
  
  return (
    <div className={clsx("w-64 bg-white border-r border-gray-200 flex flex-col", className)}>
      <div className="p-4">
        <h1 className="text-xl font-bold text-gray-800">OpenToDo</h1>
        <p className="text-sm text-gray-500 mt-1">Your local todo app</p>
      </div>
      
      <nav className="flex-1 p-4">
        <div className="mb-6">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Navigation
          </h2>
          <ul className="space-y-1">
            <li>
              <a 
                href="/" 
                className={clsx(
                  "flex items-center px-3 py-2 text-sm rounded-md",
                  !currentListId ? "bg-primary-50 text-primary-700" : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <span className="mr-2">📋</span>
                Dashboard
              </a>
            </li>
            <li>
              <a 
                href="/daily" 
                className={clsx(
                  "flex items-center px-3 py-2 text-sm rounded-md",
                  "text-gray-700 hover:bg-gray-100"
                )}
              >
                <span className="mr-2">📅</span>
                Daily View
              </a>
            </li>
            <li>
              <a 
                href="/analytics" 
                className={clsx(
                  "flex items-center px-3 py-2 text-sm rounded-md",
                  "text-gray-700 hover:bg-gray-100"
                )}
              >
                <span className="mr-2">📊</span>
                Analytics
              </a>
            </li>
            <li>
              <a 
                href="/settings" 
                className={clsx(
                  "flex items-center px-3 py-2 text-sm rounded-md",
                  "text-gray-700 hover:bg-gray-100"
                )}
              >
                <span className="mr-2">⚙️</span>
                Settings
              </a>
            </li>
          </ul>
        </div>
        
        <div>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Your Lists
          </h2>
          <ul className="space-y-1">
            {lists.map(list => (
              <li key={list.id}>
                <a 
                  href={`/list/${list.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentList(list.id);
                  }}
                  className={clsx(
                    "flex items-center px-3 py-2 text-sm rounded-md",
                    currentListId === list.id 
                      ? "bg-primary-50 text-primary-700" 
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <span className="mr-2">
                    {list.type === 'todo' && '📝'}
                    {list.type === 'daily' && '🔄'}
                    {list.type === 'collection' && '📁'}
                  </span>
                  {list.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
        >
          <span className="mr-2">🚪</span>
          Logout
        </button>
      </div>
    </div>
  );
}

export function Header({ className }: HeaderProps) {
  const { user } = useStore();
  
  return (
    <header className={clsx("bg-white border-b border-gray-200 px-6 py-4", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-800">Welcome back, {user?.email?.split('@')[0] || 'User'}!</h1>
          <p className="text-sm text-gray-500">Manage your tasks and stay productive</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Online
          </div>
        </div>
      </div>
    </header>
  );
}

export function MainContent({ children, className }: MainContentProps) {
  return (
    <main className={clsx("flex-1 p-6 overflow-auto", className)}>
      {children}
    </main>
  );
}

// Import useStore at the end to avoid circular dependency
import { useStore } from '../store/useStore';
