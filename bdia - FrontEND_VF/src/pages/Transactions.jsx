import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Filter, 
  Download, 
  Search,
  CreditCard,
  Smartphone,
  Calendar,
  DollarSign,
  ToggleLeft,
  ToggleRight,
  Zap
} from 'lucide-react';
import TransactionCard from '../components/TransactionCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { transactionService } from '../services/transactionService';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const Transactions = () => {
  const { user } = useAuthStore();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [transactionType, setTransactionType] = useState('classic'); // 'classic' or 'card'
  const [viewMode, setViewMode] = useState('classic'); // Mode d'affichage des transactions
  
  const [filters, setFilters] = useState({
    search: '',
    fraudLevel: 'all',
    dateFrom: '',
    dateTo: '',
  });

  // Form data for classic transactions
  const [classicForm, setClassicForm] = useState({
    customer_id: '',
    customer_name: '',
    gender: 'M',
    age: '',
    state: '',
    city: '',
    bank_branch: '',
    account_type: 'courant',
    transaction_id: '',
    transaction_date: '',
    transaction_time: '',
    transaction_amount: '',
    merchant_id: '',
    transaction_type: 'achat',
    merchant_category: '',
    account_balance: '',
    transaction_device: 'mobile',
    transaction_location: '',
    device_type: 'Android',
    transaction_currency: 'MAD',
    customer_contact: '',
    transaction_description: '',
    customer_email: '',
    banque_id: user?.id || 1,
  });

  // Form data for card transactions
  const [cardForm, setCardForm] = useState({
    time: '',
    amount: '',
    v1: '', v2: '', v3: '', v4: '', v5: '', v6: '', v7: '', v8: '', v9: '', v10: '',
    v11: '', v12: '', v13: '', v14: '', v15: '', v16: '', v17: '', v18: '', v19: '', v20: '',
    v21: '', v22: '', v23: '', v24: '', v25: '', v26: '', v27: '', v28: '',
  });

  useEffect(() => {
    loadTransactions();
  }, [user, viewMode]);

  // Filtrer les transactions par banque si l'utilisateur est client_banque
  useEffect(() => {
    if (user?.role === 'client_banque' && user?.id) {
      setTransactions((prev) => prev.filter(t => t.banque_id === user.id));
    }
  }, [user]);

  useEffect(() => {
    applyFilters();
  }, [transactions, filters]);

  const loadTransactions = async () => {
    setIsLoading(true);
    try {
      let data;
      
      if (viewMode === 'classic') {
        // Charger les transactions classiques
        if (user?.role === 'client_banque') {
          data = await transactionService.getBankTransactions(user.id || 1);
        } else {
          data = await transactionService.getAllTransactions();
        }
      } else {
        // Charger les transactions par carte de crédit
        data = await transactionService.getAllCreditCardTransactions();
      }
      
      setTransactions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading transactions:', error);
      toast.error('Erreur lors du chargement des transactions');
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = transactions;

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(t => 
        t.transaction_id?.toString().includes(filters.search) ||
        t.customer_name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        t.transaction_description?.toLowerCase().includes(filters.search.toLowerCase()) ||
        t.id?.toString().includes(filters.search)
      );
    }

    // Fraud level filter
    if (filters.fraudLevel !== 'all') {
      if (filters.fraudLevel === 'high') {
        filtered = filtered.filter(t => (t.fraud_probability || (t.is_fraud ? 0.9 : 0.1)) > 0.8);
      } else if (filters.fraudLevel === 'medium') {
        const prob = t => t.fraud_probability || (t.is_fraud ? 0.9 : 0.1);
        filtered = filtered.filter(t => prob(t) > 0.5 && prob(t) <= 0.8);
      } else if (filters.fraudLevel === 'low') {
        filtered = filtered.filter(t => (t.fraud_probability || (t.is_fraud ? 0.9 : 0.1)) <= 0.5);
      }
    }

    // Date filter
    if (filters.dateFrom) {
      filtered = filtered.filter(t => {
        const transDate = t.transaction_date || new Date(t.time * 1000);
        return new Date(transDate) >= new Date(filters.dateFrom);
      });
    }
    if (filters.dateTo) {
      filtered = filtered.filter(t => {
        const transDate = t.transaction_date || new Date(t.time * 1000);
        return new Date(transDate) <= new Date(filters.dateTo);
      });
    }

    setFilteredTransactions(filtered);
  };

  const generateRandomClassicTransaction = () => {
    const names = ['Mohammed Alami', 'Fatima Benali', 'Ahmed Tazi', 'Aicha Idrissi', 'Omar Benjelloun'];
    const cities = ['Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger'];
    const merchants = ['Marjane', 'Electroplanet', 'Zara', 'McDonald\'s', 'Shell'];
    const categories = ['électronique', 'vêtements', 'alimentation', 'carburant', 'restaurant'];

    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomCity = cities[Math.floor(Math.random() * cities.length)];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];

    setClassicForm({
      ...classicForm,
      customer_id: Math.floor(Math.random() * 10000) + 1,
      customer_name: randomName,
      age: Math.floor(Math.random() * 50) + 18,
      state: randomCity,
      city: randomCity,
      bank_branch: 'Centre',
      transaction_id: `TXN${Date.now()}`,
      transaction_date: new Date().toISOString().slice(0, 16),
      transaction_time: new Date().toTimeString().slice(0, 8),
      transaction_amount: (Math.random() * 5000 + 100).toFixed(2),
      merchant_id: Math.floor(Math.random() * 100) + 1,
      merchant_category: randomCategory,
      account_balance: (Math.random() * 10000 + 1000).toFixed(2),
      transaction_location: randomCity,
      customer_contact: `06${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
      transaction_description: `Achat ${randomCategory}`,
      customer_email: `${randomName.toLowerCase().replace(' ', '.')}@email.com`,
    });
  };

  const generateRandomCardTransaction = () => {
    const form = { ...cardForm };
    form.time = Date.now() / 1000;
    form.amount = (Math.random() * 1000 + 10).toFixed(2);
    
    // Generate random V values (PCA components)
    for (let i = 1; i <= 28; i++) {
      form[`v${i}`] = (Math.random() * 2 - 1).toFixed(4);
    }
    
    setCardForm(form);
  };

  const handleSubmitTransaction = async (e) => {
    e.preventDefault();
    
    try {
      let transactionData;
      
      if (transactionType === 'classic') {
        transactionData = {
          customer_id: parseInt(classicForm.customer_id),
          customer_name: classicForm.customer_name,
          gender: classicForm.gender,
          age: parseInt(classicForm.age),
          state: classicForm.state,
          city: classicForm.city,
          bank_branch: classicForm.bank_branch || 'Centre',
          account_type: classicForm.account_type || 'courant',
          transaction_id: classicForm.transaction_id ? parseInt(classicForm.transaction_id) : Date.now(),
          transaction_date: new Date(classicForm.transaction_date).toISOString(),
          transaction_time: classicForm.transaction_time || new Date().toTimeString().slice(0,8),
          transaction_amount: parseFloat(classicForm.transaction_amount),
          merchant_id: parseInt(classicForm.merchant_id),
          transaction_type: classicForm.transaction_type || 'achat',
          merchant_category: classicForm.merchant_category,
          account_balance: parseFloat(classicForm.account_balance),
          transaction_device: classicForm.transaction_device || 'mobile',
          transaction_location: classicForm.transaction_location || classicForm.city,
          device_type: classicForm.device_type || 'Android',
          transaction_currency: classicForm.transaction_currency || 'MAD',
          customer_contact: classicForm.customer_contact,
          transaction_description: classicForm.transaction_description,
          customer_email: classicForm.customer_email,
          banque_id: parseInt(classicForm.banque_id) || (user?.id || 1),
        };
        await transactionService.createTransaction(transactionData);
      } else {
        transactionData = {
          ...cardForm,
          time: parseFloat(cardForm.time),
          amount: parseFloat(cardForm.amount),
        };
        
        // Convert V values to numbers
        for (let i = 1; i <= 28; i++) {
          transactionData[`v${i}`] = parseFloat(cardForm[`v${i}`]);
        }
        
        await transactionService.createCreditCardTransaction(transactionData);
      }

      toast.success('Transaction créée avec succès');
      setShowAddModal(false);
      loadTransactions();
      
      // Reset forms
      if (transactionType === 'classic') {
        setClassicForm({
          ...classicForm,
          customer_id: '',
          customer_name: '',
          transaction_id: '',
          transaction_amount: '',
          transaction_description: '',
        });
      } else {
        setCardForm({
          time: '',
          amount: '',
          v1: '', v2: '', v3: '', v4: '', v5: '', v6: '', v7: '', v8: '', v9: '', v10: '',
          v11: '', v12: '', v13: '', v14: '', v15: '', v16: '', v17: '', v18: '', v19: '', v20: '',
          v21: '', v22: '', v23: '', v24: '', v25: '', v26: '', v27: '', v28: '',
        });
      }
    } catch (error) {
      console.error('Error creating transaction:', error);
      // Affiche le détail de l’erreur FastAPI si disponible
      if (error.response && error.response.data && error.response.data.detail) {
        toast.error('Erreur: ' + JSON.stringify(error.response.data.detail));
      } else {
        toast.error('Erreur lors de la création de la transaction');
      }
    }
  };

  const handleExport = async () => {
    try {
      let data;
      if (viewMode === 'classic') {
        data = await transactionService.exportTransactions();
      } else {
        data = await transactionService.exportCreditCardTransactions();
      }
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${viewMode}_transactions_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Export réussi');
    } catch (error) {
      toast.error('Erreur lors de l\'export');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600 mt-2">
            Gestion et surveillance des transactions - {viewMode === 'classic' ? 'Classiques' : 'Cartes de Crédit'}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('classic')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'classic'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <CreditCard className="h-4 w-4" />
              <span>Classiques</span>
            </button>
            <button
              onClick={() => setViewMode('card')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'card'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Smartphone className="h-4 w-4" />
              <span>Cartes</span>
            </button>
          </div>
          
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Exporter</span>
          </button>
          {['client_banque', 'admin'].includes(user?.role) && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Nouvelle Transaction</span>
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <CreditCard className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{transactions.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100">
              <Zap className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Fraudes</p>
              <p className="text-2xl font-bold text-gray-900">
                {transactions.filter(t => t.is_fraud || (t.fraud_probability && t.fraud_probability > 0.8)).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Montant Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Intl.NumberFormat('fr-MA', {
                  style: 'currency',
                  currency: 'MAD',
                  minimumFractionDigits: 0,
                }).format(
                  transactions.reduce((sum, t) => sum + (t.transaction_amount || t.amount || 0), 0)
                )}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Aujourd'hui</p>
              <p className="text-2xl font-bold text-gray-900">
                {transactions.filter(t => {
                  const transDate = t.transaction_date || new Date(t.time * 1000);
                  return new Date(transDate).toDateString() === new Date().toDateString();
                }).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recherche
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="ID, nom, description..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Niveau de Fraude
            </label>
            <select
              value={filters.fraudLevel}
              onChange={(e) => setFilters({ ...filters, fraudLevel: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous</option>
              <option value="high">Élevé (&gt;80%)</option>
              <option value="medium">Moyen (50-80%)</option>
              <option value="low">Faible (&lt;50%)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date de début
            </label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date de fin
            </label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-4">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((transaction) => (
            <TransactionCard
              key={transaction.id}
              transaction={transaction}
              type={viewMode}
              onInvestigate={(transaction) => {
                toast.success('Investigation initiée');
              }}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune transaction trouvée
            </h3>
            <p className="text-gray-600">
              {transactions.length === 0 
                ? 'Commencez par ajouter des transactions'
                : 'Essayez de modifier vos filtres'
              }
            </p>
          </div>
        )}
      </div>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Nouvelle Transaction
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              {/* Transaction Type Selector */}
              <div className="flex items-center space-x-4 mb-6">
                <button
                  onClick={() => setTransactionType('classic')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                    transactionType === 'classic'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <CreditCard className="h-4 w-4" />
                  <span>Transaction Classique</span>
                </button>
                <button
                  onClick={() => setTransactionType('card')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                    transactionType === 'card'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Smartphone className="h-4 w-4" />
                  <span>Transaction Carte</span>
                </button>
              </div>

              <form onSubmit={handleSubmitTransaction}>
                {transactionType === 'classic' ? (
                  <div className="space-y-6">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={generateRandomClassicTransaction}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                      >
                        Générer Données Aléatoires
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Customer Info */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ID Client *
                        </label>
                        <input
                          type="number"
                          required
                          value={classicForm.customer_id}
                          onChange={(e) => setClassicForm({ ...classicForm, customer_id: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nom Client *
                        </label>
                        <input
                          type="text"
                          required
                          value={classicForm.customer_name}
                          onChange={(e) => setClassicForm({ ...classicForm, customer_name: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={classicForm.customer_email}
                          onChange={(e) => setClassicForm({ ...classicForm, customer_email: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Âge *
                        </label>
                        <input
                          type="number"
                          required
                          value={classicForm.age}
                          onChange={(e) => setClassicForm({ ...classicForm, age: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ville *
                        </label>
                        <input
                          type="text"
                          required
                          value={classicForm.city}
                          onChange={(e) => setClassicForm({ ...classicForm, city: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ID Transaction *
                        </label>
                        <input
                          type="text"
                          required
                          value={classicForm.transaction_id}
                          onChange={(e) => setClassicForm({ ...classicForm, transaction_id: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date/Heure *
                        </label>
                        <input
                          type="datetime-local"
                          required
                          value={classicForm.transaction_date}
                          onChange={(e) => setClassicForm({ ...classicForm, transaction_date: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Montant *
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={classicForm.transaction_amount}
                          onChange={(e) => setClassicForm({ ...classicForm, transaction_amount: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Catégorie Marchand
                        </label>
                        <input
                          type="text"
                          value={classicForm.merchant_category}
                          onChange={(e) => setClassicForm({ ...classicForm, merchant_category: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Banque ID
                        </label>
                        <input
                          type="number"
                          required
                          value={classicForm.banque_id}
                          onChange={(e) => setClassicForm({ ...classicForm, banque_id: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          readOnly={!!user?.id}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <input
                          type="text"
                          value={classicForm.transaction_description}
                          onChange={(e) => setClassicForm({ ...classicForm, transaction_description: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={generateRandomCardTransaction}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                      >
                        Générer Données Aléatoires
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Time *
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          required
                          value={cardForm.time}
                          onChange={(e) => setCardForm({ ...cardForm, time: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Montant *
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={cardForm.amount}
                          onChange={(e) => setCardForm({ ...cardForm, amount: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">
                        Variables PCA (V1-V28)
                      </h4>
                      <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                        {Array.from({ length: 28 }, (_, i) => i + 1).map((num) => (
                          <div key={num}>
                            <label className="block text-xs text-gray-600 mb-1">
                              V{num}
                            </label>
                            <input
                              type="number"
                              step="0.0001"
                              value={cardForm[`v${num}`]}
                              onChange={(e) => setCardForm({ ...cardForm, [`v${num}`]: e.target.value })}
                              className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Créer Transaction
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;