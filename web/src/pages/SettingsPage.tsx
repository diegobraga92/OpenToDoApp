import { useState } from 'react';
import { Settings, Moon, Sun, Bell, RefreshCw, Database, Wifi, WifiOff } from 'lucide-react';
import { useStore } from '../store/useStore';
import { api } from '../lib/api';

export function SettingsPage() {
  const { user } = useStore();
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('light');
  const [notifications, setNotifications] = useState(true);
  const [syncInterval, setSyncInterval] = useState(5); // minutes
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'online' | 'offline'>('online');
  
  const handleThemeChange = (newTheme: 'light' | 'dark' | 'auto') => {
    setTheme(newTheme);
    // In a real app, this would update the theme in the store and apply it
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (newTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // Auto theme based on system preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };
  
  const handleSyncNow = async () => {
    setIsSyncing(true);
    try {
      const response = await api.sync();
      setSyncStatus('online');
      alert(`Synced ${response.data.synced.length} changes successfully`);
    } catch (error) {
      console.error('Sync error:', error);
      setSyncStatus('offline');
      alert('Sync failed. You are offline or the server is unavailable.');
    } finally {
      setIsSyncing(false);
    }
  };
  
  const handleExportData = () => {
    const { lists, tasks } = useStore.getState();
    const data = {
      lists,
      tasks,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `todo-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-600 mt-1">Customize your OpenToDo experience</p>
      </div>
      
      {/* User Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
            <Settings className="h-6 w-6 text-primary-600" />
          </div>
          <div className="ml-4">
            <h2 className="text-lg font-semibold text-gray-800">Account</h2>
            <p className="text-gray-600">{user?.email}</p>
          </div>
        </div>
      </div>
      
      {/* Appearance */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Appearance</h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Theme
            </label>
            <div className="flex space-x-2">
              {(['light', 'dark', 'auto'] as const).map(themeOption => (
                <button
                  key={themeOption}
                  onClick={() => handleThemeChange(themeOption)}
                  className={`flex-1 px-4 py-3 text-sm rounded-md flex items-center justify-center ${
                    theme === themeOption
                      ? 'bg-primary-100 text-primary-700 border border-primary-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {themeOption === 'light' && <Sun className="h-4 w-4 mr-2" />}
                  {themeOption === 'dark' && <Moon className="h-4 w-4 mr-2" />}
                  {themeOption === 'auto' && <Settings className="h-4 w-4 mr-2" />}
                  {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Notifications */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Notifications</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Bell className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="font-medium text-gray-800">Enable Notifications</p>
                <p className="text-sm text-gray-500">Get reminders for daily tasks</p>
              </div>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                notifications ? 'bg-primary-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  notifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
      
      {/* Sync Settings */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Sync & Data</h2>
        </div>
        <div className="p-6 space-y-6">
          {/* Sync Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {syncStatus === 'online' ? (
                <Wifi className="h-5 w-5 text-green-500 mr-3" />
              ) : (
                <WifiOff className="h-5 w-5 text-red-500 mr-3" />
              )}
              <div>
                <p className="font-medium text-gray-800">
                  {syncStatus === 'online' ? 'Online' : 'Offline'}
                </p>
                <p className="text-sm text-gray-500">
                  {syncStatus === 'online' 
                    ? 'Connected to local server' 
                    : 'Working offline - changes will sync when online'}
                </p>
              </div>
            </div>
            <button
              onClick={handleSyncNow}
              disabled={isSyncing}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync Now'}
            </button>
          </div>
          
          {/* Sync Interval */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Auto-sync Interval
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="1"
                max="60"
                value={syncInterval}
                onChange={(e) => setSyncInterval(parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm text-gray-600 w-16">
                {syncInterval} min{syncInterval !== 1 ? 's' : ''}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              How often to automatically sync changes when online
            </p>
          </div>
          
          {/* Data Management */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-md font-medium text-gray-800 mb-4">Data Management</h3>
            <div className="space-y-3">
              <button
                onClick={handleExportData}
                className="w-full flex items-center justify-between px-4 py-3 text-left bg-gray-50 rounded-md hover:bg-gray-100"
              >
                <div className="flex items-center">
                  <Database className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium text-gray-800">Export Data</p>
                    <p className="text-sm text-gray-500">Download all your lists and tasks as JSON</p>
                  </div>
                </div>
                <span className="text-primary-600">Export</span>
              </button>
              
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to clear all local data? This cannot be undone.')) {
                    localStorage.clear();
                    window.location.reload();
                  }
                }}
                className="w-full flex items-center justify-between px-4 py-3 text-left bg-red-50 rounded-md hover:bg-red-100"
              >
                <div className="flex items-center">
                  <Database className="h-5 w-5 text-red-400 mr-3" />
                  <div>
                    <p className="font-medium text-red-800">Clear Local Data</p>
                    <p className="text-sm text-red-600">Delete all data from this browser</p>
                  </div>
                </div>
                <span className="text-red-600">Clear</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* About */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">About OpenToDo</h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <p className="text-gray-600">
              OpenToDo is a local-first, offline-capable todo application designed for personal use on your home network.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-gray-700">Version</p>
              <p className="text-gray-600">1.0.0</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">License</p>
              <p className="text-gray-600">MIT Open Source</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Storage</p>
              <p className="text-gray-600">Local Browser Storage</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Sync</p>
              <p className="text-gray-600">LAN Server (Optional)</p>
            </div>
          </div>
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              This application works offline and stores all data locally in your browser. 
              When a local server is available on your network, it can sync across devices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
