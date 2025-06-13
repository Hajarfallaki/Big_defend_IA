import { useState, useEffect, useCallback } from 'react';
import {
  getTransactions,
  getAlerts,
  getRiskMetrics,
  updateAlertStatus,
  analyzeTransaction as analyzeTxn,
  healthCheck,
} from '../services/apiService';
import { wsService } from '../services/websocketService';
import { Transaction, FraudAlert, RiskMetrics } from '../types';
import { useAuth } from '../contexts/AuthContext';

export const useRealTimeData = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [alerts, setAlerts] = useState<FraudAlert[]>([]);
  const [riskMetrics, setRiskMetrics] = useState<RiskMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Load initial data
  const loadInitialData = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);

      const isHealthy = await healthCheck();

      if (isHealthy) {
        const banqueId = Number(user.id); // 🔁 ID réel depuis AuthContext

        const [txns, alts, metrics] = await Promise.all([
          getTransactions(banqueId),
          getAlerts(banqueId),
          getRiskMetrics(),
        ]);

        setTransactions(txns);
        setAlerts(alts);
        setRiskMetrics(metrics);
      } else {
        console.warn('Backend not available, using mock data');
        const { DataService } = await import('../services/dataService');
        const dataService = DataService.getInstance();
        await dataService.loadDataset();

        setTransactions(dataService.getTransactions());
        setAlerts(dataService.getAlerts());
        setRiskMetrics(dataService.getRiskMetrics());
      }
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // WebSocket events
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token || token.startsWith('mock_token')) {
      // Ne pas connecter WebSocket en mode mock
      loadInitialData();
      return;
    }

    const handleNewTransaction = (transaction: Transaction) => {
      setTransactions(prev => [transaction, ...prev.slice(0, 99)]);
    };

    const handleFraudAlert = (alert: FraudAlert) => {
      setAlerts(prev => [alert, ...prev]);
    };

    const handleRiskUpdate = (metrics: RiskMetrics) => {
      setRiskMetrics(metrics);
    };

    const handleConnected = () => setIsConnected(true);
    const handleDisconnected = () => setIsConnected(false);
    const handleError = (e: any) => {
      console.error('WebSocket error:', e);
      setIsConnected(false);
    };

    wsService.on('newTransaction', handleNewTransaction);
    wsService.on('fraudAlert', handleFraudAlert);
    wsService.on('riskUpdate', handleRiskUpdate);
    wsService.on('connected', handleConnected);
    wsService.on('disconnected', handleDisconnected);
    wsService.on('error', handleError);

    wsService.connect(token);
    loadInitialData();

    return () => {
      wsService.off('newTransaction', handleNewTransaction);
      wsService.off('fraudAlert', handleFraudAlert);
      wsService.off('riskUpdate', handleRiskUpdate);
      wsService.off('connected', handleConnected);
      wsService.off('disconnected', handleDisconnected);
      wsService.off('error', handleError);
      wsService.disconnect();
    };
  }, [loadInitialData]);

  const refreshData = useCallback(() => {
    loadInitialData();
  }, [loadInitialData]);

  const updateAlert = useCallback(async (alertId: string, status: string, assignedTo?: string) => {
    try {
      const updated = await updateAlertStatus(alertId, status, assignedTo);
      setAlerts(prev => prev.map(alert => (alert.id === alertId ? updated : alert)));
      return updated;
    } catch (err) {
      console.error('Error updating alert:', err);
      throw err;
    }
  }, []);

  const analyzeTransaction = useCallback(async (transactionId: string) => {
    try {
      const analysis = await analyzeTxn(transactionId);
      setTransactions(prev => prev.map(txn => (txn.id === transactionId ? { ...txn, ...analysis } : txn)));
      return analysis;
    } catch (err) {
      console.error('Error analyzing transaction:', err);
      throw err;
    }
  }, []);

  return {
    transactions,
    alerts,
    riskMetrics,
    loading,
    error,
    isConnected,
    refreshData,
    updateAlert,
    analyzeTransaction,
  };
};
