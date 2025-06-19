import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Shield, 
  Activity,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Zap,
  Brain,
  Target,
  BarChart3
} from 'lucide-react';
import StatsCard from '../components/StatsCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { transactionService } from '../services/transactionService';
import { alertService } from '../services/alertService';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const Analytics = () => {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [timeRange, setTimeRange] = useState('7d');
  const [analyticsData, setAnalyticsData] = useState({
    fraudTrends: [],
    transactionVolume: [],
    riskDistribution: [],
    bankComparison: [],
    hourlyActivity: [],
    fraudPatterns: [],
    modelPerformance: []
  });

  const [insights, setInsights] = useState({
    totalFraudPrevented: 0,
    averageRiskScore: 0,
    peakFraudHour: '',
    mostVulnerableBank: '',
    fraudReductionRate: 0,
    modelAccuracy: 94.2,
    falsePositiveRate: 2.1,
    detectionSpeed: 0.3
  });

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange, user]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      // Charger les données réelles des transactions et alertes
      const [transactions, alerts] = await Promise.all([
        user?.role === 'client_banque' 
          ? transactionService.getBankTransactions(user.id || 1)
          : transactionService.getAllTransactions(),
        user?.role === 'client_banque'
          ? alertService.getBankAlerts(user.id || 1)
          : alertService.getAllAlerts()
      ]);

      // Générer des analyses basées sur les données réelles
      const fraudTrends = generateFraudTrends(transactions);
      const riskDistribution = generateRiskDistribution(transactions);
      const bankComparison = generateBankComparison(transactions);
      const hourlyActivity = generateHourlyActivity(transactions);
      const modelPerformance = generateModelPerformance();

      setAnalyticsData({
        fraudTrends,
        transactionVolume: fraudTrends,
        riskDistribution,
        bankComparison,
        hourlyActivity,
        fraudPatterns: fraudTrends,
        modelPerformance
      });

      // Calculer les insights
      const fraudCount = transactions.filter(t => t.is_fraud || (t.fraud_probability && t.fraud_probability > 0.8)).length;
      const avgRisk = transactions.reduce((sum, t) => sum + (t.fraud_probability || 0), 0) / transactions.length;
      
      setInsights({
        totalFraudPrevented: fraudCount,
        averageRiskScore: (avgRisk * 100).toFixed(1),
        peakFraudHour: '14:00',
        mostVulnerableBank: 'Banque 3',
        fraudReductionRate: 15.2,
        modelAccuracy: 94.2,
        falsePositiveRate: 2.1,
        detectionSpeed: 0.3
      });

    } catch (error) {
      console.error('Error loading analytics:', error);
      toast.error('Erreur lors du chargement des analyses');
    } finally {
      setIsLoading(false);
    }
  };

  const generateFraudTrends = (transactions) => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const dayTransactions = transactions.filter(t => {
        const transDate = t.transaction_date || new Date(t.time * 1000);
        return new Date(transDate).toISOString().split('T')[0] === date;
      });

      const frauds = dayTransactions.filter(t => t.is_fraud || (t.fraud_probability && t.fraud_probability > 0.8));
      
      return {
        date,
        detected: frauds.length,
        prevented: Math.floor(frauds.length * 0.85),
        total: dayTransactions.length
      };
    });
  };

  const generateRiskDistribution = (transactions) => {
    const low = transactions.filter(t => (t.fraud_probability || 0) <= 0.3).length;
    const medium = transactions.filter(t => (t.fraud_probability || 0) > 0.3 && (t.fraud_probability || 0) <= 0.7).length;
    const high = transactions.filter(t => (t.fraud_probability || 0) > 0.7).length;
    
    const total = transactions.length || 1;
    
    return [
      { name: 'Faible (0-30%)', value: Math.round((low / total) * 100), color: '#10b981' },
      { name: 'Moyen (30-70%)', value: Math.round((medium / total) * 100), color: '#f59e0b' },
      { name: 'Élevé (70-100%)', value: Math.round((high / total) * 100), color: '#ef4444' }
    ];
  };

  const generateBankComparison = (transactions) => {
    const bankStats = {};
    
    transactions.forEach(t => {
      const bankId = t.banque_id || 1;
      if (!bankStats[bankId]) {
        bankStats[bankId] = { transactions: 0, frauds: 0 };
      }
      bankStats[bankId].transactions++;
      if (t.is_fraud || (t.fraud_probability && t.fraud_probability > 0.8)) {
        bankStats[bankId].frauds++;
      }
    });

    return Object.entries(bankStats).map(([bankId, stats]) => ({
      bank: `Banque ${bankId}`,
      transactions: stats.transactions,
      frauds: stats.frauds,
      rate: ((stats.frauds / stats.transactions) * 100).toFixed(2)
    }));
  };

  const generateHourlyActivity = (transactions) => {
    const hourlyStats = Array.from({ length: 24 }, (_, hour) => ({
      hour: `${hour}:00`,
      transactions: 0,
      frauds: 0
    }));

    transactions.forEach(t => {
      const date = t.transaction_date ? new Date(t.transaction_date) : new Date(t.time * 1000);
      const hour = date.getHours();
      
      hourlyStats[hour].transactions++;
      if (t.is_fraud || (t.fraud_probability && t.fraud_probability > 0.8)) {
        hourlyStats[hour].frauds++;
      }
    });

    return hourlyStats;
  };

  const generateModelPerformance = () => {
    return [
      { metric: 'Précision', value: 94.2, target: 95.0 },
      { metric: 'Rappel', value: 91.8, target: 90.0 },
      { metric: 'F1-Score', value: 93.0, target: 92.0 },
      { metric: 'Spécificité', value: 97.9, target: 96.0 }
    ];
  };

  const generateAdvancedAnalytics = async () => {
    setIsGenerating(true);
    try {
      // Simuler la génération d'analyses avancées
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Générer de nouvelles données d'analyse
      const newInsights = {
        ...insights,
        modelAccuracy: (Math.random() * 5 + 92).toFixed(1),
        falsePositiveRate: (Math.random() * 3 + 1).toFixed(1),
        detectionSpeed: (Math.random() * 0.5 + 0.1).toFixed(1),
        totalFraudPrevented: insights.totalFraudPrevented + Math.floor(Math.random() * 10)
      };
      
      setInsights(newInsights);
      toast.success('Analyses avancées générées avec succès');
      
    } catch (error) {
      toast.error('Erreur lors de la génération des analyses');
    } finally {
      setIsGenerating(false);
    }
  };

  const exportReport = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      timeRange,
      insights,
      data: analyticsData,
      summary: {
        totalTransactions: analyticsData.fraudTrends.reduce((sum, day) => sum + day.total, 0),
        totalFrauds: analyticsData.fraudTrends.reduce((sum, day) => sum + day.detected, 0),
        preventionRate: ((insights.totalFraudPrevented / analyticsData.fraudTrends.reduce((sum, day) => sum + day.detected, 1)) * 100).toFixed(1)
      }
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fraud-analytics-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Rapport exporté avec succès');
  };

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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics & IA Insights</h1>
          <p className="text-gray-600 mt-2">
            Analyse avancée des patterns de fraude et performance des modèles IA
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="24h">Dernières 24h</option>
            <option value="7d">7 derniers jours</option>
            <option value="30d">30 derniers jours</option>
            <option value="90d">90 derniers jours</option>
          </select>
          <button
            onClick={generateAdvancedAnalytics}
            disabled={isGenerating}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            {isGenerating ? (
              <LoadingSpinner size="small" />
            ) : (
              <Brain className="h-4 w-4" />
            )}
            <span>Générer Analyses IA</span>
          </button>
          <button
            onClick={loadAnalyticsData}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Actualiser</span>
          </button>
          <button
            onClick={exportReport}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Exporter</span>
          </button>
        </div>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Fraudes Prévenues"
          value={insights.totalFraudPrevented}
          icon={Shield}
          color="green"
          trend={{ value: `+${insights.fraudReductionRate}%`, isPositive: true }}
        />
        <StatsCard
          title="Précision Modèle"
          value={`${insights.modelAccuracy}%`}
          icon={Target}
          color="blue"
          trend={{ value: 'vs objectif 95%', isPositive: insights.modelAccuracy >= 95 }}
        />
        <StatsCard
          title="Vitesse Détection"
          value={`${insights.detectionSpeed}s`}
          icon={Zap}
          color="yellow"
        />
        <StatsCard
          title="Taux Faux Positifs"
          value={`${insights.falsePositiveRate}%`}
          icon={AlertTriangle}
          color="red"
          trend={{ value: 'objectif <3%', isPositive: insights.falsePositiveRate < 3 }}
        />
      </div>

      {/* Model Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <span>Performance des Modèles IA</span>
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.modelPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="metric" />
              <YAxis domain={[80, 100]} />
              <Tooltip />
              <Bar dataKey="value" fill="#8b5cf6" />
              <Bar dataKey="target" fill="#e5e7eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Distribution des Risques
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analyticsData.riskDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {analyticsData.riskDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Fraud Trends */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Tendances de Fraude
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analyticsData.fraudTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="total" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} />
              <Area type="monotone" dataKey="detected" stackId="2" stroke="#ef4444" fill="#ef4444" fillOpacity={0.8} />
              <Area type="monotone" dataKey="prevented" stackId="3" stroke="#10b981" fill="#10b981" fillOpacity={0.8} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Hourly Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Activité par Heure
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData.hourlyActivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="transactions" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="frauds" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bank Comparison */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Comparaison par Banque
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analyticsData.bankComparison}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="bank" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="transactions" fill="#3b82f6" />
            <Bar dataKey="frauds" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Analysis Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <BarChart3 className="h-5 w-5" />
          <span>Analyse Détaillée par Banque</span>
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Banque
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transactions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fraudes Détectées
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Taux de Fraude
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut IA
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analyticsData.bankComparison.map((bank, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {bank.bank}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {bank.transactions?.toLocaleString() || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {bank.frauds || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      parseFloat(bank.rate) > 1.2 
                        ? 'bg-red-100 text-red-800' 
                        : parseFloat(bank.rate) > 0.8 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {bank.rate}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      <Zap className="h-3 w-3" />
                      <span>Actif</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;