import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Transaction } from '../../types';

interface RealTimeChartProps {
  transactions: Transaction[];
}

const RealTimeChart: React.FC<RealTimeChartProps> = ({ transactions }) => {
  // Préparer les données pour le graphique temporel
  const prepareTimeData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    return last7Days.map(date => {
      const dayTransactions = transactions.filter(t => 
        t.timestamp.toISOString().split('T')[0] === date
      );
      
      const fraudulent = dayTransactions.filter(t => t.status === 'flagged').length;
      const total = dayTransactions.length;
      
      return {
        date: new Date(date).toLocaleDateString('fr-FR', { weekday: 'short' }),
        total,
        fraudulent,
        fraudRate: total > 0 ? (fraudulent / total * 100) : 0
      };
    });
  };

  // Préparer les données de distribution des montants
  const prepareAmountDistribution = () => {
    const ranges = [
      { label: '0-50€', min: 0, max: 50 },
      { label: '50-200€', min: 50, max: 200 },
      { label: '200-500€', min: 200, max: 500 },
      { label: '500-1000€', min: 500, max: 1000 },
      { label: '1000€+', min: 1000, max: Infinity }
    ];

    return ranges.map(range => {
      const rangeTransactions = transactions.filter(t => 
        t.amount >= range.min && t.amount < range.max
      );
      
      const fraudulent = rangeTransactions.filter(t => t.status === 'flagged').length;
      
      return {
        range: range.label,
        total: rangeTransactions.length,
        fraudulent,
        fraudRate: rangeTransactions.length > 0 ? (fraudulent / rangeTransactions.length * 100) : 0
      };
    });
  };

  const timeData = prepareTimeData();
  const amountData = prepareAmountDistribution();

  return (
    <div className="space-y-6">
      {/* Graphique temporel */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-6">Évolution des Transactions (7 derniers jours)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="date" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
              formatter={(value, name) => [
                name === 'fraudRate' ? `${value.toFixed(1)}%` : value,
                name === 'total' ? 'Total' : 
                name === 'fraudulent' ? 'Frauduleuses' : 'Taux de Fraude'
              ]}
            />
            <Line 
              type="monotone" 
              dataKey="total" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              name="total"
            />
            <Line 
              type="monotone" 
              dataKey="fraudulent" 
              stroke="#ef4444" 
              strokeWidth={2}
              dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
              name="fraudulent"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Distribution par montant */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-6">Distribution des Fraudes par Montant</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={amountData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="range" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
              formatter={(value, name) => [
                name === 'fraudRate' ? `${value.toFixed(1)}%` : value,
                name === 'total' ? 'Total' : 
                name === 'fraudulent' ? 'Frauduleuses' : 'Taux'
              ]}
            />
            <Bar dataKey="total" fill="#3b82f6" name="total" radius={[4, 4, 0, 0]} />
            <Bar dataKey="fraudulent" fill="#ef4444" name="fraudulent" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RealTimeChart;