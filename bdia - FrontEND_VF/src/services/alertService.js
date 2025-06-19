import api from './api';

export const alertService = {
  async createAlert(alertData) {
    const response = await api.post('/alerts/create', alertData);
    return response.data;
  },

  async getAllAlerts() {
    const response = await api.get('/alerts/all');
    return response.data;
  },

  async getBankAlerts(banqueId) {
    const response = await api.get(`/alerts/by_banque_id/${banqueId}`);
    return response.data;
  },

  async updateAlertStatus(alertId, status) {
    const response = await api.patch(`/alerts/${alertId}/status`, status, {
      headers: {
        'Content-Type': 'application/json',
      },
      params: { status }
    });
    return response.data;
  },

  async deleteAlert(alertId) {
    const response = await api.delete(`/alerts/${alertId}`);
    return response.data;
  },

  async exportAlerts() {
    const response = await api.get('/alerts/export');
    return response.data;
  },
};