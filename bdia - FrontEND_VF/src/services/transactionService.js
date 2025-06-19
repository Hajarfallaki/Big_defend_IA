import api from './api';

export const transactionService = {
  // Transactions classiques
  async createTransaction(transactionData) {
    const response = await api.post('/transactions/add', transactionData);
    return response.data;
  },

  async getAllTransactions() {
    const response = await api.get('/transactions/all');
    return response.data;
  },

  async getBankTransactions(banqueId) {
    const response = await api.get(`/transactions/banque/${banqueId}`);
    return response.data;
  },

  async getTransactionsByType(transactionType) {
    const response = await api.get(`/transactions/by_type/${transactionType}`);
    return response.data;
  },

  async updateTransaction(transactionId, updates) {
    const response = await api.patch(`/transactions/${transactionId}`, updates);
    return response.data;
  },

  async deleteTransaction(transactionId) {
    const response = await api.delete(`/transactions/${transactionId}`);
    return response.data;
  },

  async exportTransactions() {
    const response = await api.get('/transactions/export');
    return response.data;
  },

  // Transactions par carte de crédit
  async createCreditCardTransaction(transactionData) {
    const response = await api.post('/credit_card_transactions/add', transactionData);
    return response.data;
  },

  async getAllCreditCardTransactions() {
    const response = await api.get('/credit_card_transactions/all');
    return response.data;
  },

  async updateCreditCardTransaction(transactionId, updates) {
    const response = await api.patch(`/credit_card_transactions/${transactionId}`, updates);
    return response.data;
  },

  async deleteCreditCardTransaction(transactionId) {
    const response = await api.delete(`/credit_card_transactions/${transactionId}`);
    return response.data;
  },

  async exportCreditCardTransactions() {
    const response = await api.get('/credit_card_transactions/export');
    return response.data;
  },
};