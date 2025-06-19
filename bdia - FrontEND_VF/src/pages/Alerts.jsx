import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Filter, 
  Download, 
  Search,
  AlertTriangle,
  Clock,
  CheckCircle
} from 'lucide-react';
import AlertCard from '../components/AlertCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { alertService } from '../services/alertService';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const Alerts = () => {
  const { user } = useAuthStore();
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    fraudLevel: 'all',
  });

  const [alertForm, setAlertForm] = useState({
    transaction_id: '',
    banque_id: user?.id || 1,
    fraud_probability: 0.9,
    message: '',
    status: 'non traité',
  });

  useEffect(() => {
    loadAlerts();
  }, [user]);

  useEffect(() => {
    applyFilters();
  }, [alerts, filters]);

  const loadAlerts = async () => {
    setIsLoading(true);
    try {
      let data;
      if (user?.role === 'client_banque') {
        data = await alertService.getBankAlerts(user.id || 1);
      } else {
        data = await alertService.getAllAlerts();
      }
      setAlerts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading alerts:', error);
      toast.error('Erreur lors du chargement des alertes');
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = alerts;

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(a => 
        a.id?.toString().includes(filters.search) ||
        a.transaction_id?.toString().includes(filters.search) ||
        a.message?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(a => a.status === filters.status);
    }

    // Fraud level filter
    if (filters.fraudLevel !== 'all') {
      if (filters.fraudLevel === 'high') {
        filtered = filtered.filter(a => a.fraud_probability > 0.8);
      } else if (filters.fraudLevel === 'medium') {
        filtered = filtered.filter(a => a.fraud_probability > 0.5 && a.fraud_probability <= 0.8);
      } else if (filters.fraudLevel === 'low') {
        filtered = filtered.filter(a => a.fraud_probability <= 0.5);
      }
    }

    setFilteredAlerts(filtered);
  };

  const handleCreateAlert = async (e) => {
    e.preventDefault();
    
    try {
      const alertData = {
        ...alertForm,
        fraud_probability: parseFloat(alertForm.fraud_probability),
        transaction_id: alertForm.transaction_id ? parseInt(alertForm.transaction_id) : null,
        banque_id: parseInt(alertForm.banque_id),
      };

      await alertService.createAlert(alertData);
      toast.success('Alerte créée avec succès');
      setShowAddModal(false);
      loadAlerts();
      
      // Reset form
      setAlertForm({
        transaction_id: '',
        banque_id: user?.id || 1,
        fraud_probability: 0.9,
        message: '',
        status: 'non traité',
      });
    } catch (error) {
      console.error('Error creating alert:', error);
      toast.error('Erreur lors de la création de l\'alerte');
    }
  };

  const handleUpdateAlert = async (alertId, updates) => {
    try {
      await alertService.updateAlert(alertId, updates);
      toast.success('Alerte mise à jour');
      loadAlerts();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleDeleteAlert = async (alertId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette alerte ?')) {
      try {
        await alertService.deleteAlert(alertId);
        toast.success('Alerte supprimée');
        loadAlerts();
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const handleExport = async () => {
    try {
      const data = await alertService.exportAlerts();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `alerts_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Export réussi');
    } catch (error) {
      toast.error('Erreur lors de l\'export');
    }
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
          <h1 className="text-3xl font-bold text-gray-900">Alertes de Fraude</h1>
          <p className="text-gray-600 mt-2">
            Surveillance et gestion des alertes de sécurité
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Exporter</span>
          </button>
          {['admin', 'analyste'].includes(user?.role) && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Nouvelle Alerte</span>
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Non traitées</p>
              <p className="text-2xl font-bold text-gray-900">
                {alerts.filter(a => a.status === 'non traité').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En cours</p>
              <p className="text-2xl font-bold text-gray-900">
                {alerts.filter(a => a.status === 'en cours').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Résolues</p>
              <p className="text-2xl font-bold text-gray-900">
                {alerts.filter(a => a.status === 'résolu').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recherche
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="ID alerte, transaction, message..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
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
              <option value="non traité">Non traité</option>
              <option value="en cours">En cours</option>
              <option value="résolu">Résolu</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Niveau de Fraude
            </label>
            <select
              value={filters.fraudLevel}
              onChange={(e) => setFilters({ ...filters, fraudLevel: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous</option>
              <option value="high">Élevé (&gt;80%)</option>
              <option value="medium">Moyen (50-80%)</option>
              <option value="low">Faible (&lt;50%)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              canEdit={['admin', 'analyste'].includes(user?.role)}
              onUpdate={handleUpdateAlert}
              onDelete={user?.role === 'admin' ? handleDeleteAlert : null}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune alerte trouvée
            </h3>
            <p className="text-gray-600">
              {alerts.length === 0 
                ? 'Aucune alerte n\'a été générée'
                : 'Essayez de modifier vos filtres'
              }
            </p>
          </div>
        )}
      </div>

      {/* Add Alert Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Nouvelle Alerte
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleCreateAlert} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ID Transaction (optionnel)
                  </label>
                  <input
                    type="number"
                    value={alertForm.transaction_id}
                    onChange={(e) => setAlertForm({ ...alertForm, transaction_id: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ID Banque *
                  </label>
                  <input
                    type="number"
                    required
                    value={alertForm.banque_id}
                    onChange={(e) => setAlertForm({ ...alertForm, banque_id: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Probabilité de Fraude *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    required
                    value={alertForm.fraud_probability}
                    onChange={(e) => setAlertForm({ ...alertForm, fraud_probability: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={alertForm.message}
                    onChange={(e) => setAlertForm({ ...alertForm, message: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Décrivez la raison de cette alerte..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Statut *
                  </label>
                  <select
                    required
                    value={alertForm.status}
                    onChange={(e) => setAlertForm({ ...alertForm, status: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="non traité">Non traité</option>
                    <option value="en cours">En cours</option>
                    <option value="résolu">Résolu</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    Créer Alerte
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Alerts;