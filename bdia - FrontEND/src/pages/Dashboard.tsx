import React from 'react';
import { 
  CreditCard, 
  AlertTriangle, 
  Users, 
  TrendingUp,
  Shield,
  Activity,
  Brain
} from 'lucide-react';
import StatCard from '../components/Dashboard/StatCard';
import AlertsOverview from '../components/Dashboard/AlertsOverview';
import TransactionChart from '../components/Dashboard/TransactionChart';
import MLInsights from '../components/Dashboard/MLInsights';
import RealTimeChart from '../components/Dashboard/RealTimeChart';
import { useAuth } from '../contexts/AuthContext';
import { useDataset } from '../hooks/useDataset';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { transactions, alerts, riskMetrics, loading, error } = useDataset();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement du dataset BigDefend AI...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  const getStatsForRole = () => {
    const totalTransactions = transactions.length;
    const flaggedTransactions = transactions.filter(t => t.status === 'flagged').length;
    const activeAlerts = alerts.filter(a => a.status === 'open' || a.status === 'investigating').length;
    const avgRiskScore = transactions.reduce((sum, t) => sum + t.riskScore, 0) / totalTransactions;

    switch (user?.role) {
      case 'admin':
        return [
          {
            title: 'Transactions Analysées',
            value: totalTransactions.toLocaleString(),
            change: 'Dataset Kaggle',
            changeType: 'neutral' as const,
            icon: CreditCard,
            color: 'blue' as const
          },
          {
            title: 'Fraudes Détectées',
            value: flaggedTransactions.toString(),
            change: `${((flaggedTransactions / totalTransactions) * 100).toFixed(2)}% du total`,
            changeType: 'negative' as const,
            icon: AlertTriangle,
            color: 'red' as const
          },
          {
            title: 'Alertes Actives',
            value: activeAlerts.toString(),
            change: 'Nécessitent attention',
            changeType: 'neutral' as const,
            icon: Users,
            color: 'yellow' as const
          },
          {
            title: 'Score Risque Moyen',
            value: `${avgRiskScore.toFixed(1)}%`,
            change: `Précision: ${riskMetrics ? (riskMetrics.accuracy * 100).toFixed(1) : 'N/A'}%`,
            changeType: 'positive' as const,
            icon: Brain,
            color: 'purple' as const
          }
        ];
      case 'analyst':
        const assignedAlerts = alerts.filter(a => a.assignedTo?.includes('analyst')).length;
        const resolvedToday = Math.floor(Math.random() * 10) + 5;
        return [
          {
            title: 'Alertes Assignées',
            value: assignedAlerts.toString(),
            change: 'À traiter',
            changeType: 'neutral' as const,
            icon: AlertTriangle,
            color: 'red' as const
          },
          {
            title: 'Cas Résolus Aujourd\'hui',
            value: resolvedToday.toString(),
            change: '+3 depuis hier',
            changeType: 'positive' as const,
            icon: Shield,
            color: 'green' as const
          },
          {
            title: 'Précision Personnelle',
            value: '96.8%',
            change: 'Au-dessus de la moyenne',
            changeType: 'positive' as const,
            icon: TrendingUp,
            color: 'blue' as const
          }
        ];
      case 'manager':
        return [
          {
            title: 'Performance Globale',
            value: riskMetrics ? `${(riskMetrics.accuracy * 100).toFixed(1)}%` : 'N/A',
            change: 'Modèle BigDefend AI',
            changeType: 'positive' as const,
            icon: Brain,
            color: 'purple' as const
          },
          {
            title: 'Équipe Active',
            value: '12',
            change: '100% disponible',
            changeType: 'positive' as const,
            icon: Users,
            color: 'green' as const
          },
          {
            title: 'Taux de Faux Positifs',
            value: riskMetrics ? `${((riskMetrics.falsePositives / riskMetrics.flaggedTransactions) * 100).toFixed(1)}%` : 'N/A',
            change: 'En amélioration',
            changeType: 'positive' as const,
            icon: Activity,
            color: 'yellow' as const
          }
        ];
      case 'client':
        const userTransactions = Math.floor(Math.random() * 20) + 30;
        return [
          {
            title: 'Mes Transactions',
            value: userTransactions.toString(),
            change: 'Ce mois',
            changeType: 'neutral' as const,
            icon: CreditCard,
            color: 'blue' as const
          },
          {
            title: 'Statut Sécurité',
            value: 'Sécurisé',
            change: 'BigDefend AI actif',
            changeType: 'positive' as const,
            icon: Shield,
            color: 'green' as const
          }
        ];
      default:
        return [];
    }
  };

  const stats = getStatsForRole();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">BigDefend AI Dashboard</h1>
          <p className="text-slate-600 mt-1">Système de détection de fraude alimenté par l'IA</p>
        </div>
        <div className="text-sm text-slate-600">
          Dataset: {transactions.length.toLocaleString()} transactions • Dernière mise à jour: {new Date().toLocaleString('fr-FR')}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {(user?.role === 'admin' || user?.role === 'analyst') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TransactionChart />
          <AlertsOverview />
        </div>
      )}

      {user?.role === 'admin' && riskMetrics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MLInsights riskMetrics={riskMetrics} />
          <div className="space-y-6">
            <RealTimeChart transactions={transactions} />
          </div>
        </div>
      )}

      {user?.role === 'manager' && riskMetrics && (
        <div className="grid grid-cols-1 gap-6">
          <MLInsights riskMetrics={riskMetrics} />
          <RealTimeChart transactions={transactions} />
        </div>
      )}

      {user?.role === 'client' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Protection BigDefend AI</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Protection Active</p>
                  <p className="text-sm text-slate-600">Surveillance 24/7 par IA</p>
                </div>
              </div>
              <Shield className="h-5 w-5 text-green-500" />
            </div>
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Analyse Comportementale</p>
                  <p className="text-sm text-slate-600">Détection des anomalies en temps réel</p>
                </div>
              </div>
              <Brain className="h-5 w-5 text-blue-500" />
            </div>
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Modèle ML Avancé</p>
                  <p className="text-sm text-slate-600">Précision de {riskMetrics ? (riskMetrics.accuracy * 100).toFixed(1) : '94'}%</p>
                </div>
              </div>
              <TrendingUp className="h-5 w-5 text-purple-500" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;