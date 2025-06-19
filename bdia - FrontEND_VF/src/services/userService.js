import api from './api';

export const userService = {
  async getAllUsers() {
    const response = await api.get('/users/all');
    return response.data;
  },

  async getUser(userId) {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  async getCurrentUser() {
    const response = await api.get('/users/me');
    return response.data;
  },

  async createUser(userData) {
    const response = await api.post('/users/register', userData);
    return response.data;
  },

  async updateUser(userId, updates) {
    const response = await api.patch(`/users/${userId}`, updates);
    return response.data;
  },

  async deleteUser(userId) {
    const response = await api.delete(`/users/${userId}`);
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