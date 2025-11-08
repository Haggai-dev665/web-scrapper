import axios from 'axios';

const API_BASE_URL = import.meta.env.PROD 
  ? '/api'  // In production, use relative path since backend serves frontend
  : 'http://localhost:8080/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 300000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect to login for JWT-authenticated endpoints, not API key endpoints
    if (error.response?.status === 401) {
      const requestUrl = error.config?.url;
      const isApiKeyEndpoint = requestUrl?.includes('/scrape');
      
      // Only redirect to login if it's NOT an API key endpoint
      if (!isApiKeyEndpoint) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// API service functions
export const apiService = {
  // Dashboard stats
  getDashboardStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  // API Keys management
  getApiKeys: async () => {
    const response = await api.get('/keys');
    return response.data;
  },

  createApiKey: async (data: { name: string; description: string }) => {
    const response = await api.post('/keys', data);
    return response.data;
  },

  deleteApiKey: async (keyId: string) => {
    const response = await api.delete(`/keys/${keyId}`);
    return response.data;
  },

  getApiKeyUsage: async (keyId: string) => {
    const response = await api.get(`/keys/${keyId}/usage`);
    return response.data;
  },

  // Web scraping
  scrapeWebsite: async (url: string, apiKey: string) => {
    const response = await api.post('/scrape', { url }, {
      headers: {
        'x-api-key': apiKey,
        'Authorization': undefined // Remove JWT for scraping endpoint
      }
    });
    return response.data;
  },

  // Analytics endpoints
  getUsageAnalytics: async (timeRange: string = '7d') => {
    const response = await api.get(`/analytics/usage?range=${timeRange}`);
    return response.data;
  },

  getScrapingHistory: async (limit: number = 50, offset: number = 0) => {
    const response = await api.get(`/analytics/history?limit=${limit}&offset=${offset}`);
    return response.data;
  },

  // Auth endpoints

  // Auth endpoints
  register: async (data: { 
    first_name: string; 
    last_name: string; 
    email: string; 
    password: string 
  }) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  }
};

export default api;