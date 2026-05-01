import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { GlobalErrorFallback } from './layouts/ErrorFallback';
import { LanguageProvider } from '@/shared/context/LanguageContext';
import './index.css';

// Initialize the professional Query Client for data fetching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <ErrorBoundary 
          FallbackComponent={GlobalErrorFallback}
          onReset={() => window.location.href = '/'}
        >
          <Toaster position="top-center" dir="rtl" expand={true} richColors />
          <App />
        </ErrorBoundary>
      </LanguageProvider>
    </QueryClientProvider>
  </StrictMode>
);
