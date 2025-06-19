import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  Settings, 
  BarChart3, 
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Brain,
  Target,
  Activity,
  History,
  Download
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const TransactionGenerator = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const [generationConfig, setGenerationConfig] = useState({
    count: 50,
    type: 'classic',
    speed: 1000,
    fraudRate: 0.1,
    banqueId: user?.id || 1
  });

  const [generationStats, setGenerationStats] = useState({
    total: 0,
    processed: 0,
    frauds: 0,
    legitimate: 0,
    errors: 0,
    avgFraudScore: 0,
    startTime: null,
    endTime: null
  });

  const [realtimeResults, setRealtimeResults] = useState([]);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [allResults, setAllResults] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Simulateur de modèle IA pour la détection de fraude
  const simulateFraudDetection = (transactionData) => {
    const { _simulatedFraud, transaction_amount, amount, transaction_type, merchant_category, age, account_balance } = transactionData;
    
    let fraudScore = Math.random() * 0.3; // Score de base faible
    
    // Facteurs qui augmentent le score de fraude
    const transAmount = transaction_amount || amount || 0;
    
    // Montants élevés = plus suspect
    if (transAmount > 5000) fraudScore += 0.4;
    else if (transAmount > 2000) fraudScore += 0.2;
    
    // Types de transactions suspects
    if (transaction_type === 'retrait' && transAmount > 1000) fraudScore += 0.3;
    if (merchant_category === 'électronique' && transAmount > 3000) fraudScore += 0.2;
    
    // Âge suspect
    if (age && (age < 20 || age > 70)) fraudScore += 0.1;
    
    // Solde vs montant
    if (account_balance && transAmount > account_balance * 0.8) fraudScore += 0.3;
    
    // Heure suspecte (simulation)
    const hour = new Date().getHours();
    if (hour < 6 || hour > 23) fraudScore += 0.2;
    
    // Si c'est une fraude simulée, on augmente artificiellement le score
    if (_simulatedFraud) {
      fraudScore = Math.max(fraudScore, 0.7 + Math.random() * 0.3);
    } else {
      // Pour les transactions légitimes, on garde un score plus bas
      fraudScore = Math.min(fraudScore, 0.6);
    }
    
    // Ajouter un peu de randomness pour simuler l'incertitude du modèle
    fraudScore += (Math.random() - 0.5) * 0.1;
    fraudScore = Math.max(0, Math.min(1, fraudScore)); // Clamp entre 0 et 1
    
    return {
      fraud_probability: fraudScore,
      is_fraud: fraudScore > 0.8,
      confidence: 0.85 + Math.random() * 0.1 // Confiance du modèle
    };
  };

  // Simulateur de réponse serveur
  const simulateServerResponse = async (transactionData) => {
    // Simuler le temps de traitement du serveur (100-500ms)
    const processingTime = 100 + Math.random() * 400;
    
    // Simuler parfois des erreurs (5% de chance)
    if (Math.random() < 0.05) {
      throw new Error('Erreur de connexion au serveur');
    }
    
    const fraudDetection = simulateFraudDetection(transactionData);
    
    // Simuler la réponse du serveur
    return {
      id: Math.floor(Math.random() * 1000000) + 1,
      transaction_id: transactionData.transaction_id || `CARD-${Date.now()}`,
      transaction_amount: transactionData.transaction_amount,
      amount: transactionData.amount,
      fraud_probability: fraudDetection.fraud_probability,
      is_fraud: fraudDetection.is_fraud,
      confidence: fraudDetection.confidence,
      processing_time: Math.round(processingTime),
      timestamp: new Date().toISOString(),
      status: 'processed'
    };
  };

  const generateRandomClassicTransaction = () => {
    const names = ['Mohammed Alami', 'Fatima Benali', 'Ahmed Tazi', 'Aicha Idrissi', 'Omar Benjelloun', 'Khadija Mansouri', 'Youssef Berrada', 'Nadia Cherkaoui'];
    const cities = ['Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir', 'Meknès', 'Oujda'];
    const categories = ['électronique', 'vêtements', 'alimentation', 'carburant', 'restaurant', 'pharmacie', 'transport', 'divertissement'];
    const transactionTypes = ['achat', 'retrait', 'virement', 'paiement'];

    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomCity = cities[Math.floor(Math.random() * cities.length)];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const randomType = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];

    const isFraudSimulated = Math.random() < generationConfig.fraudRate;
    const baseAmount = Math.random() * 2000 + 100;
    const amount = isFraudSimulated ? baseAmount * (2 + Math.random() * 3) : baseAmount;

    return {
      customer_id: Math.floor(Math.random() * 10000) + 1,
      customer_name: randomName,
      gender: Math.random() > 0.5 ? 'M' : 'F',
      age: Math.floor(Math.random() * 50) + 18,
      state: randomCity,
      city: randomCity,
      bank_branch: 'Centre',
      account_type: Math.random() > 0.7 ? 'épargne' : 'courant',
      transaction_id: `TXN${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      transaction_date: new Date().toISOString(),
      transaction_time: new Date().toTimeString().slice(0, 8),
      transaction_amount: parseFloat(amount.toFixed(2)),
      merchant_id: Math.floor(Math.random() * 100) + 1,
      transaction_type: randomType,
      merchant_category: randomCategory,
      account_balance: parseFloat((Math.random() * 10000 + 1000).toFixed(2)),
      transaction_device: Math.random() > 0.5 ? 'mobile' : 'web',
      transaction_location: randomCity,
      device_type: Math.random() > 0.5 ? 'Android' : 'iOS',
      transaction_currency: 'MAD',
      customer_contact: `06${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
      transaction_description: `${randomType} ${randomCategory}`,
      customer_email: `${randomName.toLowerCase().replace(' ', '.')}@email.com`,
      banque_id: user?.id || 1,
      _simulatedFraud: isFraudSimulated
    };
  };

  const generateRandomCardTransaction = () => {
    const isFraudSimulated = Math.random() < generationConfig.fraudRate;
    const baseAmount = Math.random() * 1000 + 10;
    const amount = isFraudSimulated ? baseAmount * (2 + Math.random() * 2) : baseAmount;

    const transaction = {
      time: Date.now() / 1000,
      amount: parseFloat(amount.toFixed(2)),
      _simulatedFraud: isFraudSimulated
    };
    
    for (let i = 1; i <= 28; i++) {
      let value = (Math.random() * 2 - 1);
      if (isFraudSimulated && [1, 2, 3, 14, 17].includes(i)) {
        value = value * (2 + Math.random());
      }
      transaction[`v${i}`] = parseFloat(value.toFixed(4));
    }
    
    return transaction;
  };

  const processNextTransaction = async () => {
    if (currentIndex >= generationConfig.count) {
      // Fin de la génération
      setIsGenerating(false);
      setCurrentTransaction(null);
      setGenerationStats(prev => ({
        ...prev,
        endTime: new Date()
      }));
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      // Calculer les statistiques finales
      const correctPredictions = allResults.filter(r => r.simulatedFraud === r.isFraud).length;
      const predictionAccuracy = allResults.length > 0 ? ((correctPredictions / allResults.length) * 100).toFixed(1) : 0;
      
      toast.success(`✅ Analyse terminée ! ${generationStats.processed} transactions traitées\n🎯 Précision du modèle: ${predictionAccuracy}%`, {
        duration: 5000
      });
      return;
    }

    try {
      const transactionData = generationConfig.type === 'classic' 
        ? generateRandomClassicTransaction()
        : generateRandomCardTransaction();

      setCurrentTransaction(transactionData);

      // Simuler l'envoi au serveur et la réponse
      const startTime = Date.now();
      const result = await simulateServerResponse(transactionData);
      const responseTime = Date.now() - startTime;
      
      const fraudScore = result.fraud_probability;
      const isFraud = result.is_fraud;
      
      const resultEntry = {
        id: result.id,
        transactionId: result.transaction_id,
        amount: result.transaction_amount || result.amount,
        fraudScore,
        isFraud,
        responseTime,
        timestamp: new Date(),
        simulatedFraud: transactionData._simulatedFraud,
        type: generationConfig.type,
        confidence: result.confidence,
        transactionData: transactionData
      };
      
      // Mettre à jour les stats
      setGenerationStats(prev => {
        const newProcessed = prev.processed + 1;
        const newFrauds = isFraud ? prev.frauds + 1 : prev.frauds;
        const newLegitimate = !isFraud ? prev.legitimate + 1 : prev.legitimate;
        const newTotalFraudScore = prev.avgFraudScore * prev.processed + fraudScore;
        
        return {
          ...prev,
          processed: newProcessed,
          frauds: newFrauds,
          legitimate: newLegitimate,
          avgFraudScore: newTotalFraudScore / newProcessed
        };
      });

      // Ajouter aux résultats
      setAllResults(prev => [...prev, resultEntry]);
      setRealtimeResults(prev => [resultEntry, ...prev].slice(0, 20));
      setCurrentIndex(prev => prev + 1);

    } catch (error) {
      console.error('Erreur lors de la génération:', error);
      setGenerationStats(prev => ({
        ...prev,
        errors: prev.errors + 1
      }));
      
      toast.error(`⚠️ Erreur: ${error.message}`, { duration: 2000 });
      setCurrentIndex(prev => prev + 1);
    }
  };

  const startGeneration = async () => {
    if (generationConfig.count <= 0) {
      toast.error('Veuillez spécifier un nombre de transactions valide');
      return;
    }

    setIsGenerating(true);
    setIsPaused(false);
    setCurrentIndex(0);
    setGenerationStats({
      total: generationConfig.count,
      processed: 0,
      frauds: 0,
      legitimate: 0,
      errors: 0,
      avgFraudScore: 0,
      startTime: new Date(),
      endTime: null
    });
    setRealtimeResults([]);
    setAllResults([]);
    setCurrentTransaction(null);

    toast.success(`🚀 Démarrage de l'analyse IA de ${generationConfig.count} transactions ${generationConfig.type === 'classic' ? 'classiques' : 'par carte'}`);

    // Démarrer l'intervalle
    intervalRef.current = setInterval(() => {
      if (!isPaused) {
        processNextTransaction();
      }
    }, generationConfig.speed);
  };

  const pauseGeneration = () => {
    setIsPaused(true);
    toast.info('⏸️ Génération mise en pause');
  };

  const resumeGeneration = () => {
    setIsPaused(false);
    toast.info('▶️ Génération reprise');
  };

  const stopGeneration = () => {
    setIsGenerating(false);
    setIsPaused(false);
    setCurrentTransaction(null);
    setGenerationStats(prev => ({
      ...prev,
      endTime: new Date()
    }));
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    toast.warning('⏹️ Génération arrêtée');
  };

  const calculateDuration = () => {
    if (!generationStats.startTime) return 0;
    const endTime = generationStats.endTime || new Date();
    return Math.round((endTime - generationStats.startTime) / 1000);
  };

  const calculateThroughput = () => {
    const duration = calculateDuration();
    return duration > 0 ? (generationStats.processed / duration).toFixed(2) : 0;
  };

  const calculateAccuracy = () => {
    if (allResults.length === 0) return 0;
    const correctPredictions = allResults.filter(r => r.simulatedFraud === r.isFraud).length;
    return ((correctPredictions / allResults.length) * 100).toFixed(1);
  };

  const exportResults = () => {
    const exportData = {
      config: generationConfig,
      stats: generationStats,
      results: allResults,
      summary: {
        accuracy: calculateAccuracy(),
        duration: calculateDuration(),
        throughput: calculateThroughput()
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fraud-analysis-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('📁 Résultats exportés avec succès');
  };

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" />
        <span className="ml-4 text-gray-600">Veuillez vous connecter pour accéder au simulateur.</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">🧠 Générateur de Transactions IA</h1>
        <p className="text-gray-600 mt-2">
          Simulateur intelligent pour tester les modèles de détection de fraude en temps réel
        </p>
        <div className="mt-3 flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-700 font-medium">IA Active</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-blue-700 font-medium">Mode Simulation</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-purple-700 font-medium">Temps Réel</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Configuration Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Configuration</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de transactions
                </label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={generationConfig.count}
                  onChange={(e) => setGenerationConfig({
                    ...generationConfig,
                    count: parseInt(e.target.value) || 1
                  })}
                  disabled={isGenerating}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de transaction
                </label>
                <select
                  value={generationConfig.type}
                  onChange={(e) => setGenerationConfig({
                    ...generationConfig,
                    type: e.target.value
                  })}
                  disabled={isGenerating}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                >
                  <option value="classic">🏦 Transactions Classiques</option>
                  <option value="card">💳 Transactions par Carte</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vitesse d'analyse
                </label>
                <select
                  value={generationConfig.speed}
                  onChange={(e) => setGenerationConfig({
                    ...generationConfig,
                    speed: parseInt(e.target.value)
                  })}
                  disabled={isGenerating}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                >
                  <option value="500">⚡ Très Rapide (0.5s)</option>
                  <option value="1000">🚀 Rapide (1s)</option>
                  <option value="2000">⏱️ Normal (2s)</option>
                  <option value="5000">🐌 Lent (5s)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Taux de fraude simulé ({(generationConfig.fraudRate * 100).toFixed(0)}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="0.5"
                  step="0.05"
                  value={generationConfig.fraudRate}
                  onChange={(e) => setGenerationConfig({
                    ...generationConfig,
                    fraudRate: parseFloat(e.target.value)
                  })}
                  disabled={isGenerating}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID Banque
                </label>
                <input
                  type="text"
                  value={`Banque ${user?.id || 1} (${user?.nom || 'Utilisateur'})`}
                  readOnly
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 text-gray-600"
                />
              </div>
            </div>

            {/* Control Buttons */}
            <div className="mt-6 space-y-3">
              {!isGenerating ? (
                <button
                  onClick={startGeneration}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Play className="h-5 w-5" />
                  <span>🚀 Démarrer l'Analyse IA</span>
                </button>
              ) : (
                <div className="space-y-2">
                  {!isPaused ? (
                    <button
                      onClick={pauseGeneration}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
                    >
                      <Pause className="h-5 w-5" />
                      <span>⏸️ Pause</span>
                    </button>
                  ) : (
                    <button
                      onClick={resumeGeneration}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      <Play className="h-5 w-5" />
                      <span>▶️ Reprendre</span>
                    </button>
                  )}
                  <button
                    onClick={stopGeneration}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    <Square className="h-5 w-5" />
                    <span>⏹️ Arrêter</span>
                  </button>
                </div>
              )}
              
              {allResults.length > 0 && (
                <div className="space-y-2 pt-3 border-t border-gray-200">
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <History className="h-4 w-4" />
                    <span>📋 Historique ({allResults.length})</span>
                  </button>
                  <button
                    onClick={exportResults}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    <span>💾 Exporter</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-xs text-gray-600">Traitées</p>
                  <p className="text-lg font-bold text-gray-900">
                    {generationStats.processed}/{generationStats.total}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-xs text-gray-600">Fraudes</p>
                  <p className="text-lg font-bold text-red-600">{generationStats.frauds}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-xs text-gray-600">Légitimes</p>
                  <p className="text-lg font-bold text-green-600">{generationStats.legitimate}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-xs text-gray-600">Précision IA</p>
                  <p className="text-lg font-bold text-purple-600">
                    {calculateAccuracy()}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          {isGenerating && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Progression de l'analyse</span>
                <span className="text-sm text-gray-500">
                  {((generationStats.processed / generationStats.total) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-300 relative overflow-hidden"
                  style={{ width: `${(generationStats.processed / generationStats.total) * 100}%` }}
                >
                  <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
                </div>
              </div>
              {isPaused && (
                <p className="text-yellow-600 text-sm mt-2 flex items-center space-x-1">
                  <Pause className="h-4 w-4" />
                  <span>⏸️ Analyse en pause</span>
                </p>
              )}
            </div>
          )}

          {/* Current Transaction */}
          {currentTransaction && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Zap className="h-5 w-5 text-blue-600 animate-pulse" />
                <span>🔍 Transaction en cours d'analyse</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">ID:</span>
                  <span className="ml-2 font-medium">{currentTransaction.transaction_id || 'Card-Transaction'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Montant:</span>
                  <span className="ml-2 font-medium">
                    {new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' })
                      .format(currentTransaction.transaction_amount || currentTransaction.amount)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Type:</span>
                  <span className="ml-2 font-medium capitalize">
                    {generationConfig.type === 'classic' ? '🏦 Classique' : '💳 Carte'}
                  </span>
                </div>
              </div>
              <div className="mt-4 flex items-center space-x-2">
                <LoadingSpinner size="small" />
                <span className="text-sm text-gray-600">🧠 Analyse IA en cours...</span>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}

          {/* Real-time Results */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>📊 Résultats Temps Réel</span>
            </h3>
            
            {realtimeResults.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {realtimeResults.map((result, index) => (
                  <div 
                    key={result.id} 
                    className={`p-4 rounded-lg border-l-4 transition-all duration-300 ${
                      result.isFraud ? 'border-red-500 bg-red-50' : 'border-green-500 bg-green-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {result.isFraud ? (
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                        ) : (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{result.transactionId}</p>
                          <p className="text-sm text-gray-600">
                            {new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' })
                              .format(result.amount)} • Score: {(result.fraudScore * 100).toFixed(1)}%
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${result.isFraud ? 'text-red-600' : 'text-green-600'}`}>
                          {result.isFraud ? '🚨 FRAUDE' : '✅ LÉGITIME'}
                        </p>
                        <p className="text-xs text-gray-500">{result.responseTime}ms</p>
                      </div>
                    </div>
                    {result.simulatedFraud !== undefined && (
                      <div className="mt-2 text-xs">
                        <span className={`px-2 py-1 rounded-full ${
                          result.simulatedFraud === result.isFraud 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {result.simulatedFraud === result.isFraud ? '🎯 Prédiction correcte' : '⚠️ Prédiction incorrecte'}
                        </span>
                        {result.confidence && (
                          <span className="ml-2 px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                            Confiance: {(result.confidence * 100).toFixed(1)}%
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Brain className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium">🤖 IA en attente</p>
                <p className="text-sm">Démarrez l'analyse pour voir les résultats en temps réel</p>
              </div>
            )}
          </div>

          {/* Performance Stats */}
          {generationStats.processed > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>📈 Statistiques de Performance</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">⏱️ Durée:</span>
                  <span className="ml-2 font-medium">{calculateDuration()}s</span>
                </div>
                <div>
                  <span className="text-gray-600">⚡ Débit:</span>
                  <span className="ml-2 font-medium">{calculateThroughput()} tx/s</span>
                </div>
                <div>
                  <span className="text-gray-600">❌ Erreurs:</span>
                  <span className="ml-2 font-medium text-red-600">{generationStats.errors}</span>
                </div>
                <div>
                  <span className="text-gray-600">✅ Réussite:</span>
                  <span className="ml-2 font-medium text-green-600">
                    {generationStats.processed > 0 
                      ? (((generationStats.processed - generationStats.errors) / generationStats.processed) * 100).toFixed(1)
                      : 0
                    }%
                  </span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">🎯 Précision IA:</span>
                    <span className="ml-2 font-medium text-purple-600">{calculateAccuracy()}%</span>
                  </div>
                  <div>
                    <span className="text-gray-600">📊 Score moyen:</span>
                    <span className="ml-2 font-medium text-blue-600">
                      {(generationStats.avgFraudScore * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* History Modal */}
          {showHistory && allResults.length > 0 && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-96 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      📋 Historique Complet ({allResults.length} transactions)
                    </h3>
                    <button
                      onClick={() => setShowHistory(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ×
                    </button>
                  </div>
                  
                  <div className="overflow-y-auto max-h-80">
                    <div className="space-y-2">
                      {allResults.map((result, index) => (
                        <div 
                          key={result.id}
                          className={`p-3 rounded border-l-4 text-sm ${
                            result.isFraud ? 'border-red-500 bg-red-50' : 'border-green-500 bg-green-50'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{result.transactionId}</span>
                            <div className="flex items-center space-x-2">
                              <span className={result.isFraud ? 'text-red-600' : 'text-green-600'}>
                                {result.isFraud ? '🚨' : '✅'}
                              </span>
                              <span className="text-gray-600">
                                {(result.fraudScore * 100).toFixed(1)}%
                              </span>
                              <span className="text-xs text-gray-500">
                                {result.responseTime}ms
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionGenerator;