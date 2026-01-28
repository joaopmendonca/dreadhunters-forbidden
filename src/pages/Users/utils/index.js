// src/pages/Users/utils/index.js

import api from '../../../config/api';

export const buildAvatarSrc = (url) => {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  const base = api.defaults.baseURL.replace(/\/api\/?$/, '');
  return `${base}${url}`;
};

export const exportUsersToCSV = (users) => {
  if (users.length === 0) {
    return null;
  }

  const lines = ['username,email,status,country,roles,createdAt,lastLogin'];
  for (const user of users) {
    lines.push([
      user.username,
      user.email,
      user.status,
      user.country || '',
      (user.roles || []).join('|'),
      user.createdAt ? new Date(user.createdAt).toISOString().slice(0, 10) : '',
      user.lastLogin ? new Date(user.lastLogin).toISOString().slice(0, 10) : ''
    ].join(','));
  }

  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'users-export.csv';
  link.click();
  
  return true;
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
