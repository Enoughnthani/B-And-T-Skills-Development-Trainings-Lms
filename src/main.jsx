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

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StrictMode>
      <ThemeProvider>
        <TopLoaderProvider>
          <AuthProvider>
            <ApiResponseProvider>
                <ScrollToTop />
                <App />
            </ApiResponseProvider>
          </AuthProvider>
        </TopLoaderProvider>
      </ThemeProvider>
    </StrictMode>
  </BrowserRouter>
)
