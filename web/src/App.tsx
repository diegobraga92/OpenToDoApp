import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Layout, Sidebar, Header, MainContent } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ListPage } from './pages/ListPage';
import { DailyPage } from './pages/DailyPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';
import { useStore } from './store/useStore';
import './App.css';

export default function App() {
  console.log('APP: Component rendering');
  
  const { isAuthenticated, fetchLists } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  console.log('APP: isAuthenticated:', isAuthenticated, 'isLoading:', isLoading);

  useEffect(() => {
    console.log('APP: useEffect running');
    const initializeApp = async () => {
      try {
        // Check if user is already authenticated (from localStorage)
        if (isAuthenticated) {
          console.log('APP: User is authenticated, fetching lists');
          await fetchLists();
        }
        console.log('APP: Loading complete');
      } catch (error) {
        console.error('APP: Error in useEffect:', error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeApp();
  }, [isAuthenticated, fetchLists]);

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-800 mb-4">Error Loading App</h1>
          <p className="text-red-600">Please check the browser console for details.</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    console.log('APP: Showing loading state');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading OpenToDo App...</div>
      </div>
    );
  }

  console.log('APP: Rendering main app');
  
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/" element={isAuthenticated ? (
          <Layout>
            <Sidebar />
            <div className="flex-1 flex flex-col">
              <Header />
              <MainContent>
                <DashboardPage />
              </MainContent>
            </div>
          </Layout>
        ) : <Navigate to="/login" />} />
        <Route path="/list/:listId" element={isAuthenticated ? (
          <Layout>
            <Sidebar />
            <div className="flex-1 flex flex-col">
              <Header />
              <MainContent>
                <ListPage />
              </MainContent>
            </div>
          </Layout>
        ) : <Navigate to="/login" />} />
        <Route path="/daily" element={isAuthenticated ? (
          <Layout>
            <Sidebar />
            <div className="flex-1 flex flex-col">
              <Header />
              <MainContent>
                <DailyPage />
              </MainContent>
            </div>
          </Layout>
        ) : <Navigate to="/login" />} />
        <Route path="/analytics" element={isAuthenticated ? (
          <Layout>
            <Sidebar />
            <div className="flex-1 flex flex-col">
              <Header />
              <MainContent>
                <AnalyticsPage />
              </MainContent>
            </div>
          </Layout>
        ) : <Navigate to="/login" />} />
        <Route path="/settings" element={isAuthenticated ? (
          <Layout>
            <Sidebar />
            <div className="flex-1 flex flex-col">
              <Header />
              <MainContent>
                <SettingsPage />
              </MainContent>
            </div>
          </Layout>
        ) : <Navigate to="/login" />} />
        {/* Fallback route for debugging */}
        <Route path="/debug" element={
          <div className="min-h-screen p-8 bg-gray-50">
            <h1 className="text-2xl font-bold mb-4">Debug Page</h1>
            <p>App is working! Check console for logs.</p>
            <div className="mt-4 p-4 bg-white rounded shadow">
              <p>isAuthenticated: {isAuthenticated ? 'true' : 'false'}</p>
              <p>isLoading: {isLoading ? 'true' : 'false'}</p>
              <p>hasError: {hasError ? 'true' : 'false'}</p>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}
