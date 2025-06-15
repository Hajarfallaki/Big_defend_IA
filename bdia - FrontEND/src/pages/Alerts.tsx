import React, { useState } from 'react';
import { AlertTriangle, Clock, User, MapPin, Smartphone, Brain, Target } from 'lucide-react';
import { useDataset } from '../hooks/useDataset';

const Alerts: React.FC = () => {
  const { alerts, transactions, loading } = useDataset();
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement des alertes...</p>
        </div>
      </div>
    );
  }

  const filteredAlerts = alerts.filter(alert => {
    const severityMatch = selectedSeverity === 'all' || alert.severity === selectedSeverity;
    const statusMatch = selectedStatus === 'all' || alert.status === selectedStatus;
    return severityMatch && statusMatch;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'investigating': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'false_positive': return 'bg-slate-100 text-slate-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Alertes BigDefend AI</h1>
          <p className="text-slate-600 mt-1">Détection intelligente basée sur le dataset Kaggle</p>
        </div>
        <div className="flex gap-4">
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Toutes les sévérités</option>
            <option value="critical">Critique</option>
            <option value="high">Élevée</option>
            <option value="medium">Moyenne</option>
            <option value="low">Faible</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="open">Ouvert</option>
            <option value="investigating">En cours</option>
            <option value="resolved">Résolu</option>
            <option value="false_positive">Faux positif</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6">
        {filteredAlerts.map((alert) => {
          const transaction = transactions.find(t => t.id === alert.transactionId);
          
          return (
            <div key={alert.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">{alert.type}</h3>
                    <p className="text-slate-600">{alert.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getSeverityColor(alert.severity)}`}>
                    {alert.severity.toUpperCase()}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(alert.status)}`}>
                    {alert.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>

              {transaction && (
                <div className="bg-slate-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Brain className="h-5 w-5 text-purple-600" />
                    <h4 className="font-medium text-slate-800">Analyse BigDefend AI</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-slate-600">Montant Transaction</p>
                      <p className="font-semibold text-lg">{transaction.amount.toLocaleString()} {transaction.currency}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Score de Risque IA</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              transaction.riskScore >= 80 ? 'bg-red-500' :
                              transaction.riskScore >= 60 ? 'bg-orange-500' :
                              transaction.riskScore >= 40 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${transaction.riskScore}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{transaction.riskScore}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Probabilité de Fraude</p>
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-red-500" />
                        <p className="font-semibold text-red-600">{(transaction.fraudProbability * 100).toFixed(1)}%</p>
                      </div>
                    </div>
                  </div>

                  {transaction.features && Object.keys(transaction.features).length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-slate-600 mb-2">Features PCA Principales (Dataset Kaggle)</p>
                      <div className="grid grid-cols-4 gap-2">
                        {Object.entries(transaction.features).slice(0, 8).map(([key, value]) => (
                          <div key={key} className="text-xs bg-white p-2 rounded border">
                            <span className="font-mono text-slate-500">{key}:</span>
                            <span className="ml-1 font-medium">{value.toFixed(3)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-slate-500" />
                      <span className="text-sm">{transaction.location || 'Localisation inconnue'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4 text-slate-500" />
                      <span className="text-sm">{transaction.deviceInfo || 'Appareil inconnu'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-slate-500" />
                      <span className="text-sm">{transaction.timestamp.toLocaleString('fr-FR')}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{alert.timestamp.toLocaleString('fr-FR')}</span>
                  </div>
                  {alert.assignedTo && (
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>Assigné à {alert.assignedTo}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Brain className="h-4 w-4 text-purple-500" />
                    <span>BigDefend AI</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Analyser IA
                  </button>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    Résoudre
                  </button>
                  <button className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors">
                    Faux Positif
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredAlerts.length === 0 && (
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-800 mb-2">Aucune alerte trouvée</h3>
          <p className="text-slate-600">Aucune alerte ne correspond aux filtres sélectionnés.</p>
        </div>
      )}
    </div>
  );
};

export default Alerts;