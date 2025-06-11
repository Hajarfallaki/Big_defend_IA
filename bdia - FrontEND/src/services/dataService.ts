import { Transaction, FraudAlert, RiskMetrics } from '../types';

// Service pour charger et traiter les données du dataset
export class DataService {
  private static instance: DataService;
  private transactions: Transaction[] = [];
  private alerts: FraudAlert[] = [];
  private isLoaded = false;

  static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  async loadDataset(): Promise<void> {
    if (this.isLoaded) return;

    try {
      // Charger le dataset depuis GitHub
      const response = await fetch('https://github.com/nsethi31/Kaggle-Data-Credit-Card-Fraud-Detection/raw/master/creditcard.csv');
      const csvText = await response.text();
      
      // Parser le CSV
      const lines = csvText.split('\n');
      const headers = lines[0].split(',');
      
      // Prendre un échantillon des données pour la démo (1000 transactions)
      const sampleSize = Math.min(1000, lines.length - 1);
      const sampleLines = lines.slice(1, sampleSize + 1);
      
      this.transactions = sampleLines
        .filter(line => line.trim())
        .map((line, index) => this.parseTransaction(line, index, headers));
      
      // Générer les alertes basées sur les fraudes détectées
      this.generateAlerts();
      
      this.isLoaded = true;
    } catch (error) {
      console.error('Erreur lors du chargement du dataset:', error);
      // Fallback vers les données mockées
      this.loadMockData();
    }
  }

  private parseTransaction(line: string, index: number, headers: string[]): Transaction {
    const values = line.split(',');
    const data: { [key: string]: number } = {};
    
    headers.forEach((header, i) => {
      data[header.replace(/"/g, '')] = parseFloat(values[i]) || 0;
    });

    const time = data['Time'] || 0;
    const amount = data['Amount'] || 0;
    const isFraud = data['Class'] === 1;
    
    // Calculer le score de risque basé sur les features PCA et le montant
    const riskScore = this.calculateRiskScore(data, amount, isFraud);
    
    // Générer une date basée sur le temps
    const timestamp = new Date(Date.now() - (Math.max(...this.transactions.map(t => parseFloat(t.id) || 0)) - time) * 1000);
    
    return {
      id: (index + 1).toString(),
      amount: Math.round(amount * 100) / 100,
      currency: 'EUR',
      timestamp,
      fromAccount: `ACC${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`,
      toAccount: `ACC${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`,
      type: this.getTransactionType(amount),
      status: isFraud ? 'flagged' : (Math.random() > 0.95 ? 'pending' : 'completed'),
      riskScore,
      fraudProbability: isFraud ? Math.random() * 0.3 + 0.7 : Math.random() * 0.4,
      location: this.generateLocation(),
      deviceInfo: this.generateDeviceInfo(),
      features: this.extractFeatures(data)
    };
  }

  private calculateRiskScore(data: { [key: string]: number }, amount: number, isFraud: boolean): number {
    if (isFraud) {
      return Math.floor(Math.random() * 20) + 80; // 80-100 pour les fraudes
    }
    
    // Calculer le score basé sur les features PCA et le montant
    let score = 0;
    
    // Utiliser quelques features PCA importantes
    const v1 = Math.abs(data['V1'] || 0);
    const v2 = Math.abs(data['V2'] || 0);
    const v3 = Math.abs(data['V3'] || 0);
    const v4 = Math.abs(data['V4'] || 0);
    
    score += Math.min(v1 * 10, 25);
    score += Math.min(v2 * 8, 20);
    score += Math.min(v3 * 6, 15);
    score += Math.min(v4 * 5, 10);
    
    // Facteur montant
    if (amount > 1000) score += 15;
    else if (amount > 500) score += 10;
    else if (amount > 100) score += 5;
    
    return Math.min(Math.max(Math.floor(score), 0), 79); // 0-79 pour les non-fraudes
  }

  private extractFeatures(data: { [key: string]: number }): { [key: string]: number } {
    const features: { [key: string]: number } = {};
    for (let i = 1; i <= 28; i++) {
      const key = `V${i}`;
      if (data[key] !== undefined) {
        features[key] = Math.round(data[key] * 1000) / 1000;
      }
    }
    return features;
  }

  private getTransactionType(amount: number): 'transfer' | 'payment' | 'withdrawal' | 'deposit' {
    if (amount > 1000) return 'transfer';
    if (amount > 500) return Math.random() > 0.5 ? 'transfer' : 'withdrawal';
    if (amount > 100) return 'payment';
    return Math.random() > 0.5 ? 'payment' : 'withdrawal';
  }

  private generateLocation(): string {
    const locations = [
      'Paris, France', 'Lyon, France', 'Marseille, France', 'Toulouse, France',
      'Nice, France', 'Nantes, France', 'Strasbourg, France', 'Montpellier, France',
      'Bordeaux, France', 'Lille, France', 'Rennes, France', 'Reims, France',
      'London, UK', 'Berlin, Germany', 'Madrid, Spain', 'Rome, Italy',
      'Unknown', 'VPN Location', 'Proxy Server'
    ];
    return locations[Math.floor(Math.random() * locations.length)];
  }

  private generateDeviceInfo(): string {
    const devices = [
      'Mobile App - iOS', 'Mobile App - Android', 'Web Browser - Chrome',
      'Web Browser - Firefox', 'Web Browser - Safari', 'Web Browser - Edge',
      'ATM Terminal', 'POS Terminal', 'Unknown Device'
    ];
    return devices[Math.floor(Math.random() * devices.length)];
  }

  private generateAlerts(): void {
    const fraudulentTransactions = this.transactions.filter(t => t.status === 'flagged');
    
    this.alerts = fraudulentTransactions.map((transaction, index) => {
      const severity = this.getSeverityFromRiskScore(transaction.riskScore);
      const alertType = this.getAlertType(transaction);
      
      return {
        id: (index + 1).toString(),
        transactionId: transaction.id,
        severity,
        type: alertType,
        description: this.getAlertDescription(alertType, transaction),
        timestamp: new Date(transaction.timestamp.getTime() + Math.random() * 60000),
        status: Math.random() > 0.7 ? 'investigating' : 'open',
        assignedTo: Math.random() > 0.5 ? 'analyst@bigdefend.com' : undefined
      };
    });
  }

  private getSeverityFromRiskScore(riskScore: number): 'low' | 'medium' | 'high' | 'critical' {
    if (riskScore >= 95) return 'critical';
    if (riskScore >= 85) return 'high';
    if (riskScore >= 70) return 'medium';
    return 'low';
  }

  private getAlertType(transaction: Transaction): string {
    const types = [
      'Anomalie de Montant',
      'Pattern Suspect',
      'Localisation Inhabituelle',
      'Fréquence Anormale',
      'Signature Comportementale',
      'Analyse PCA Suspecte',
      'Score ML Élevé'
    ];
    
    if (transaction.amount > 1000) return 'Anomalie de Montant';
    if (transaction.location?.includes('Unknown') || transaction.location?.includes('VPN')) {
      return 'Localisation Inhabituelle';
    }
    
    return types[Math.floor(Math.random() * types.length)];
  }

  private getAlertDescription(type: string, transaction: Transaction): string {
    const descriptions: { [key: string]: string } = {
      'Anomalie de Montant': `Transaction de ${transaction.amount}€ significativement supérieure aux patterns habituels`,
      'Pattern Suspect': 'Comportement de transaction inhabituel détecté par l\'analyse ML',
      'Localisation Inhabituelle': `Transaction depuis ${transaction.location} - localisation non reconnue`,
      'Fréquence Anormale': 'Fréquence de transactions anormalement élevée détectée',
      'Signature Comportementale': 'Signature comportementale ne correspondant pas au profil utilisateur',
      'Analyse PCA Suspecte': 'Les composantes principales indiquent un pattern frauduleux',
      'Score ML Élevé': `Score de fraude ML de ${(transaction.fraudProbability * 100).toFixed(1)}% détecté`
    };
    
    return descriptions[type] || 'Activité suspecte détectée par le système BigDefend AI';
  }

  private loadMockData(): void {
    // Données de fallback si le dataset ne peut pas être chargé
    this.transactions = [
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
        deviceInfo: 'Mobile App - iOS',
        features: {}
      }
    ];
    
    this.alerts = [
      {
        id: '1',
        transactionId: '1',
        severity: 'high',
        type: 'Anomalie de Montant',
        description: 'Transaction amount significantly higher than user\'s typical pattern',
        timestamp: new Date('2024-01-15T10:31:00'),
        status: 'investigating',
        assignedTo: 'analyst@bigdefend.com'
      }
    ];
  }

  getTransactions(): Transaction[] {
    return this.transactions;
  }

  getAlerts(): FraudAlert[] {
    return this.alerts;
  }

  getRiskMetrics(): RiskMetrics {
    const totalTransactions = this.transactions.length;
    const flaggedTransactions = this.transactions.filter(t => t.status === 'flagged').length;
    const completedTransactions = this.transactions.filter(t => t.status === 'completed').length;
    
    // Simuler des métriques basées sur les données réelles
    const truePositives = Math.floor(flaggedTransactions * 0.85); // 85% de vrais positifs
    const falsePositives = flaggedTransactions - truePositives;
    
    return {
      totalTransactions,
      flaggedTransactions,
      falsePositives,
      truePositives,
      accuracy: 0.94,
      precision: truePositives / flaggedTransactions,
      recall: truePositives / (truePositives + Math.floor(completedTransactions * 0.02))
    };
  }

  // Méthodes d'analyse avancée
  getTransactionsByTimeRange(startDate: Date, endDate: Date): Transaction[] {
    return this.transactions.filter(t => 
      t.timestamp >= startDate && t.timestamp <= endDate
    );
  }

  getHighRiskTransactions(threshold: number = 70): Transaction[] {
    return this.transactions.filter(t => t.riskScore >= threshold);
  }

  getFraudPatterns(): { pattern: string; count: number; avgRisk: number }[] {
    const patterns = new Map<string, { count: number; totalRisk: number }>();
    
    this.transactions.filter(t => t.status === 'flagged').forEach(t => {
      const key = `${t.type}-${this.getRiskCategory(t.riskScore)}`;
      const existing = patterns.get(key) || { count: 0, totalRisk: 0 };
      patterns.set(key, {
        count: existing.count + 1,
        totalRisk: existing.totalRisk + t.riskScore
      });
    });
    
    return Array.from(patterns.entries()).map(([pattern, data]) => ({
      pattern,
      count: data.count,
      avgRisk: Math.round(data.totalRisk / data.count)
    }));
  }

  private getRiskCategory(riskScore: number): string {
    if (riskScore >= 80) return 'Très Élevé';
    if (riskScore >= 60) return 'Élevé';
    if (riskScore >= 40) return 'Moyen';
    return 'Faible';
  }
}