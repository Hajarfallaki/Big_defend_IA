import React from 'react';
import { Bell, User, LogOut, Brain, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useDataset } from '../../hooks/useDataset';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { alerts, riskMetrics } = useDataset();

  const activeAlerts = alerts.filter(a => a.status === 'open' || a.status === 'investigating').length;

  return (
    <header className="bg-white shadow-sm border-b border-slate-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800">
            Bienvenue, {user?.name}
          </h2>
          <div className="flex items-center gap-4 mt-1">
            <p className="text-slate-600 capitalize">Rôle: {user?.role}</p>
            <div className="flex items-center gap-2 text-sm">
              <Brain className="h-4 w-4 text-purple-600" />
              <span className="text-slate-600">
                BigDefend AI • Précision: {riskMetrics ? (riskMetrics.accuracy * 100).toFixed(1) : '94.2'}%
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Statut IA */}
          <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <Shield className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-slate-700">IA Active</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors">
            <Bell className="h-5 w-5" />
            {activeAlerts > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {activeAlerts}
              </span>
            )}
          </button>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-lg">
              <User className="h-4 w-4 text-slate-600" />
              <span className="text-sm font-medium text-slate-700">{user?.name}</span>
            </div>
            
            <button
              onClick={logout}
              className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Se déconnecter"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;