// src/pages/Users/utils/index.js

import Papa from 'papaparse';
import api from '../../../config/api';

export const buildAvatarSrc = (url) => {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  const base = api.defaults.baseURL.replace(/\/api\/?$/, '');
  return `${base}${url}`;
};

/**
 * Converte objeto User para formato CSV
 */
export const userToCSV = (user) => {
  return {
    username: user.username || '',
    email: user.email || '',
    status: user.status || '',
    country: user.country || '',
    roles: (user.roles || []).join('|'),
    createdAt: user.createdAt ? new Date(user.createdAt).toISOString().slice(0, 10) : '',
    lastLogin: user.lastLogin ? new Date(user.lastLogin).toISOString().slice(0, 10) : ''
  };
};

export const exportUsersToCSV = (users) => {
  if (users.length === 0) {
    return null;
  }

  const headers = ['username', 'email', 'status', 'country', 'roles', 'createdAt', 'lastLogin'];
  const rows = users.map(userToCSV);

  const csv = Papa.unparse({ fields: headers, data: rows });
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `usuarios-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  
  return true;
};

export const downloadUsersTemplate = () => {
  const headers = ['username', 'email', 'password', 'status', 'country', 'roles'];
  
  const rows = [
    {
      username: 'jogador1',
      email: 'jogador1@email.com',
      password: 'senha123',
      status: 'active',
      country: 'BR',
      roles: 'player'
    }
  ];

  const csv = Papa.unparse({ fields: headers, data: rows });
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'template-usuarios.csv';
  link.click();
};

export const filterUsers = (users, searchName, filterStatus) => {
  return users.filter(u => {
    const matchName = u.username?.toLowerCase().includes(searchName.toLowerCase()) ||
                      u.email?.toLowerCase().includes(searchName.toLowerCase());
    const matchStatus = filterStatus === 'all' || u.status === filterStatus;
    return matchName && matchStatus;
  });
};

export const countUsersByStatus = (users, status) => {
  return users.filter(u => u.status === status).length;
};

export const formatDate = (dateString) => {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};
