import api from '../../../config/api';

const buildImageSrc = (url) => {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  const base = api.defaults.baseURL.replace(/\/api\/?$/, '');
  return `${base}${url}`;
};

const getSeveridadeConfig = (severidade) => {
  const configs = {
    leve: { icon: '🟢', nome: 'Leve', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' },
    media: { icon: '🟡', nome: 'Média', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' },
    grave: { icon: '🔴', nome: 'Grave', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)' }
  };
  return configs[severidade] || configs.leve;
};

export { buildImageSrc, getSeveridadeConfig };
