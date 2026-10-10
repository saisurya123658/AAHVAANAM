
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './hooks/useAuth';
import { UserAuthProvider } from './hooks/useUserAuth';
import { App } from './App';
import { LocalStorageService } from './services/localStorageService';
// @ts-ignore CSS is loaded by the bundler and has no TypeScript module declaration.
import './index.css';

// Ensure demo data is seeded in localStorage
LocalStorageService.initialize();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <UserAuthProvider>
            <App />
          </UserAuthProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);