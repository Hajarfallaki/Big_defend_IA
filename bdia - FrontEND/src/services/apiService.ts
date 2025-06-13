import axios from 'axios';
import { Transaction, FraudAlert, RiskMetrics, Client } from '../types';

const BASE_URL = 'http://localhost:8000/api/v1';

// Création de l'instance Axios
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor pour ajouter le token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor pour gérer les erreurs globales
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const login = async (
  email: string,
  password: string
): Promise<{ access_token: string }> => {
  const res = await axios.post(
    `${BASE_URL}/auth/jwt/login`,
    new URLSearchParams({
      username: email,
      password,
    })
  );
  const { access_token } = res.data;
  localStorage.setItem('auth_token', access_token);
  return res.data;
};

export const logout = () => {
  localStorage.removeItem('auth_token');
};

// Transactions
export const getTransactions = async (banqueId: number) => {
  const res = await api.get(`/transactions/banque/${banqueId}`);
  return res.data as Transaction[];
};

export const addTransaction = async (data: any) => {
  const res = await api.post('/transactions/add', data);
  return res.data as Transaction;
};

// Alertes
export const getAlerts = async (banqueId: number) => {
  const res = await api.get(`/alerts/banque/${banqueId}`);
  return res.data as FraudAlert[];
};

export const updateAlertStatus = async (id: number, status: string) => {
  const res = await api.patch(`/alerts/${id}`, { status });
  return res.data as FraudAlert;
};

// ML
export const getModelStatus = async () => {
  const res = await api.get('/ml/model/status');
  return res.data;
};

export const retrainModel = async () => {
  const res = await api.post('/ml/model/retrain');
  return res.data;
};

// Dashboard
export const getDashboardData = async () => {
  const res = await api.get('/dashboard');
  return res.data;
};

// Health
export const healthCheck = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/health`);
    return res.status === 200;
  } catch {
    return false;
  }
};

// Analyse de transactions
export const analyzeTransaction = async (transactionId: string) => {
  const res = await api.post(`/transactions/${transactionId}/analyze`);
  return res.data;
};

// Risk metrics
export const getRiskMetrics = async (): Promise<RiskMetrics> => {
  const res = await api.get('/metrics/risk');
  return res.data as RiskMetrics;
};
export const getClients = async (): Promise<Client[]> => {
  const res = await api.get('/clients');
  return res.data;
};

export const createClient = async (client: Omit<Client, 'id' | 'createdAt'>): Promise<Client> => {
  const res = await api.post('/clients', client);
  return res.data;
};

export const updateClientStatus = async (id: string, status: Client['status']): Promise<void> => {
  await api.patch(`/clients/${id}/status`, { status });
};


// ✅ Export par défaut de l'instance axios
export default api;
