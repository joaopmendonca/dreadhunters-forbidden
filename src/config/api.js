// src/config/api.js

import axios from 'axios';

// Base URL da API
const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000/api';

const api = axios.create({ 
  baseURL,
  timeout: 30000,
});

const APP_BASENAME = '/forbidden';
const LOGIN_PATH = `${APP_BASENAME}/login`;

const normalizePath = (path = '/') => {
  const normalized = String(path || '/').replace(/\/+$/g, '');
  return normalized || '/';
};

// ───────────── REQUEST INTERCEPTOR ─────────────────────────────────────────
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Para FormData, deixa o browser definir Content-Type com boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    } else if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  error => Promise.reject(error)
);

// ───────────── RESPONSE INTERCEPTOR (Refresh Token) ────────────────────────
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(promise => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  delete api.defaults.headers.Authorization;
  
  // Redireciona para login
  if (normalizePath(window.location.pathname) !== normalizePath(LOGIN_PATH)) {
    window.location.href = LOGIN_PATH;
  }
};

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    // Se não é erro 401 ou já tentou refresh, rejeita direto
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Se está tentando fazer login ou refresh, não tenta refresh novamente
    if (originalRequest.url?.includes('/auth/login') || originalRequest.url?.includes('/auth/refresh')) {
      return Promise.reject(error);
    }

    // Marca que já tentou refresh nesta requisição
    originalRequest._retry = true;

    // Se já está refreshing, adiciona à fila
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch(err => Promise.reject(err));
    }

    // Inicia processo de refresh
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      logout();
      return Promise.reject(error);
    }

    isRefreshing = true;

    try {
      console.log('[API Interceptor] Tentando renovar token...');
      
      // Faz requisição de refresh usando axios puro (não o interceptor)
      const response = await axios.post(
        `${baseURL}/auth/refresh`,
        { refreshToken },
        { 
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000,
        }
      );

      const { token: newToken, refreshToken: newRefreshToken } = response.data;

      console.log('[API Interceptor] Token renovado com sucesso');

      // Atualiza tokens no localStorage
      localStorage.setItem('token', newToken);
      if (newRefreshToken) {
        localStorage.setItem('refreshToken', newRefreshToken);
      }

      // Atualiza header padrão do axios
      api.defaults.headers.Authorization = `Bearer ${newToken}`;
      
      // Atualiza header da requisição original
      originalRequest.headers.Authorization = `Bearer ${newToken}`;

      // Processa fila de requisições pendentes
      processQueue(null, newToken);

      console.log('[API Interceptor] Retentando requisição original');
      // Retenta a requisição original
      return api(originalRequest);
    } catch (refreshError) {
      console.error('[API Interceptor] Erro ao renovar token:', refreshError.response?.data || refreshError.message);
      // Se falhou o refresh, faz logout
      processQueue(refreshError, null);
      logout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
