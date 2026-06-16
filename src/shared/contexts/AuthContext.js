// src/shared/contexts/AuthContext.js

import React, { createContext, useState, useEffect, useCallback } from 'react';
import api from '../../config/api';

export const AuthContext = createContext({
  user: null,
  token: null,
  refreshToken: null,
  loading: true,
  login: async () => {},
  logout: () => {},
  updateUser: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Função de logout
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    delete api.defaults.headers.Authorization;
    setToken(null);
    setRefreshToken(null);
    setUser(null);
  }, []);

  // Restauração inicial do usuário e tokens do localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedRefresh = localStorage.getItem('refreshToken');
    const storedUserRaw = localStorage.getItem('user');

    if (storedToken && storedUserRaw) {
      try {
        const parsedUser = JSON.parse(storedUserRaw);
        
        // Só restaura se for admin
        if (Array.isArray(parsedUser.roles) && parsedUser.roles.includes('admin')) {
          setToken(storedToken);
          setRefreshToken(storedRefresh);
          setUser(parsedUser);
          api.defaults.headers.Authorization = `Bearer ${storedToken}`;
        } else {
          // Não é admin: limpa tudo
          logout();
        }
      } catch (error) {
        console.error('Erro ao restaurar usuário:', error);
        logout();
      }
    }

    setLoading(false);
  }, [logout]);

  // Listener para mudanças no localStorage (logout em outra aba)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'token' && !e.newValue) {
        // Token foi removido em outra aba - faz logout local
        logout();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [logout]);

  // Função de login (só permite admin)
  const login = useCallback(async ({ loginField, password }) => {
    try {
      const { data } = await api.post('/auth/login', {
        email: loginField.trim(),
        password: password.trim(),
      });

      const {
        token: newToken,
        refreshToken: newRefresh,
        user: userData,
      } = data;

      // Exige role 'admin'
      if (!Array.isArray(userData.roles) || !userData.roles.includes('admin')) {
        throw new Error('Acesso negado: apenas administradores podem entrar no painel.');
      }

      const accessTimestamp = new Date().toISOString();
      const sessionUser = {
        ...userData,
        lastLoginAt: accessTimestamp,
        lastAccess: accessTimestamp,
      };

      // Armazenar no localStorage
      localStorage.setItem('token', newToken);
      if (newRefresh) {
        localStorage.setItem('refreshToken', newRefresh);
      }
      localStorage.setItem('user', JSON.stringify(sessionUser));

      // Atualizar axios e estados
      api.defaults.headers.Authorization = `Bearer ${newToken}`;
      setToken(newToken);
      setRefreshToken(newRefresh);
      setUser(sessionUser);

      return sessionUser;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'Erro inesperado ao autenticar.';
      throw new Error(message);
    }
  }, []);

  // Função para atualizar dados do usuário (sem fazer logout/login)
  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        refreshToken,
        loading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
