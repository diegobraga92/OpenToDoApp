import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppSimple from './App.tsx'

console.log('MAIN: Starting React app (simple version)');

const rootElement = document.getElementById('root');
if (!rootElement) {
  document.body.innerHTML = '<h1 style="padding: 40px; color: red;">Error: Could not find root element!</h1>';
} else {
  try {
    const root = createRoot(rootElement);
    root.render(
      <StrictMode>
        <AppSimple />
      </StrictMode>
    );
    console.log('MAIN: React app rendered successfully');
  } catch (error) {
    console.error('MAIN: Error rendering React app:', error);
    rootElement.innerHTML = `
      <div style="padding: 40px; font-family: sans-serif;">
        <h1 style="color: red;">Error Loading Application</h1>
        <p>${error}</p>
        <button onclick="window.location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Reload Page
        </button>
      </div>
    `;
  }
}
