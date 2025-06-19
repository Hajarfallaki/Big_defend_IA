import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Brain,
  LayoutDashboard,
  Play,
  AlertTriangle,
  CreditCard,
  Users,
  FileText,
  BarChart3,
  Settings as SettingsIcon,
  Activity,
  Zap
} from 'lucide-react';
import useAuthStore from '../store/authStore';

const Sidebar = () => {
  const { user } = useAuthStore();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['client_banque', 'admin', 'analyste'] },
    { name: 'Générateur IA', href: '/generator', icon: Play, roles: ['admin', 'analyste' ,'client_banque'] },
    { name: 'Transactions', href: '/transactions', icon: CreditCard, roles: ['client_banque', 'admin', 'analyste'] },
    { name: 'Alertes IA', href: '/alerts', icon: AlertTriangle, roles: ['admin', 'analyste'] },
    { name: 'Analytics', href: '/analytics', icon: BarChart3, roles: ['admin', 'analyste'] },
    { name: 'Logs Système', href: '/logs', icon: FileText, roles: ['admin', 'analyste'] },
    { name: 'Utilisateurs', href: '/users', icon: Users, roles: ['admin'] },
    { name: 'Paramètres', href: '/settings', icon: SettingsIcon, roles: ['admin'] },
  ];

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(user?.role)
  );

  return (
    <div className="w-64 bg-slate-900 h-screen flex flex-col border-r border-slate-800">
      {/* Logo */}
      <div className="flex items-center space-x-3 p-6 border-b border-slate-800">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
          <Brain className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-white font-bold text-lg">BigDefend AI</h1>
          <p className="text-gray-400 text-xs">Fraud Detection</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {filteredNavigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <item.icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* IA Status */}
      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Zap className="h-4 w-4 text-blue-400" />
            <span className="text-white text-sm font-medium">IA Status</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">Modèle:</span>
              <span className="text-green-400 font-medium">Actif</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Précision:</span>
              <span className="text-blue-400 font-medium">94.2%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Backend:</span>
              <span className="text-purple-400 font-medium">FastAPI</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;