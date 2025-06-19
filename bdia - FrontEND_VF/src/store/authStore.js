import { create } from 'zustand';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('access_token'),
  isLoading: false,
  isAuthenticated: !!localStorage.getItem('access_token'),

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const response = await authService.login(email, password);
      const { access_token } = response;
      
      localStorage.setItem('access_token', access_token);
      
      // Get user info
      const user = await authService.getCurrentUser();
      localStorage.setItem('user', JSON.stringify(user));
      
      set({ 
        token: access_token, 
        user, 
        isAuthenticated: true, 
        isLoading: false 
      });
      
      toast.success(`Bienvenue ${user.nom} !`);
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      const message = error.response?.data?.detail || 'Erreur de connexion';
      toast.error(message);
      return { success: false, error: message };
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    set({ 
      user: null, 
      token: null, 
      isAuthenticated: false 
    });
    
    toast.success('Déconnexion réussie');
  },

  initializeAuth: async () => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        // Verify token is still valid
        const currentUser = await authService.getCurrentUser();
        set({ 
          token, 
          user: currentUser, 
          isAuthenticated: true 
        });
      } catch (error) {
        // Token is invalid
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false 
        });
      }
    }
  },

  updateUser: (userData) => {
    set({ user: userData });
    localStorage.setItem('user', JSON.stringify(userData));
  },
}));

export default useAuthStore;