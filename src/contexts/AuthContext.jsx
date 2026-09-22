// context/AuthContext.jsx - UPDATED to use apiFetch correctly
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../api/api';
import { useTopLoader } from './TopLoaderContext';
import {
  CHECK_AUTH,
  LOGIN,
  LOGOUT,
  ME,
  CREATE_ACCOUNT
} from '@/utils/apiEndpoint'

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { start, complete } = useTopLoader();
  const [userType, setUserType] = useState(null);

  // Update userType whenever user changes
  useEffect(() => {
    if (user?.role && Array.isArray(user.role) && user.role.length > 0) {
      setUserType(user.role[0]);
    } else if (user?.role && typeof user.role === 'string') {
      // If role is a string instead of array
      setUserType(user.role);
    } else {
      setUserType(null);
    }
  }, [user]);

  const checkAuth = useCallback(async () => {
    try {
      const data = await apiFetch(CHECK_AUTH, {
        redirectErrors: false
      });

      if (data?.success) {
        const userData = await apiFetch(ME, {
          redirectErrors: false
        });
        const userPayload = userData?.payload;
        setUser(userPayload);
        
        // Set userType from user role
        if (userPayload?.role && Array.isArray(userPayload.role) && userPayload.role.length > 0) {
          setUserType(userPayload.role[0]);
        } else if (userPayload?.role && typeof userPayload.role === 'string') {
          setUserType(userPayload.role);
        }
        
        return { success: true, payload: userPayload };
      } else {
        setUser(null);
        setUserType(null);
        return { success: false };
      }
    } catch (error) {
      setUser(null);
      setUserType(null);
      return { success: false, message: error.data?.message };
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!user) return;

    const interval = setInterval(async () => {
      try {
        const data = await apiFetch(CHECK_AUTH, {
          redirectErrors: false
        });

        if (!data?.success) {
          setUser(null);
          setUserType(null);
          navigate('/session_expired', { replace: true });
        }
      } catch {
        setUser(null);
        setUserType(null);
        navigate('/session_expired', { replace: true });
      }
    }, 15 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user, navigate]);

  const login = async ({ form }) => {
    start();

    try {
      const data = await apiFetch(LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: form,
        redirectErrors: false
      });

      if (data?.success || data?.payload) {
        const userData = data?.payload || data;
        setUser(userData);
        
        // Set userType after login
        if (userData?.role && Array.isArray(userData.role) && userData.role.length > 0) {
          setUserType(userData.role[0]);
        } else if (userData?.role && typeof userData.role === 'string') {
          setUserType(userData.role);
        }
      }

      return data;
    } catch (error) {
      return error.data || {
        success: false,
        message: "An error has occurred."
      };
    } finally {
      complete();
    }
  };

  const register = async ({ form }) => {
    start();

    try {
      const data = await apiFetch(CREATE_ACCOUNT, {
        method: "POST",
        body: form,
        redirectErrors: false
      });

      return data;
    } catch (error) {
      return error.data || {
        success: false,
        message: "An error has occurred."
      };
    } finally {
      complete();
    }
  };

  const logout = async () => {
    start();

    try {
      const resp = await apiFetch(LOGOUT, {
        method: 'POST',
        redirectErrors: false
      });

      document.cookie = "JSESSIONID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "remember-me=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      sessionStorage.clear();
      setUser(null);
      setUserType(null);
      navigate('/', { replace: true });
    } catch (error) {
      setUser(null);
      setUserType(null);
      navigate('/', { replace: true });
    } finally {
      complete();
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      userType, // Expose userType in context
      loading,
      login,
      register,
      logout,
      checkAuth,
      setUser,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};