import api from '../../../config/api';

// Gera a URL completa do ícone (remove "/api" se necessário)
export const buildIconSrc = url => {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  const base = api.defaults.baseURL.replace(/\/api\/?$/, '');
  return `${base}${url}`;
};
