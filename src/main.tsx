// main.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css'; // Your global styles

const container = document.getElementById('root');
const root = createRoot(container!); // createRoot(container!) if you use TypeScript
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
