import { useState, useEffect } from 'react';
import { useRealTimeData } from './useRealTimeData';
import { Transaction, FraudAlert, RiskMetrics } from '../types';

export const useDataset = () => {
  const {
    transactions,
    alerts,
    riskMetrics,
    loading,
    error,
    isConnected,
    refreshData,
    updateAlert,
    analyzeTransaction,
  } = useRealTimeData();

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