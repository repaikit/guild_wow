import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { User, loginUser, registerUser, logoutUser, getCurrentUser } from '../services/user-service';
// These imports are not used in this file
// import { getFromStorage, setInStorage } from '../utils/helpers';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });
  const router = useRouter();

  // Initialize auth state from localStorage and verify with server
  const initializeAuth = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      // Check if we have a token in localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
        return;
      }
      
      // Verify token with server
      const user = await getCurrentUser();
      if (user) {
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else {
        // Token is invalid, clear it
        localStorage.removeItem('token');
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage,
      });
      localStorage.removeItem('token');
    }
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await loginUser(email, password);
      
      if (response && response.success && response.data) {
        localStorage.setItem('token', response.data.access_token);
        setAuthState({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return true;
      }
      return false;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return false;
    }
  };

  const register = async (email: string, password: string): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await registerUser(email, password);
      
      if (response && response.success) {
        // After successful registration, we should login the user
        const loginResponse = await loginUser(email, password);
        
        if (loginResponse && loginResponse.success && loginResponse.data) {
          localStorage.setItem('token', loginResponse.data.access_token);
          setAuthState({
            user: loginResponse.data.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return true;
        }
        return false;
      }
      return false;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
      router.push('/login');
    }
  };

  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }));
  };

  return {
    ...authState,
    login,
    register,
    logout,
    clearError,
    refreshUser: initializeAuth,
  };
}