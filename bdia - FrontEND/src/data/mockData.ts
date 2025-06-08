import { Transaction, FraudAlert, Client, RiskMetrics } from '../types';

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    amount: 15000,
    currency: 'EUR',
    timestamp: new Date('2024-01-15T10:30:00'),
    fromAccount: 'ACC001',
    toAccount: 'ACC002',
    type: 'transfer',
    status: 'flagged',
    riskScore: 85,
    fraudProbability: 0.78,
    location: 'Paris, France',
    deviceInfo: 'Mobile App - iOS'
  },
  {
    id: '2',
    amount: 500,
    currency: 'EUR',
    timestamp: new Date('2024-01-15T14:20:00'),
    fromAccount: 'ACC003',
    toAccount: 'ACC004',
    type: 'payment',
    status: 'completed',
    riskScore: 25,
    fraudProbability: 0.12,
    location: 'Lyon, France',
    deviceInfo: 'Web Browser - Chrome'
  },
  {
    id: '3',
    amount: 25000,
    currency: 'EUR',
    timestamp: new Date('2024-01-15T16:45:00'),
    fromAccount: 'ACC005',
    toAccount: 'ACC006',
    type: 'transfer',
    status: 'flagged',
    riskScore: 92,
    fraudProbability: 0.89,
    location: 'Unknown',
    deviceInfo: 'Mobile App - Android'
  }
];

export const mockAlerts: FraudAlert[] = [
  {
    id: '1',
    transactionId: '1',
    severity: 'high',
    type: 'Unusual Amount',
    description: 'Transaction amount significantly higher than user\'s typical pattern',
    timestamp: new Date('2024-01-15T10:31:00'),
    status: 'investigating',
    assignedTo: 'analyst@bank.com'
  },
  {
    id: '2',
    transactionId: '3',
    severity: 'critical',
    type: 'Location Anomaly',
    description: 'Transaction from unrecognized location with high amount',
    timestamp: new Date('2024-01-15T16:46:00'),
    status: 'open'
  }
];

export const mockClients: Client[] = [
  {
    id: '1',
    name: 'Jean Dupont',
    email: 'jean.dupont@email.com',
    phone: '+33 1 23 45 67 89',
    accountNumber: 'ACC001',
    riskProfile: 'medium',
    joinDate: new Date('2020-03-15'),
    totalTransactions: 1250,
    flaggedTransactions: 3
  },
  {
    id: '2',
    name: 'Marie Martin',
    email: 'marie.martin@email.com',
    phone: '+33 1 98 76 54 32',
    accountNumber: 'ACC003',
    riskProfile: 'low',
    joinDate: new Date('2019-07-22'),
    totalTransactions: 890,
    flaggedTransactions: 0
  }
];

export const mockRiskMetrics: RiskMetrics = {
  totalTransactions: 125000,
  flaggedTransactions: 1250,
  falsePositives: 125,
  truePositives: 1125,
  accuracy: 0.94,
  precision: 0.90,
  recall: 0.89
};