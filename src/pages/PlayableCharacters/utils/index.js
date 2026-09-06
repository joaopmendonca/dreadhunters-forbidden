// src/pages/PlayableCharacters/utils/index.js

import api from '../../../config/api';

export const buildImgSrc = (url) => {
  if (!url) return null;
  if (url.startsWith('http') || url.startsWith('blob:')) return url;
  return `${api.defaults.baseURL.replace(/\/api\/?$/, '')}${url}`;
};

export const mapWithClass = (list, classes) =>
  list.map((tpl) => {
    const classId = typeof tpl.class === 'object' ? tpl.class?._id : tpl.class;
    const cls = classes.find((c) => String(c._id) === String(classId));
    return {
      ...tpl,
      className: cls?.name || (typeof tpl.class === 'object' ? tpl.class?.name : null) || '—',
      // Atributos base da classe — usados pro radar no card (R14: personagem herda da classe).
      classBaseStats: cls?.baseStats || null,
    };
  });

export const filterTemplates = (list, search, classId) =>
  list.filter(
    (t) => {
      const tClass = typeof t.class === 'object' ? t.class?._id : t.class;
      return (!classId || String(tClass) === String(classId)) &&
        (t.name || '').toLowerCase().includes((search || '').toLowerCase());
    }
  );
