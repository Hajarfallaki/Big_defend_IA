export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'analyst' | 'manager' | 'client';
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
  phone: string;
  accountNumber: string;
  riskProfile: 'low' | 'medium' | 'high';
  joinDate: Date;
  totalTransactions: number;
  flaggedTransactions: number;
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