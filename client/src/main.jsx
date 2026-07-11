// ============================================================
// MAIN.JSX — Application Entry Point
// Mounts the React app to the DOM
// ============================================================

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // Design system + Tailwind

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
