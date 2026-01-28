import api from '../../../config/api';

export const buildIconSrc = url => {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  return api.defaults.baseURL.replace(/\/api\/?$/, '') + url;
};
