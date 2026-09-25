import App from '@/App.jsx';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext.jsx';
import { TopLoaderProvider } from '@/contexts/TopLoaderContext.jsx';
import ScrollToTop from '@/hooks/ScrollToTop.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ApiResponseProvider } from './contexts/ApiResponseContext';
import './index.css';
import { NotificationsProvider } from './contexts/NotificationsContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <TopLoaderProvider>
          <AuthProvider>
            <ApiResponseProvider>
              <NotificationsProvider>
                <ScrollToTop />
                <App />
              </NotificationsProvider>
            </ApiResponseProvider>
          </AuthProvider>
        </TopLoaderProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);