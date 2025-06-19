import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  Shield, 
  Bell, 
  Database, 
  Mail, 
  Lock,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('security');
  const [showApiKey, setShowApiKey] = useState(false);

  const [settings, setSettings] = useState({
    security: {
      fraudThreshold: 0.8,
      autoBlockSuspicious: true,
      requireTwoFactor: false,
      sessionTimeout: 60,
      maxLoginAttempts: 5
    },
    notifications: {
      emailAlerts: true,
      smsAlerts: false,
      fraudDetected: true,
      systemMaintenance: true,
      weeklyReports: true,
      alertFrequency: 'immediate'
    },
    system: {
      apiRateLimit: 1000,
      dataRetention: 365,
      backupFrequency: 'daily',
      logLevel: 'info',
      maintenanceMode: false
    },
    integration: {
      siemEnabled: true,
      webhookUrl: '',
      apiKey: 'sk-1234567890abcdef',
      exportFormat: 'json',
      realTimeSync: true
    }
  });

  const tabs = [
    { id: 'security', name: 'Sécurité', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'system', name: 'Système', icon: Database },
    { id: 'integration', name: 'Intégration', icon: Mail }
  ];

  const handleSave = async (category) => {
    setIsLoading(true);
    try {
      // Simuler la sauvegarde
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`Paramètres ${category} sauvegardés`);
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = (category) => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser ces paramètres ?')) {
      // Reset to default values
      toast.success(`Paramètres ${category} réinitialisés`);
    }
  };

  const updateSetting = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Seuil de Détection de Fraude
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            value={settings.security.fraudThreshold}
            onChange={(e) => updateSetting('security', 'fraudThreshold', parseFloat(e.target.value))}
            className="flex-1"
          />
          <span className="text-sm font-medium text-gray-900 min-w-[60px]">
            {(settings.security.fraudThreshold * 100).toFixed(0)}%
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Transactions avec une probabilité supérieure à ce seuil seront marquées comme frauduleuses
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-gray-700">
            Blocage Automatique
          </label>
          <p className="text-xs text-gray-500">
            Bloquer automatiquement les transactions suspectes
          </p>
        </div>
        <input
          type="checkbox"
          checked={settings.security.autoBlockSuspicious}
          onChange={(e) => updateSetting('security', 'autoBlockSuspicious', e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-gray-700">
            Authentification à Deux Facteurs
          </label>
          <p className="text-xs text-gray-500">
            Exiger 2FA pour tous les utilisateurs
          </p>
        </div>
        <input
          type="checkbox"
          checked={settings.security.requireTwoFactor}
          onChange={(e) => updateSetting('security', 'requireTwoFactor', e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Timeout de Session (minutes)
        </label>
        <input
          type="number"
          min="15"
          max="480"
          value={settings.security.sessionTimeout}
          onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tentatives de Connexion Max
        </label>
        <input
          type="number"
          min="3"
          max="10"
          value={settings.security.maxLoginAttempts}
          onChange={(e) => updateSetting('security', 'maxLoginAttempts', parseInt(e.target.value))}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-gray-700">
            Alertes Email
          </label>
          <p className="text-xs text-gray-500">
            Recevoir les notifications par email
          </p>
        </div>
        <input
          type="checkbox"
          checked={settings.notifications.emailAlerts}
          onChange={(e) => updateSetting('notifications', 'emailAlerts', e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-gray-700">
            Alertes SMS
          </label>
          <p className="text-xs text-gray-500">
            Recevoir les notifications par SMS
          </p>
        </div>
        <input
          type="checkbox"
          checked={settings.notifications.smsAlerts}
          onChange={(e) => updateSetting('notifications', 'smsAlerts', e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-gray-700">
            Fraude Détectée
          </label>
          <p className="text-xs text-gray-500">
            Notification immédiate lors de détection de fraude
          </p>
        </div>
        <input
          type="checkbox"
          checked={settings.notifications.fraudDetected}
          onChange={(e) => updateSetting('notifications', 'fraudDetected', e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-gray-700">
            Rapports Hebdomadaires
          </label>
          <p className="text-xs text-gray-500">
            Recevoir un résumé hebdomadaire
          </p>
        </div>
        <input
          type="checkbox"
          checked={settings.notifications.weeklyReports}
          onChange={(e) => updateSetting('notifications', 'weeklyReports', e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Fréquence des Alertes
        </label>
        <select
          value={settings.notifications.alertFrequency}
          onChange={(e) => updateSetting('notifications', 'alertFrequency', e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="immediate">Immédiate</option>
          <option value="hourly">Toutes les heures</option>
          <option value="daily">Quotidienne</option>
          <option value="weekly">Hebdomadaire</option>
        </select>
      </div>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Limite de Taux API (req/min)
        </label>
        <input
          type="number"
          min="100"
          max="10000"
          value={settings.system.apiRateLimit}
          onChange={(e) => updateSetting('system', 'apiRateLimit', parseInt(e.target.value))}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rétention des Données (jours)
        </label>
        <input
          type="number"
          min="30"
          max="2555"
          value={settings.system.dataRetention}
          onChange={(e) => updateSetting('system', 'dataRetention', parseInt(e.target.value))}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Fréquence de Sauvegarde
        </label>
        <select
          value={settings.system.backupFrequency}
          onChange={(e) => updateSetting('system', 'backupFrequency', e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="hourly">Toutes les heures</option>
          <option value="daily">Quotidienne</option>
          <option value="weekly">Hebdomadaire</option>
          <option value="monthly">Mensuelle</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Niveau de Log
        </label>
        <select
          value={settings.system.logLevel}
          onChange={(e) => updateSetting('system', 'logLevel', e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="debug">Debug</option>
          <option value="info">Info</option>
          <option value="warning">Warning</option>
          <option value="error">Error</option>
        </select>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-gray-700">
            Mode Maintenance
          </label>
          <p className="text-xs text-gray-500">
            Activer le mode maintenance du système
          </p>
        </div>
        <input
          type="checkbox"
          checked={settings.system.maintenanceMode}
          onChange={(e) => updateSetting('system', 'maintenanceMode', e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
      </div>
    </div>
  );

  const renderIntegrationSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-gray-700">
            Intégration SIEM
          </label>
          <p className="text-xs text-gray-500">
            Activer l'export vers les systèmes SIEM
          </p>
        </div>
        <input
          type="checkbox"
          checked={settings.integration.siemEnabled}
          onChange={(e) => updateSetting('integration', 'siemEnabled', e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          URL Webhook
        </label>
        <input
          type="url"
          value={settings.integration.webhookUrl}
          onChange={(e) => updateSetting('integration', 'webhookUrl', e.target.value)}
          placeholder="https://your-siem.com/webhook"
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Clé API
        </label>
        <div className="relative">
          <input
            type={showApiKey ? 'text' : 'password'}
            value={settings.integration.apiKey}
            onChange={(e) => updateSetting('integration', 'apiKey', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="button"
            onClick={() => setShowApiKey(!showApiKey)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showApiKey ? (
              <EyeOff className="h-4 w-4 text-gray-400" />
            ) : (
              <Eye className="h-4 w-4 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Format d'Export
        </label>
        <select
          value={settings.integration.exportFormat}
          onChange={(e) => updateSetting('integration', 'exportFormat', e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="json">JSON</option>
          <option value="csv">CSV</option>
          <option value="xml">XML</option>
          <option value="syslog">Syslog</option>
        </select>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-gray-700">
            Synchronisation Temps Réel
          </label>
          <p className="text-xs text-gray-500">
            Envoyer les données en temps réel
          </p>
        </div>
        <input
          type="checkbox"
          checked={settings.integration.realTimeSync}
          onChange={(e) => updateSetting('integration', 'realTimeSync', e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Paramètres Système</h1>
        <p className="text-gray-600 mt-2">
          Configuration et personnalisation de BigDefend AI
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                {tabs.find(tab => tab.id === activeTab)?.name}
              </h2>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleReset(activeTab)}
                  className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Réinitialiser</span>
                </button>
                <button
                  onClick={() => handleSave(activeTab)}
                  disabled={isLoading}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {isLoading ? (
                    <LoadingSpinner size="small" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>Sauvegarder</span>
                </button>
              </div>
            </div>

            {activeTab === 'security' && renderSecuritySettings()}
            {activeTab === 'notifications' && renderNotificationSettings()}
            {activeTab === 'system' && renderSystemSettings()}
            {activeTab === 'integration' && renderIntegrationSettings()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;