import React from 'react';
import { 
  CreditCard, 
  AlertTriangle, 
  Users, 
  TrendingUp,
  Shield,
  Activity
} from 'lucide-react';
import StatCard from '../components/Dashboard/StatCard';
import AlertsOverview from '../components/Dashboard/AlertsOverview';
import TransactionChart from '../components/Dashboard/TransactionChart';
import { useAuth } from '../contexts/AuthContext';
import { mockRiskMetrics } from '../data/mockData';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const getStatsForRole = () => {
    switch (user?.role) {
      case 'admin':
        return [
          {
            title: 'Transactions Totales',
            value: '125,430',
            change: '+12% ce mois',
            changeType: 'positive' as const,
            icon: CreditCard,
            color: 'blue' as const
          },
          {
            title: 'Alertes Actives',
            value: '23',
            change: '-8% cette semaine',
            changeType: 'positive' as const,
            icon: AlertTriangle,
            color: 'red' as const
          },
          {
            title: 'Clients Surveillés',
            value: '1,247',
            change: '+5% ce mois',
            changeType: 'positive' as const,
            icon: Users,
            color: 'green' as const
          },
          {
            title: 'Précision du Modèle',
            value: '94.2%',
            change: '+2.1% ce mois',
            changeType: 'positive' as const,
            icon: TrendingUp,
            color: 'purple' as const
          }
        ];
      case 'analyst':
        return [
          {
            title: 'Alertes Assignées',
            value: '8',
            change: '3 nouvelles',
            changeType: 'neutral' as const,
            icon: AlertTriangle,
            color: 'red' as const
          },
          {
            title: 'Cas Résolus',
            value: '156',
            change: '+15 cette semaine',
            changeType: 'positive' as const,
            icon: Shield,
            color: 'green' as const
          },
          {
            title: 'Taux de Précision',
            value: '96.8%',
            change: 'Personnel',
            changeType: 'positive' as const,
            icon: TrendingUp,
            color: 'blue' as const
          }
        ];
      case 'manager':
        return [
          {
            title: 'Risque Global',
            value: 'Modéré',
            change: 'Stable',
            changeType: 'neutral' as const,
            icon: Shield,
            color: 'yellow' as const
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
            title: 'Performance',
            value: '94.2%',
            change: '+1.5% ce mois',
            changeType: 'positive' as const,
            icon: Activity,
            color: 'purple' as const
          }
        ];
      case 'client':
        return [
          {
            title: 'Mes Transactions',
            value: '47',
            change: 'Ce mois',
            changeType: 'neutral' as const,
            icon: CreditCard,
            color: 'blue' as const
          },
          {
            title: 'Statut Sécurité',
            value: 'Sécurisé',
            change: 'Aucune alerte',
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
        <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
        <div className="text-sm text-slate-600">
          Dernière mise à jour: {new Date().toLocaleString('fr-FR')}
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

      {user?.role === 'manager' && (
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Métriques de Performance</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{mockRiskMetrics.accuracy * 100}%</div>
                <div className="text-sm text-slate-600">Précision</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{mockRiskMetrics.precision * 100}%</div>
                <div className="text-sm text-slate-600">Précision</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{mockRiskMetrics.recall * 100}%</div>
                <div className="text-sm text-slate-600">Rappel</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{mockRiskMetrics.falsePositives}</div>
                <div className="text-sm text-slate-600">Faux Positifs</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {user?.role === 'client' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Activité Récente</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Paiement autorisé</p>
                  <p className="text-sm text-slate-600">Achat en ligne - 89.99€</p>
                </div>
              </div>
              <span className="text-sm text-slate-500">Il y a 2h</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Virement effectué</p>
                  <p className="text-sm text-slate-600">Vers compte épargne - 500€</p>
                </div>
              </div>
              <span className="text-sm text-slate-500">Hier</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;