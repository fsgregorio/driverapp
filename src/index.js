import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Suppress AbortError from React Strict Mode in development
if (process.env.NODE_ENV === 'development') {
  const originalError = console.error;
  console.error = (...args) => {
    // Suppress AbortError messages from React Strict Mode
    if (
      args[0]?.includes?.('signal is aborted') ||
      args[0]?.includes?.('AbortError') ||
      (args[0]?.name === 'AbortError' && args[0]?.message?.includes('aborted'))
    ) {
      return;
    }
    originalError.apply(console, args);
  };

  // Also handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    if (
      event.reason?.name === 'AbortError' ||
      event.reason?.message?.includes('aborted') ||
      event.reason?.message?.includes('signal is aborted')
    ) {
      event.preventDefault();
    }
  });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


