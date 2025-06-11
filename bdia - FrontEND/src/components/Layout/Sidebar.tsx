import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  AlertTriangle, 
  Users, 
  CreditCard, 
  BarChart3, 
  Settings,
  Shield,
  TrendingUp,
  Brain
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const getNavigationItems = () => {
    const baseItems = [
      { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    ];

    switch (user?.role) {
      case 'admin':
        return [
          ...baseItems,
          { to: '/alerts', icon: AlertTriangle, label: 'Alertes IA' },
          { to: '/transactions', icon: CreditCard, label: 'Transactions' },
          { to: '/clients', icon: Users, label: 'Clients' },
          { to: '/analytics', icon: BarChart3, label: 'Analytics' },
          { to: '/models', icon: Brain, label: 'Modèles IA' },
          { to: '/settings', icon: Settings, label: 'Paramètres' },
        ];
      case 'analyst':
        return [
          ...baseItems,
          { to: '/alerts', icon: AlertTriangle, label: 'Alertes IA' },
          { to: '/transactions', icon: CreditCard, label: 'Transactions' },
          { to: '/analytics', icon: BarChart3, label: 'Analytics' },
        ];
      case 'manager':
        return [
          ...baseItems,
          { to: '/analytics', icon: BarChart3, label: 'Analytics' },
          { to: '/reports', icon: TrendingUp, label: 'Rapports' },
        ];
      case 'client':
        return [
          ...baseItems,
          { to: '/my-transactions', icon: CreditCard, label: 'Mes Transactions' },
          { to: '/security', icon: Shield, label: 'Sécurité' },
        ];
      default:
        return baseItems;
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="bg-slate-900 text-white w-64 min-h-screen p-4">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
          <Brain className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold">BigDefend AI</h1>
          <p className="text-xs text-slate-400">Fraud Detection</p>
        </div>
      </div>
      
      <nav className="space-y-2">
        {navigationItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-8 p-4 bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-lg border border-blue-800/30">
        <div className="flex items-center gap-2 mb-2">
          <Brain className="h-4 w-4 text-blue-400" />
          <span className="text-sm font-medium text-blue-300">IA Status</span>
        </div>
        <div className="space-y-1 text-xs text-slate-300">
          <div className="flex justify-between">
            <span>Modèle:</span>
            <span className="text-green-400">Actif</span>
          </div>
          <div className="flex justify-between">
            <span>Précision:</span>
            <span className="text-blue-400">94.2%</span>
          </div>
          <div className="flex justify-between">
            <span>Dataset:</span>
            <span className="text-purple-400">Kaggle</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;