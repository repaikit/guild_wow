import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { ToastProvider } from '../components/Toast';
import { ErrorBoundary } from '../components/ErrorBoundary';

interface AppContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  // Theme state (light/dark)
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // We'll use useAuth hook when needed
  // const auth = useAuth();

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Apply theme to document
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Toggle sidebar function
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  // Initialize theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    
    if (savedTheme) {
      setTheme(savedTheme);
      
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      }
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // Use system preference if no saved theme
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Context value
  const contextValue: AppContextType = {
    theme,
    toggleTheme,
    sidebarOpen,
    toggleSidebar,
  };

  return (
    <ErrorBoundary>
      <AppContext.Provider value={contextValue}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </AppContext.Provider>
    </ErrorBoundary>
  );
}

// Custom hook to use the app context
export function useApp() {
  const context = useContext(AppContext);
  
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  
  return context;
}