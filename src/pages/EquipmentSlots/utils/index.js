import api from '../../../config/api';

export const buildImageSrc = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  const baseURL = api.defaults.baseURL.replace(/\/api\/?$/, '');
  return `${baseURL}${url}`;
};

export const equipmentSlotToCSV = (slot) => ({
  key: slot.key || '',
  name: slot.name || '',
  description: slot.description || '',
  maxItems: slot.maxItems || 1,
  order: slot.order || 0,
  active: slot.active ? 'true' : 'false'
});
