import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const data = [
  { name: 'Lun', transactions: 1200, flagged: 45 },
  { name: 'Mar', transactions: 1100, flagged: 38 },
  { name: 'Mer', transactions: 1350, flagged: 52 },
  { name: 'Jeu', transactions: 1250, flagged: 41 },
  { name: 'Ven', transactions: 1400, flagged: 48 },
  { name: 'Sam', transactions: 900, flagged: 25 },
  { name: 'Dim', transactions: 800, flagged: 22 },
];

const TransactionChart: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-6">Transactions de la Semaine</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="name" stroke="#64748b" />
          <YAxis stroke="#64748b" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#ffffff', 
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
          />
          <Bar dataKey="transactions" fill="#3b82f6" name="Transactions" radius={[4, 4, 0, 0]} />
          <Bar dataKey="flagged" fill="#ef4444" name="Signalées" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TransactionChart;