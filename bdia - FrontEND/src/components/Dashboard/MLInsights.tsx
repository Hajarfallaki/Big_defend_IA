import React from 'react';
import { Brain, TrendingUp, AlertTriangle, Target } from 'lucide-react';
import { RiskMetrics } from '../../types';

interface MLInsightsProps {
  riskMetrics: RiskMetrics;
}

const MLInsights: React.FC<MLInsightsProps> = ({ riskMetrics }) => {
  const f1Score = (2 * riskMetrics.precision * riskMetrics.recall) / (riskMetrics.precision + riskMetrics.recall);
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Brain className="h-6 w-6 text-purple-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800">Insights BigDefend AI</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {(riskMetrics.accuracy * 100).toFixed(1)}%
          </div>
          <div className="text-sm text-slate-600 mt-1">Précision</div>
          <div className="flex items-center justify-center mt-2">
            <Target className="h-4 w-4 text-blue-500" />
          </div>
        </div>

        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {(riskMetrics.precision * 100).toFixed(1)}%
          </div>
          <div className="text-sm text-slate-600 mt-1">Précision</div>
          <div className="flex items-center justify-center mt-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
        </div>

        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {(riskMetrics.recall * 100).toFixed(1)}%
          </div>
          <div className="text-sm text-slate-600 mt-1">Rappel</div>
          <div className="flex items-center justify-center mt-2">
            <AlertTriangle className="h-4 w-4 text-purple-500" />
          </div>
        </div>

        <div className="text-center p-4 bg-orange-50 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">
            {(f1Score * 100).toFixed(1)}%
          </div>
          <div className="text-sm text-slate-600 mt-1">F1-Score</div>
          <div className="flex items-center justify-center mt-2">
            <Brain className="h-4 w-4 text-orange-500" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
          <div>
            <p className="font-medium text-slate-800">Transactions Analysées</p>
            <p className="text-sm text-slate-600">Dataset Kaggle Credit Card Fraud</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-slate-800">
              {riskMetrics.totalTransactions.toLocaleString()}
            </p>
            <p className="text-sm text-green-600">+100% Couverture</p>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
          <div>
            <p className="font-medium text-slate-800">Fraudes Détectées</p>
            <p className="text-sm text-slate-600">Basé sur l'analyse PCA</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-red-600">
              {riskMetrics.flaggedTransactions}
            </p>
            <p className="text-sm text-slate-600">
              {((riskMetrics.flaggedTransactions / riskMetrics.totalTransactions) * 100).toFixed(2)}% du total
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
          <div>
            <p className="font-medium text-slate-800">Faux Positifs</p>
            <p className="text-sm text-slate-600">Optimisation continue</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-yellow-600">
              {riskMetrics.falsePositives}
            </p>
            <p className="text-sm text-slate-600">
              {((riskMetrics.falsePositives / riskMetrics.flaggedTransactions) * 100).toFixed(1)}% des alertes
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Brain className="h-5 w-5 text-purple-600" />
          <span className="font-medium text-slate-800">Modèle ML Actuel</span>
        </div>
        <p className="text-sm text-slate-600">
          Analyse par Composantes Principales (PCA) avec 28 features anonymisées.
          Le modèle BigDefend AI utilise des algorithmes d'apprentissage automatique
          pour détecter les patterns de fraude en temps réel.
        </p>
      </div>
    </div>
  );
};

export default MLInsights;