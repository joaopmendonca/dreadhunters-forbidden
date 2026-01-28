import api from '../../../config/api';

export const buildIconSrc = url => {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  return api.defaults.baseURL.replace(/\/api\/?$/, '') + url;
};

export const toPrimitive = value => {
  return value && typeof value === 'object' && 'value' in value ? value.value : value;
};
