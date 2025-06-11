import { useState, useEffect } from 'react';
import { DataService } from '../services/dataService';
import { Transaction, FraudAlert, RiskMetrics } from '../types';

export const useDataset = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [alerts, setAlerts] = useState<FraudAlert[]>([]);
  const [riskMetrics, setRiskMetrics] = useState<RiskMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const dataService = DataService.getInstance();
        
        await dataService.loadDataset();
        
        setTransactions(dataService.getTransactions());
        setAlerts(dataService.getAlerts());
        setRiskMetrics(dataService.getRiskMetrics());
        
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement des données');
        console.error('Erreur dataset:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const refreshData = async () => {
    const dataService = DataService.getInstance();
    setTransactions(dataService.getTransactions());
    setAlerts(dataService.getAlerts());
    setRiskMetrics(dataService.getRiskMetrics());
  };

  return {
    transactions,
    alerts,
    riskMetrics,
    loading,
    error,
    refreshData
  };
};