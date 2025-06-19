import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter,
  TrendingUp,
  AlertTriangle,
  Users,
  CreditCard,
  Eye,
  Mail,
  Printer
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import LoadingSpinner from '../components/LoadingSpinner';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const Reports = () => {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [reports, setReports] = useState([]);
  const [filters, setFilters] = useState({
    type: 'all',
    dateFrom: '',
    dateTo: '',
    status: 'all'
  });

  const reportTypes = [
    {
      id: 'fraud-summary',
      name: 'Résumé des Fraudes',
      description: 'Rapport détaillé des fraudes détectées et prévenues',
      icon: AlertTriangle,
      color: 'red',
      frequency: 'daily'
    },
    {
      id: 'transaction-volume',
      name: 'Volume des Transactions',
      description: 'Analyse du volume et des tendances des transactions',
      icon: CreditCard,
      color: 'blue',
      frequency: 'weekly'
    },
    {
      id: 'user-activity',
      name: 'Activité Utilisateurs',
      description: 'Rapport sur l\'activité et les connexions des utilisateurs',
      icon: Users,
      color: 'green',
      frequency: 'monthly'
    },
    {
      id: 'system-performance',
      name: 'Performance Système',
      description: 'Métriques de performance et disponibilité du système',
      icon: TrendingUp,
      color: 'purple',
      frequency: 'daily'
    }
  ];

  useEffect(() => {
    loadReports();
  }, [filters]);

  const loadReports = async () => {
    setIsLoading(true);
    try {
      // Simuler le chargement des rapports
      const mockReports = [
        {
          id: 1,
          type: 'fraud-summary',
          title: 'Rapport Fraudes - Janvier 2024',
          description: 'Résumé des fraudes détectées en janvier',
          createdAt: '2024-01-31T23:59:59',
          status: 'completed',
          size: '2.3 MB',
          format: 'PDF'
        },
        {
          id: 2,
          type: 'transaction-volume',
          title: 'Volume Transactions - Semaine 4',
          description: 'Analyse du volume des transactions',
          createdAt: '2024-01-28T23:59:59',
          status: 'completed',
          size: '1.8 MB',
          format: 'Excel'
        },
        {
          id: 3,
          type: 'user-activity',
          title: 'Activité Utilisateurs - Janvier',
          description: 'Rapport mensuel d\'activité',
          createdAt: '2024-01-31T23:59:59',
          status: 'processing',
          size: '-',
          format: 'PDF'
        }
      ];

      setReports(mockReports);
    } catch (error) {
      console.error('Error loading reports:', error);
      toast.error('Erreur lors du chargement des rapports');
    } finally {
      setIsLoading(false);
    }
  };

  const generateReport = async (reportType) => {
    setIsLoading(true);
    try {
      // Simuler la génération de rapport
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newReport = {
        id: Date.now(),
        type: reportType.id,
        title: `${reportType.name} - ${format(new Date(), 'MMMM yyyy', { locale: fr })}`,
        description: reportType.description,
        createdAt: new Date().toISOString(),
        status: 'completed',
        size: `${(Math.random() * 3 + 1).toFixed(1)} MB`,
        format: 'PDF'
      };

      setReports(prev => [newReport, ...prev]);
      toast.success('Rapport généré avec succès');
    } catch (error) {
      toast.error('Erreur lors de la génération du rapport');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadReport = (report) => {
    // Simuler le téléchargement
    toast.success(`Téléchargement de ${report.title} commencé`);
  };

  const previewReport = (report) => {
    // Simuler l'aperçu
    toast.info(`Aperçu de ${report.title}`);
  };

  const emailReport = (report) => {
    // Simuler l'envoi par email
    toast.success(`${report.title} envoyé par email`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Terminé';
      case 'processing':
        return 'En cours';
      case 'failed':
        return 'Échec';
      default:
        return 'Inconnu';
    }
  };

  const getTypeColor = (type) => {
    const reportType = reportTypes.find(rt => rt.id === type);
    return reportType?.color || 'gray';
  };

  const filteredReports = reports.filter(report => {
    if (filters.type !== 'all' && report.type !== filters.type) return false;
    if (filters.status !== 'all' && report.status !== filters.status) return false;
    if (filters.dateFrom && new Date(report.createdAt) < new Date(filters.dateFrom)) return false;
    if (filters.dateTo && new Date(report.createdAt) > new Date(filters.dateTo)) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Rapports & Analytics</h1>
        <p className="text-gray-600 mt-2">
          Génération et gestion des rapports système
        </p>
      </div>

      {/* Report Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {reportTypes.map((reportType) => (
          <div key={reportType.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-full bg-${reportType.color}-100`}>
                <reportType.icon className={`h-6 w-6 text-${reportType.color}-600`} />
              </div>
              <span className="text-xs text-gray-500 capitalize">{reportType.frequency}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {reportType.name}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {reportType.description}
            </p>
            <button
              onClick={() => generateReport(reportType)}
              disabled={isLoading}
              className={`w-full flex items-center justify-center space-x-2 px-4 py-2 bg-${reportType.color}-600 text-white rounded-md hover:bg-${reportType.color}-700 disabled:opacity-50 transition-colors`}
            >
              <FileText className="h-4 w-4" />
              <span>Générer</span>
            </button>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type de Rapport
            </label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous</option>
              {reportTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date de début
            </label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date de fin
            </label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Statut
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous</option>
              <option value="completed">Terminé</option>
              <option value="processing">En cours</option>
              <option value="failed">Échec</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Rapports Générés ({filteredReports.length})
          </h3>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="large" />
          </div>
        ) : filteredReports.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rapport
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date de Création
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Taille
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {report.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {report.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full bg-${getTypeColor(report.type)}-100 text-${getTypeColor(report.type)}-800`}>
                        {reportTypes.find(rt => rt.id === report.type)?.name || report.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(report.createdAt), 'dd MMM yyyy HH:mm', { locale: fr })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(report.status)}`}>
                        {getStatusText(report.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {report.size}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        {report.status === 'completed' && (
                          <>
                            <button
                              onClick={() => previewReport(report)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Aperçu"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => downloadReport(report)}
                              className="text-green-600 hover:text-green-900"
                              title="Télécharger"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => emailReport(report)}
                              className="text-purple-600 hover:text-purple-900"
                              title="Envoyer par email"
                            >
                              <Mail className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        {report.status === 'processing' && (
                          <LoadingSpinner size="small" />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun rapport trouvé
            </h3>
            <p className="text-gray-600">
              Générez votre premier rapport en utilisant les boutons ci-dessus
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;