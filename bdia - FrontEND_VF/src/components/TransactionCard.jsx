import React from 'react';
import { 
  CreditCard, 
  Calendar, 
  MapPin, 
  DollarSign, 
  AlertTriangle,
  CheckCircle,
  User,
  Clock,
  Smartphone,
  Hash
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const TransactionCard = ({ transaction, type = 'classic', onInvestigate }) => {
  // Déterminer la probabilité de fraude selon le type
  const fraudProbability = transaction.fraud_probability || (transaction.is_fraud ? 0.9 : 0.1);
  const isFraud = fraudProbability > 0.8;
  const isHighRisk = fraudProbability > 0.5;

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
    }).format(amount);
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return 'N/A';
    
    // Pour les transactions carte (timestamp Unix)
    if (typeof dateValue === 'number') {
      return format(new Date(dateValue * 1000), 'dd MMM yyyy HH:mm', { locale: fr });
    }
    
    // Pour les transactions classiques (ISO string)
    return format(new Date(dateValue), 'dd MMM yyyy HH:mm', { locale: fr });
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border-l-4 p-6 hover:shadow-md transition-shadow ${
      isFraud ? 'border-red-500' : isHighRisk ? 'border-yellow-500' : 'border-green-500'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-3">
            {type === 'classic' ? (
              <CreditCard className="h-5 w-5 text-gray-400" />
            ) : (
              <Smartphone className="h-5 w-5 text-gray-400" />
            )}
            <span className="font-semibold text-gray-900">
              {type === 'classic' 
                ? (transaction.transaction_id || transaction.id)
                : `Card-${transaction.id}`
              }
            </span>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              isFraud 
                ? 'bg-red-100 text-red-800' 
                : isHighRisk 
                ? 'bg-yellow-100 text-yellow-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {isFraud ? 'FRAUDE' : isHighRisk ? 'RISQUE' : 'NORMAL'}
            </div>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {type === 'classic' ? 'Classique' : 'Carte'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <DollarSign className="h-4 w-4" />
              <span className="font-medium">
                {formatAmount(transaction.transaction_amount || transaction.amount)}
              </span>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>
                {type === 'classic' 
                  ? formatDate(transaction.transaction_date)
                  : formatDate(transaction.time)
                }
              </span>
            </div>

            {type === 'classic' && (
              <>
                {transaction.transaction_location && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{transaction.transaction_location}</span>
                  </div>
                )}

                {transaction.customer_name && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    <span>{transaction.customer_name}</span>
                  </div>
                )}
              </>
            )}

            {type === 'card' && (
              <>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Hash className="h-4 w-4" />
                  <span>Variables PCA: V1-V28</span>
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>Timestamp: {transaction.time}</span>
                </div>
              </>
            )}
          </div>

          {type === 'classic' && transaction.transaction_description && (
            <p className="text-sm text-gray-600 mb-3">
              {transaction.transaction_description}
            </p>
          )}

          {type === 'card' && (
            <div className="mb-3">
              <p className="text-sm text-gray-600">
                Transaction par carte de crédit avec analyse PCA
              </p>
              <div className="text-xs text-gray-500 mt-1">
                Variables anonymisées pour la protection des données
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {isFraud ? (
                <AlertTriangle className="h-4 w-4 text-red-500" />
              ) : (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
              <span className="text-sm font-medium">
                Probabilité de fraude: {(fraudProbability * 100).toFixed(1)}%
              </span>
            </div>

            {isFraud && onInvestigate && (
              <button
                onClick={() => onInvestigate(transaction)}
                className="px-3 py-1 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
              >
                Investiguer
              </button>
            )}
          </div>

          {/* Additional info for card transactions */}
          {type === 'card' && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Modèle: Détection par ML</span>
                <span>Statut: {transaction.is_fraud ? 'Frauduleuse' : 'Légitime'}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;