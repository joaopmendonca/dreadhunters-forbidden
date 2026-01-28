// src/pages/Dashboard/utils/index.js

export const buildLast7Days = () => {
  const today = new Date();
  return Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });
};

export const formatShortDate = (dateStr) => {
  const [, m, d] = dateStr.split('-');
  return `${d}/${m}`;
};

export const countByField = (array, field, value) => {
  return array.filter(item => item[field] === value).length;
};

export const sumByField = (array, field) => {
  return array.reduce((sum, item) => sum + (item[field] || 0), 0);
};
