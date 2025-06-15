import React, { useState } from 'react';
import { CreditCard, MapPin, Smartphone, Clock, AlertTriangle, Brain, Target, TrendingUp } from 'lucide-react';
import { useDataset } from '../hooks/useDataset';

const Transactions: React.FC = () => {
  const { transactions, loading } = useDataset();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<string>('all');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement des transactions...</p>
        </div>
      </div>
    );
  }

  const filteredTransactions = transactions.filter(transaction => {
    const statusMatch = selectedStatus === 'all' || transaction.status === selectedStatus;
    const typeMatch = selectedType === 'all' || transaction.type === selectedType;
    
    let riskMatch = true;
    if (selectedRiskLevel !== 'all') {
      switch (selectedRiskLevel) {
        case 'low':
          riskMatch = transaction.riskScore < 40;
          break;
        case 'medium':
          riskMatch = transaction.riskScore >= 40 && transaction.riskScore < 70;
          break;
        case 'high':
          riskMatch = transaction.riskScore >= 70 && transaction.riskScore < 85;
          break;
        case 'critical':
          riskMatch = transaction.riskScore >= 85;
          break;
      }
    }
    
    return statusMatch && typeMatch && riskMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'flagged': return 'bg-orange-100 text-orange-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getRiskColor = (riskScore: number) => {
    if (riskScore >= 85) return 'text-red-600';
    if (riskScore >= 70) return 'text-orange-600';
    if (riskScore >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getRiskLevel = (riskScore: number) => {
    if (riskScore >= 85) return 'CRITIQUE';
    if (riskScore >= 70) return 'ÉLEVÉ';
    if (riskScore >= 40) return 'MOYEN';
    return 'FAIBLE';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Transactions BigDefend AI</h1>
          <p className="text-slate-600 mt-1">Analyse en temps réel avec dataset Kaggle • {transactions.length.toLocaleString()} transactions</p>
        </div>
        <div className="flex gap-4">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="completed">Complétée</option>
            <option value="pending">En attente</option>
            <option value="failed">Échouée</option>
            <option value="flagged">Signalée</option>
          </select>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous les types</option>
            <option value="transfer">Virement</option>
            <option value="payment">Paiement</option>
            <option value="withdrawal">Retrait</option>
            <option value="deposit">Dépôt</option>
          </select>
          <select
            value={selectedRiskLevel}
            onChange={(e) => setSelectedRiskLevel(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous les niveaux</option>
            <option value="low">Risque Faible</option>
            <option value="medium">Risque Moyen</option>
            <option value="high">Risque Élevé</option>
            <option value="critical">Risque Critique</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-slate-800">Transaction</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-800">Montant</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-800">Type</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-800">Statut</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-800">Risque IA</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-800">Fraude %</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-800">Date</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-800">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredTransactions.slice(0, 50).map((transaction) => (
                <tr key={transaction.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-slate-500" />
                      <div>
                        <p className="font-medium text-slate-800">#{transaction.id}</p>
                        <p className="text-sm text-slate-600">
                          {transaction.fromAccount} → {transaction.toAccount}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-semibold text-lg">
                      {transaction.amount.toLocaleString()} {transaction.currency}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="capitalize text-slate-700">{transaction.type}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(transaction.status)}`}>
                      {transaction.status === 'flagged' ? 'Signalée' : 
                       transaction.status === 'completed' ? 'Complétée' :
                       transaction.status === 'pending' ? 'En attente' : 'Échouée'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-200 rounded-full h-2 w-16">
                        <div 
                          className={`h-2 rounded-full ${
                            transaction.riskScore >= 85 ? 'bg-red-500' :
                            transaction.riskScore >= 70 ? 'bg-orange-500' :
                            transaction.riskScore >= 40 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${transaction.riskScore}%` }}
                        ></div>
                      </div>
                      <div className="text-right">
                        <span className={`text-sm font-medium ${getRiskColor(transaction.riskScore)}`}>
                          {transaction.riskScore}%
                        </span>
                        <p className="text-xs text-slate-500">{getRiskLevel(transaction.riskScore)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-1">
                      <Target className="h-4 w-4 text-red-500" />
                      <span className="font-medium text-red-600">
                        {(transaction.fraudProbability * 100).toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-1 text-sm text-slate-600">
                      <Clock className="h-4 w-4" />
                      <span>{transaction.timestamp.toLocaleDateString('fr-FR')}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
                        Analyser
                      </button>
                      {transaction.status === 'flagged' && (
                        <button className="px-3 py-1 bg-orange-600 text-white text-sm rounded hover:bg-orange-700 transition-colors">
                          <AlertTriangle className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cartes détaillées pour les transactions à haut risque */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTransactions
          .filter(t => t.riskScore >= 70)
          .slice(0, 6)
          .map((transaction) => (
          <div key={`detail-${transaction.id}`} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800">Transaction #{transaction.id}</h3>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                  {transaction.status}
                </span>
                <Brain className="h-4 w-4 text-purple-600" />
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Montant</span>
                <span className="font-semibold">{transaction.amount.toLocaleString()} €</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Score Risque IA</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-slate-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        transaction.riskScore >= 85 ? 'bg-red-500' :
                        transaction.riskScore >= 70 ? 'bg-orange-500' : 'bg-yellow-500'
                      }`}
                      style={{ width: `${transaction.riskScore}%` }}
                    ></div>
                  </div>
                  <span className={`text-sm font-medium ${getRiskColor(transaction.riskScore)}`}>
                    {transaction.riskScore}%
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-slate-500" />
                <span>{transaction.location || 'Localisation inconnue'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Smartphone className="h-4 w-4 text-slate-500" />
                <span>{transaction.deviceInfo || 'Appareil inconnu'}</span>
              </div>
              
              <div className="pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Target className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-slate-600">Probabilité fraude</span>
                  </div>
                  <span className="text-lg font-semibold text-red-600">
                    {(transaction.fraudProbability * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              {transaction.features && Object.keys(transaction.features).length > 0 && (
                <div className="pt-2 border-t border-slate-200">
                  <div className="flex items-center gap-1 mb-2">
                    <TrendingUp className="h-4 w-4 text-purple-500" />
                    <span className="text-sm text-slate-600">Features PCA</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    {Object.entries(transaction.features).slice(0, 4).map(([key, value]) => (
                      <div key={key} className="bg-slate-50 p-1 rounded">
                        <span className="font-mono text-slate-500">{key}:</span>
                        <span className="ml-1">{value.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredTransactions.length === 0 && (
        <div className="text-center py-12">
          <CreditCard className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-800 mb-2">Aucune transaction trouvée</h3>
          <p className="text-slate-600">Aucune transaction ne correspond aux filtres sélectionnés.</p>
        </div>
      )}
    </div>
  );
};

export default Transactions;