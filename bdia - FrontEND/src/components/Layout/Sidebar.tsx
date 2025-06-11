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
  TrendingUp
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
          { to: '/alerts', icon: AlertTriangle, label: 'Alertes' },
          { to: '/transactions', icon: CreditCard, label: 'Transactions' },
          { to: '/clients', icon: Users, label: 'Clients' },
          { to: '/analytics', icon: BarChart3, label: 'Analyses' },
          { to: '/models', icon: TrendingUp, label: 'Modèles IA' },
          { to: '/settings', icon: Settings, label: 'Paramètres' },
        ];
      case 'analyst':
        return [
          ...baseItems,
          { to: '/alerts', icon: AlertTriangle, label: 'Alertes' },
          { to: '/transactions', icon: CreditCard, label: 'Transactions' },
          { to: '/analytics', icon: BarChart3, label: 'Analyses' },
        ];
      case 'manager':
        return [
          ...baseItems,
          { to: '/analytics', icon: BarChart3, label: 'Analyses' },
          { to: '/reports', icon: BarChart3, label: 'Rapports' },
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
        <Shield className="h-8 w-8 text-blue-400" />
        <h1 className="text-xl font-bold">BigDefend AI</h1>
      </div>
      
      <nav className="space-y-2">
        {navigationItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;