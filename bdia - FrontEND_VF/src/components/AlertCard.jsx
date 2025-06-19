import React from 'react';
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  XCircle,
  Calendar,
  DollarSign
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const AlertCard = ({ alert, onUpdate, onDelete, canEdit }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'non traité':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'en cours':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'résolu':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <XCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'non traité':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'en cours':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'résolu':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleStatusChange = (newStatus) => {
    onUpdate(alert.id, { status: newStatus });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          {getStatusIcon(alert.status)}
          <h3 className="text-lg font-semibold text-gray-900">
            Alerte #{alert.id}
          </h3>
          <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(alert.status)}`}>
            {alert.status.toUpperCase()}
          </div>
        </div>

        {canEdit && (
          <div className="flex items-center space-x-2">
            <select
              value={alert.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="non traité">Non traité</option>
              <option value="en cours">En cours</option>
              <option value="résolu">Résolu</option>
            </select>
            
            {onDelete && (
              <button
                onClick={() => onDelete(alert.id)}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Supprimer
              </button>
            )}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          {alert.transaction_id && (
            <div className="flex items-center space-x-1">
              <span className="font-medium">Transaction:</span>
              <span>#{alert.transaction_id}</span>
            </div>
          )}
          
          {alert.banque_id && (
            <div className="flex items-center space-x-1">
              <span className="font-medium">Banque:</span>
              <span>#{alert.banque_id}</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <DollarSign className="h-4 w-4" />
          <span className="font-medium">
            Probabilité de fraude: {(alert.fraud_probability * 100).toFixed(1)}%
          </span>
        </div>

        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>
            {format(new Date(alert.date), 'dd MMM yyyy HH:mm', { locale: fr })}
          </span>
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-700 bg-gray-50 rounded-md p-3">
            {alert.message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AlertCard;