import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Global Fetch Interceptor for Production API Routing
const API_BASE = import.meta.env.VITE_API_URL || 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3001'
    : '');

const originalFetch = window.fetch;
window.fetch = async function (input, init) {
  let url = input;
  if (typeof input === 'string' && input.startsWith('http://localhost:3001')) {
    url = input.replace('http://localhost:3001', API_BASE);
  }
  return originalFetch(url, init);
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
