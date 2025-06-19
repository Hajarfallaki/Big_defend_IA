import api from './api';

export const logService = {
  async getAllLogs(skip = 0, limit = 100) {
    const response = await api.get('/logs/', {
      params: { skip, limit }
    });
    return response.data;
  },

  async searchLogs(params) {
    const response = await api.get('/logs/search', { params });
    return response.data;
  },

  async exportLogs(format = 'json') {
    const response = await api.get('/logs/export', {
      params: { format },
      responseType: 'blob'
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `logs_export.${format}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    return response.data;
  },
};