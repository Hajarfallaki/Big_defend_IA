import api from './api';

export const authService = {
  async login(email, password) {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);
    
    const response = await api.post('/auth/jwt/login', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },

  async logout() {
    try {
      await api.post('/auth/jwt/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  },

  async getCurrentUser() {
    const response = await api.get('/users/me');
    return response.data;
  },

  async changePassword(currentPassword, newPassword) {
    const response = await api.post('/users/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
    return response.data;
  },
};