import React from 'react';
import { AlertTriangle, Clock, CheckCircle, XCircle } from 'lucide-react';
import { mockAlerts } from '../../data/mockData';

const AlertsOverview: React.FC = () => {
  const alertStats = {
    total: mockAlerts.length,
    open: mockAlerts.filter(a => a.status === 'open').length,
    investigating: mockAlerts.filter(a => a.status === 'investigating').length,
    resolved: mockAlerts.filter(a => a.status === 'resolved').length
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-blue-600 bg-blue-100';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-800">Alertes Récentes</h3>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-slate-600">Ouvertes ({alertStats.open})</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-slate-600">En cours ({alertStats.investigating})</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {mockAlerts.slice(0, 5).map((alert) => (
          <div key={alert.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <p className="font-medium text-slate-800">{alert.type}</p>
                <p className="text-sm text-slate-600">{alert.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                {alert.severity.toUpperCase()}
              </span>
              <div className="flex items-center gap-1 text-sm text-slate-500">
                {alert.status === 'open' && <Clock className="h-4 w-4" />}
                {alert.status === 'investigating' && <AlertTriangle className="h-4 w-4" />}
                {alert.status === 'resolved' && <CheckCircle className="h-4 w-4" />}
                <span className="capitalize">{alert.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertsOverview;