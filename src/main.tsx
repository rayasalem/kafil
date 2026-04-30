import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
import { Toaster } from 'sonner';
import App from './App';
import { GlobalErrorFallback } from './layouts/ErrorFallback';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary 
      FallbackComponent={GlobalErrorFallback}
      onReset={() => window.location.href = '/'}
    >
      <Toaster position="top-center" dir="rtl" expand={true} richColors />
      <App />
    </ErrorBoundary>
  </StrictMode>
);
