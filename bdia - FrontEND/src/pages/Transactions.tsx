import React, { useState } from 'react';
import { CreditCard, MapPin, Smartphone, Clock, AlertTriangle } from 'lucide-react';
import { mockTransactions } from '../data/mockData';

const Transactions: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredTransactions = mockTransactions.filter(transaction => {
    const statusMatch = selectedStatus === 'all' || transaction.status === selectedStatus;
    const typeMatch = selectedType === 'all' || transaction.type === selectedType;
    return statusMatch && typeMatch;
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
    if (riskScore >= 80) return 'text-red-600';
    if (riskScore >= 60) return 'text-orange-600';
    if (riskScore >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800">Transactions</h1>
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
                <th className="text-left py-4 px-6 font-semibold text-slate-800">Risque</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-800">Date</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-800">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredTransactions.map((transaction) => (
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
                            transaction.riskScore >= 80 ? 'bg-red-500' :
                            transaction.riskScore >= 60 ? 'bg-orange-500' :
                            transaction.riskScore >= 40 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${transaction.riskScore}%` }}
                        ></div>
                      </div>
                      <span className={`text-sm font-medium ${getRiskColor(transaction.riskScore)}`}>
                        {transaction.riskScore}%
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
                        Détails
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {filteredTransactions.slice(0, 3).map((transaction) => (
          <div key={`detail-${transaction.id}`} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800">Transaction #{transaction.id}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                {transaction.status}
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-slate-500" />
                <span>{transaction.location || 'Localisation inconnue'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Smartphone className="h-4 w-4 text-slate-500" />
                <span>{transaction.deviceInfo || 'Appareil inconnu'}</span>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <p className="text-sm text-slate-600">Probabilité de fraude</p>
                <p className="text-lg font-semibold text-red-600">
                  {(transaction.fraudProbability * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Transactions;