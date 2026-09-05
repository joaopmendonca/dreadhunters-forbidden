// src/pages/PlayableCharacters/utils/index.js

import api from '../../../config/api';

export const buildImgSrc = (url) => {
  if (!url) return null;
  if (url.startsWith('http') || url.startsWith('blob:')) return url;
  return `${api.defaults.baseURL.replace(/\/api\/?$/, '')}${url}`;
};

export const mapWithClass = (list, classes) =>
  list.map((tpl) => ({
    ...tpl,
    className:
      classes.find(
        (c) => c._id === (typeof tpl.class === 'object' ? tpl.class?._id : tpl.class)
      )?.name || (typeof tpl.class === 'object' ? tpl.class?.name : null) || '—',
  }));

export const filterTemplates = (list, search, rarity) =>
  list.filter(
    (t) =>
      (!rarity || t.rarity === rarity) &&
      (t.name || '').toLowerCase().includes((search || '').toLowerCase())
  );

export const statsToObject = (stats) =>
  stats instanceof Map ? Object.fromEntries(stats) : stats || {};
