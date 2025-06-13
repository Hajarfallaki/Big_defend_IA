import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User ,Client} from '../types';
import {
  login as loginApi,
  logout as logoutApi,
  healthCheck
} from '../services/apiService';
import { wsService } from '../services/websocketService';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      verifyToken();
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async () => {
    try {
      const isHealthy = await healthCheck();
      if (!isHealthy) {
        console.warn('Backend not available, using mock mode');
        handleMockLogin();
        return;
      }

      const res = await fetch('http://localhost:8000/api/v1/users/me', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
        wsService.connect(localStorage.getItem('auth_token')!);
      } else {
        localStorage.removeItem('auth_token');
      }
    } catch (err) {
      console.error('Token verification failed:', err);
      handleMockLogin();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const isHealthy = await healthCheck();

      if (isHealthy) {
        const { access_token } = await loginApi(email, password);
        const res = await fetch('http://localhost:8000/api/v1/users/me', {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        if (!res.ok) throw new Error('Impossible de récupérer le profil');

        const userData = await res.json();
        setUser(userData);
        wsService.connect(access_token);
      } else {
        console.warn('Backend offline – switching to mock mode');
        await mockLogin(email, password);
      }
    } catch (err) {
      console.warn('Real login failed – trying mock mode');
      await mockLogin(email, password);
    } finally {
      setLoading(false);
    }
  };

  const mockLogin = async (email: string, password: string) => {
    const mockUsers: (User & { password: string })[] = [
      {
        id: '1',
        name: 'Admin BigDefend',
        email: 'admin@bigdefend.com',
        role: 'admin',
        password: 'admin123',
      },
      {
        id: '2',
        name: 'Analyste Fraude',
        email: 'analyst@bigdefend.com',
        role: 'analyst',
        password: 'analyst123',
      },
      {
        id: '4',
        name: 'Client Protégé',
        email: 'client@email.com',
        role: 'client',
        password: 'client123',
      },
    ];

    const foundUser = mockUsers.find((u) => u.email === email && u.password === password);
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('mock_user', JSON.stringify(userWithoutPassword));
      localStorage.setItem('auth_token', 'mock_token_' + foundUser.id);
    } else {
      throw new Error('Identifiants incorrects');
    }
  };

  const handleMockLogin = () => {
    const mockUser = localStorage.getItem('mock_user');
    if (mockUser) {
      setUser(JSON.parse(mockUser));
    }
  };

  const logout = () => {
    logoutApi();
    wsService.disconnect();
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('mock_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
