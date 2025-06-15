import axios from 'axios';
import { 
  Transaction, 
  FraudAlert, 
  RiskMetrics,
  TransactionInput 
} from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 10000,
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const handleError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message || 'Request failed';
    return { message, status: error.response?.status };
  }
  return { message: 'An unexpected error occurred' };
};

export const ApiService = {
  transactions: {
    getAll: async (): Promise<Transaction[]> => {
      try {
        const { data } = await api.get('/transactions');
        return data;
      } catch (error) {
        throw handleError(error);
      }
    },
    analyze: async (transactionId: string): Promise<Transaction> => {
      try {
        const { data } = await api.post(`/transactions/${transactionId}/analyze`);
        return data;
      } catch (error) {
        throw handleError(error);
      }
    },
    predict: async (input: TransactionInput): Promise<Transaction> => {
      try {
        const { data } = await api.post('/transactions/predict', input);
        return data;
      } catch (error) {
        throw handleError(error);
      }
    }
  },

  alerts: {
    getAll: async (): Promise<FraudAlert[]> => {
      try {
        const { data } = await api.get('/alerts');
        return data;
      } catch (error) {
        throw handleError(error);
      }
    },
    updateStatus: async (id: string, status: string): Promise<FraudAlert> => {
      try {
        const { data } = await api.patch(`/alerts/${id}`, { status });
        return data;
      } catch (error) {
        throw handleError(error);
      }
    }
  },

  metrics: {
    getRiskMetrics: async (): Promise<RiskMetrics> => {
      try {
        const { data } = await api.get('/metrics/risk');
        return data;
      } catch (error) {
        throw handleError(error);
      }
    }
  },

  system: {
    healthCheck: async (): Promise<{ status: string }> => {
      try {
        const { data } = await api.get('/health');
        return data;
      } catch (error) {
        throw handleError(error);
      }
    }
  }
};

export default ApiService;