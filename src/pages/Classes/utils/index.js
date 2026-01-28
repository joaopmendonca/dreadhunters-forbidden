// src/pages/Classes/utils/index.js

export const buildIconSrc = (url, baseURL) => {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  const base = baseURL.replace(/\/api\/?$/, '');
  const path = url.startsWith('/') ? url : `/${url}`;
  return `${base}${path}`;
};

export const parseCSV = (text) => {
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    const obj = {};
    headers.forEach((header, index) => {
      let value = values[index]?.trim() || '';
      obj[header] = value.replace(/^"|"$/g, ''); // Remove aspas
    });
    data.push(obj);
  }
  return data;
};

export const generateCSVTemplate = (statsList, template) => {
  const statHeaders = statsList.map(s => s.nome).join(',');
  const exampleStats = statsList.map(() => template.EXAMPLE_STAT_VALUE).join(',');
  return `name,description,role,${statHeaders},specials\n${template.EXAMPLE_NAME},"${template.EXAMPLE_DESCRIPTION}",${template.EXAMPLE_ROLE},${exampleStats},"${template.EXAMPLE_SPECIAL}"`;
};

export const exportClassesToCSV = (classesList, statsList) => {
  const statHeaders = statsList.map(s => s.nome).join(',');
  const lines = [`name,description,role,${statHeaders},specials`];
  
  for (const cls of classesList) {
    const roleName = cls.role?.name || '';
    const stats = cls.baseStats || {};
    const statsValues = statsList.map(s => stats[s.nome] || 0).join(',');
    const specials = cls.specials?.map(s => `${s.name}: ${s.description}`).join('; ') || '';
    
    lines.push([
      cls.name,
      `"${(cls.description || '').replace(/"/g, '""')}"`,
      roleName,
      statsValues,
      `"${specials.replace(/"/g, '""')}"`
    ].join(','));
  }

  return lines.join('\n');
};

export const downloadCSV = (content, filename) => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};

export const filterByName = (list, searchTerm) => {
  if (!searchTerm) return list;
  return list.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

export const paginateItems = (items, page, itemsPerPage) => {
  const start = page * itemsPerPage;
  const end = start + itemsPerPage;
  return items.slice(start, end);
};
