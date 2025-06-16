export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'analyst' | 'client';
  avatar?: string;
  token?: string; // Ajout du token optionnel
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

export interface TransactionInput {
  // Identifiants uniques
  transaction_id: string;
  user_id: string;
  bank_id?: string;  // Optionnel selon votre implémentation

  // Données financières
  transaction_amount: number;
  account_balance: number;
  previous_transactions_count: number;
  average_transaction_amount: number;

  // Métadonnées transactionnelles
  transaction_category: 'purchase' | 'withdrawal' | 'transfer' | 'deposit';
  transaction_currency: string;
  transaction_date: string; // Format ISO 8601

  // Comportement utilisateur
  is_new_user: boolean;
  days_since_account_creation: number;
  transaction_frequency: 'low' | 'medium' | 'high';

  // Données géospatiales
  ip_address?: string;
  location_code?: string;
  device_id?: string;

  // Features calculées (optionnelles - peuvent être calculées côté backend)
  amount_to_balance_ratio?: number;
  is_high_value?: boolean;
  is_unusual_time?: boolean;
  is_foreign_transaction?: boolean;

  // Champs spécifiques aux modèles
  model_features?: { 
    [key: string]: number | boolean | string;
  };
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
  // Métriques de performance du modèle
  accuracy: number;               // Exactitude globale (0-1)
  precision: number;              // Précision (0-1)
  recall: number;                 // Rappel (0-1)
  f1Score?: number;               // Score F1 (calculable)
  
  // Statistiques transactionnelles
  totalTransactions: number;      // Nombre total analysé
  flaggedTransactions: number;    // Transactions marquées comme frauduleuses
  falsePositives: number;         // Faux positifs
  truePositives: number;          // Vrais positifs
  falseNegatives?: number;        // Faux négatifs (optionnel)
  
  // Temps d'exécution
  lastUpdated: string;            // Date ISO de la dernière mise à jour
  processingTimeMs?: number;      // Temps de traitement moyen
  
  // Informations sur le modèle
  modelVersion: string;           // Version du modèle utilisé
  featuresUsed: string[];         // Liste des features analysées
  
  // Taux calculés
  fraudRate?: number;             // Taux de fraude (flagged/total)
  falsePositiveRate?: number;     // Taux faux positifs
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