import api from '../../../config/api';

export const buildIconSrc = url => {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  const base = api.defaults.baseURL.replace(/\/api\/?$/, '');
  return `${base}${url}`;
};

export const getAttributeEmoji = (nome) => {
  const emojiMap = {
    str: '💪', strength: '💪',
    dex: '🎯', dexterity: '🎯',
    con: '❤️', constitution: '❤️',
    int: '🧠', intelligence: '🧠',
    wit: '✨', wisdom: '✨',
    men: '🔮', mental: '🔮',
    max_hp: '❤️', hp: '❤️',
    max_sp: '💜', sp: '💜',
    max_cp: '🛡️', cp: '🛡️',
    p_atk: '⚔️', m_atk: '🔥',
    p_def: '🛡️', m_def: '🌀',
    crit_rate: '💥', crit_dmg: '💥',
    evasion: '💨', accuracy: '🎯',
    atk_speed: '⚡', cast_speed: '✨',
    move_speed: '👟', load: '📦',
    hp_regen: '💚', sp_regen: '💜', cp_regen: '🛡️'
  };
  return emojiMap[nome?.toLowerCase()] || '📊';
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
      obj[header] = value.replace(/^"|"$/g, '');
    });
    data.push(obj);
  }
  return data;
};

export const exportToCSV = (csv, filename) => {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};
