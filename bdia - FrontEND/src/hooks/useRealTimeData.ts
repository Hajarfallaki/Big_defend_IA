import { useState, useEffect, useCallback, useMemo } from 'react';
import { wsService } from '../services/websocketService';
import { ApiService } from '../services/apiService';
import { 
  Transaction, 
  FraudAlert, 
  RiskMetrics,
  User
} from '../types';
import { useAuth } from '../contexts/AuthContext';

export const useRealTimeData = () => {
  const { user } = useAuth() as { user: User & { token?: string } };
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [alerts, setAlerts] = useState<FraudAlert[]>([]);
  const [riskMetrics, setRiskMetrics] = useState<RiskMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Charge les données initiales
  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [txns, alrts, metrics] = await Promise.all([
        ApiService.transactions.getAll(),
        ApiService.alerts.getAll(),
        ApiService.metrics.getRiskMetrics()
      ]);

      setTransactions(txns);
      setAlerts(alrts);
      setRiskMetrics(metrics);
    } catch (err) {
      console.error('Failed to load initial data:', err);
      setError('Failed to load initial data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Gestion des événements WebSocket
  useEffect(() => {
    if (!user?.token) return;

    const handleNewTransaction = (txn: Transaction) => {
      setTransactions(prev => [txn, ...prev.slice(0, 99)]);
    };

    const handleNewAlert = (alert: FraudAlert) => {
      setAlerts(prev => [alert, ...prev]);
    };

    const handleMetricsUpdate = (metrics: RiskMetrics) => {
      setRiskMetrics(metrics);
    };

    const handleConnectionChange = (connected: boolean) => {
      setIsConnected(connected);
    };

    // Configuration WebSocket
    wsService.connect(user.token);

    // Abonnements aux événements
    const cleanups = [
      wsService.on('newTransaction', handleNewTransaction),
      wsService.on('fraudAlert', handleNewAlert),
      wsService.on('riskUpdate', handleMetricsUpdate),
      wsService.on('connected', () => handleConnectionChange(true)),
      wsService.on('disconnected', () => handleConnectionChange(false))
    ];

    // Chargement initial
    loadInitialData();

    // Nettoyage
    return () => {
      cleanups.forEach(cleanup => cleanup());
      wsService.disconnect();
    };
  }, [user?.token, loadInitialData]);

  // Met à jour le statut d'une alerte
  const updateAlertStatus = useCallback(async (alertId: string, status: string) => {
    try {
      const updatedAlert = await ApiService.alerts.updateStatus(alertId, status);
      setAlerts(prev => 
        prev.map(alert => alert.id === alertId ? updatedAlert : alert)
      );
      return updatedAlert;
    } catch (err) {
      console.error('Failed to update alert:', err);
      throw err;
    }
  }, []);

  // Analyse une transaction
  const analyzeTransaction = useCallback(async (transactionId: string) => {
    try {
      const result = await ApiService.transactions.analyze(transactionId);
      setTransactions(prev =>
        prev.map(txn => txn.id === transactionId ? { ...txn, ...result } : txn)
      );
      return result;
    } catch (err) {
      console.error('Failed to analyze transaction:', err);
      throw err;
    }
  }, []);

  // Valeurs retournées par le hook
  return useMemo(() => ({
    transactions,
    alerts,
    riskMetrics,
    loading,
    error,
    isConnected,
    refreshData: loadInitialData,
    updateAlertStatus,
    analyzeTransaction
  }), [
    transactions,
    alerts,
    riskMetrics,
    loading,
    error,
    isConnected,
    loadInitialData,
    updateAlertStatus,
    analyzeTransaction
  ]);
};