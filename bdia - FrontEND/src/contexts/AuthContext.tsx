import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User } from '../types';
import { ApiService } from '../services/apiService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Vérifie l'état d'authentification au montage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await refreshAuth();
      } catch (err) {
        console.error('Initial auth check failed:', err);
      } finally {
        setIsLoading(false);
      }
    };
    initializeAuth();
  }, []);

  const refreshAuth = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const userData = await ApiService.auth.getCurrentUser();
      setUser(userData);
    } catch (err) {
      handleAuthError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { access_token } = await ApiService.auth.login(email, password);
      localStorage.setItem('auth_token', access_token);
      await refreshAuth();
    } catch (err) {
      handleAuthError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await ApiService.auth.logout();
      localStorage.removeItem('auth_token');
      setUser(null);
    } catch (err) {
      console.error('Logout failed:', err);
      // Force logout even if API call fails
      localStorage.removeItem('auth_token');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthError = (error: any) => {
    const errorMessage = error.response?.data?.message || error.message || 'Authentication failed';
    setError(errorMessage);
    console.error('Auth error:', error);
    
    // Auto-logout on 401 errors
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        logout,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Hook personnalisé pour vérifier les rôles
export const useRole = (requiredRole: User['role']) => {
  const { user } = useAuth();

  if (!user) {
    throw new Error('User not authenticated');
  }

  if (user.role !== requiredRole) {
    throw new Error(`Insufficient permissions. Required role: ${requiredRole}`);
  }

  return { user };
};