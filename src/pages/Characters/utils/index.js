// src/pages/Characters/utils/index.js

import api from '../../../config/api';
import { CSV_HEADERS, CSV_TEMPLATE_EXAMPLE, DEFAULT_GENDER } from '../constants';

export const buildIconSrc = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${api.defaults.baseURL.replace(/\/api\/?$/, '')}${url}`;
};

export const parseCSV = (text) => {
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (const char of lines[i]) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = values[index] || '';
    });
    data.push(obj);
  }
  return data;
};

export const downloadCSVTemplate = () => {
  const csv = `${CSV_HEADERS.TEMPLATE}\n${CSV_TEMPLATE_EXAMPLE}`;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'template-npcs.csv';
  link.click();
};

export const exportCharactersToCSV = (characters) => {
  if (characters.length === 0) {
    return null;
  }

  const lines = [CSV_HEADERS.EXPORT];
  for (const ch of characters) {
    lines.push([
      ch.name,
      `"${(ch.description || '').replace(/"/g, '""')}"`,
      ch.className,
      ch.level,
      ch.gender || DEFAULT_GENDER
    ].join(','));
  }

  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'npcs-export.csv';
  link.click();
  
  return true;
};

export const filterCharacters = (characters, searchName, filterClass) => {
  return characters.filter(
    (ch) =>
      (!filterClass || ch.class === filterClass) &&
      ch.name.toLowerCase().includes(searchName.toLowerCase())
  );
};

export const mapCharactersWithClass = (characters, classes) => {
  return characters.map((ch) => ({
    ...ch,
    className: classes.find((c) => c._id === ch.class)?.name || '—'
  }));
};
