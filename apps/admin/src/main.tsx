import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { cssVariables } from '@rwm/tokens';
import '@rwm/tokens/base.css';
import './styles.css';
import { App } from './App';
import { AuthProvider } from './auth';

const style = document.createElement('style');
style.textContent = cssVariables();
document.head.appendChild(style);

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </MotionConfig>
  </React.StrictMode>,
);
