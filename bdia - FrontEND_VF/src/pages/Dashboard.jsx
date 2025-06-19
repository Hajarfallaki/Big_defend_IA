import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  AlertTriangle, 
  Users, 
  TrendingUp,
  Activity,
  Shield,
  Eye,
  Download
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import StatsCard from '../components/StatsCard';
import TransactionCard from '../components/TransactionCard';
import AlertCard from '../components/AlertCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { transactionService } from '../services/transactionService';
import { alertService } from '../services/alertService';
import { userService } from '../services/userService';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuthStore();
  const [data, setData] = useState({
    transactions: [],
    alerts: [],
    users: [],
  });
  const [stats, setStats] = useState({
    totalTransactions: 0,
    fraudTransactions: 0,
    activeAlerts: 0,
    totalUsers: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const promises = [];

      // Load transactions based on user role
      if (user?.role === 'client_banque') {
        promises.push(transactionService.getBankTransactions(user.id || 1));
      } else {
        promises.push(transactionService.getAllTransactions());
      }

      // Load alerts
      if (user?.role === 'client_banque') {
        promises.push(alertService.getBankAlerts(user.id || 1));
      } else if (['admin', 'analyste'].includes(user?.role)) {
        promises.push(alertService.getAllAlerts());
      } else {
        promises.push(Promise.resolve([]));
      }

      // Load users (admin only)
      if (user?.role === 'admin') {
        promises.push(userService.getAllUsers());
      } else {
        promises.push(Promise.resolve([]));
      }

      const [transactions, alerts, users] = await Promise.all(promises);

      setData({
        transactions: Array.isArray(transactions) ? transactions : [],
        alerts: Array.isArray(alerts) ? alerts : [],
        users: Array.isArray(users) ? users : [],
      });

      // Calculate stats
      const fraudTransactions = transactions.filter(t => t.fraud_probability > 0.8).length;
      const activeAlerts = alerts.filter(a => a.status !== 'résolu').length;

      setStats({
        totalTransactions: transactions.length,
        fraudTransactions,
        activeAlerts,
        totalUsers: users.length,
      });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInvestigateTransaction = (transaction) => {
    setSelectedTransaction(transaction);
  };

  const handleCloseInvestigation = () => {
    setSelectedTransaction(null);
  };

  // Chart data
  const chartData = [
    { name: 'Lun', transactions: 45, fraudes: 3 },
    { name: 'Mar', transactions: 52, fraudes: 2 },
    { name: 'Mer', transactions: 48, fraudes: 5 },
    { name: 'Jeu', transactions: 61, fraudes: 4 },
    { name: 'Ven', transactions: 55, fraudes: 6 },
    { name: 'Sam', transactions: 67, fraudes: 3 },
    { name: 'Dim', transactions: 43, fraudes: 2 },
  ];

  const pieData = [
    { name: 'Normales', value: stats.totalTransactions - stats.fraudTransactions, color: '#10b981' },
    { name: 'Fraudes', value: stats.fraudTransactions, color: '#ef4444' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard {user?.role === 'client_banque' ? `- Banque ${user.id || 'N/A'}` : ''}
        </h1>
        <p className="text-gray-600 mt-2">
          Aperçu de votre système de détection de fraudes
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Transactions"
          value={stats.totalTransactions}
          icon={CreditCard}
          color="blue"
          trend={{ value: '+12%', isPositive: true }}
        />
        <StatsCard
          title="Fraudes Détectées"
          value={stats.fraudTransactions}
          icon={AlertTriangle}
          color="red"
          trend={{ value: '-8%', isPositive: true }}
        />
        <StatsCard
          title="Alertes Actives"
          value={stats.activeAlerts}
          icon={Activity}
          color="yellow"
        />
        {user?.role === 'admin' && (
          <StatsCard
            title="Utilisateurs"
            value={stats.totalUsers}
            icon={Users}
            color="green"
          />
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Évolution des Transactions
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="transactions" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="fraudes" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Distribution des Transactions
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transactions and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Transactions Récentes
            </h3>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Voir tout
            </button>
          </div>
          <div className="space-y-4">
            {data.transactions.slice(0, 3).map((transaction) => (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
                onInvestigate={handleInvestigateTransaction}
              />
            ))}
            {data.transactions.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                Aucune transaction trouvée
              </p>
            )}
          </div>
        </div>

        {/* Recent Alerts */}
        {['admin', 'analyste'].includes(user?.role) && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Alertes Récentes
              </h3>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Voir tout
              </button>
            </div>
            <div className="space-y-4">
              {data.alerts.slice(0, 3).map((alert) => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  canEdit={true}
                  onUpdate={(id, updates) => {
                    // Handle alert update
                    toast.success('Alerte mise à jour');
                  }}
                />
              ))}
              {data.alerts.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  Aucune alerte trouvée
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Investigation Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Investigation - Transaction #{selectedTransaction.id}
                </h3>
                <button
                  onClick={handleCloseInvestigation}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="h-5 w-5 text-red-600" />
                    <span className="font-medium text-red-800">
                      Probabilité de fraude: {(selectedTransaction.fraud_probability * 100).toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-sm text-red-700">
                    Cette transaction présente un risque élevé de fraude et nécessite une investigation approfondie.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Montant</label>
                    <p className="text-lg font-semibold">
                      {new Intl.NumberFormat('fr-MA', {
                        style: 'currency',
                        currency: 'MAD',
                      }).format(selectedTransaction.transaction_amount || selectedTransaction.amount)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    <p className="text-lg">
                      {selectedTransaction.transaction_date 
                        ? new Date(selectedTransaction.transaction_date).toLocaleString('fr-FR')
                        : 'N/A'
                      }
                    </p>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors">
                    Confirmer Fraude
                  </button>
                  <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors">
                    Transaction Légitime
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;