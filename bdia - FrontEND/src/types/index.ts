export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'analyst' | 'client';
  avatar?: string;
}

export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  timestamp: Date;
  fromAccount: string;
  toAccount: string;
  type: 'transfer' | 'payment' | 'withdrawal' | 'deposit';
  status: 'pending' | 'completed' | 'failed' | 'flagged';
  riskScore: number;
  fraudProbability: number;
  location?: string;
  deviceInfo?: string;
  features?: { [key: string]: number }; // Features PCA du dataset
}

export interface FraudAlert {
  id: string;
  transactionId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: string;
  description: string;
  timestamp: Date;
  status: 'open' | 'investigating' | 'resolved' | 'false_positive';
  assignedTo?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'analyst' | 'admin';
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
}

export interface RiskMetrics {
  totalTransactions: number;
  flaggedTransactions: number;
  falsePositives: number;
  truePositives: number;
  accuracy: number;
  precision: number;
  recall: number;
}

export interface MLModel {
  id: string;
  name: string;
  version: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  lastTrained: Date;
  status: 'active' | 'training' | 'inactive';
  features: string[];
}

export interface AnalyticsData {
  fraudTrends: { date: string; fraudCount: number; totalTransactions: number }[];
  riskDistribution: { risk: string; count: number }[];
  geographicData: { location: string; fraudCount: number; totalAmount: number }[];
  timePatterns: { hour: number; fraudCount: number }[];
}