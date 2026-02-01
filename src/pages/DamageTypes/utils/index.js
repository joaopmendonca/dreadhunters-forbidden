import api from '../../../config/api';

/**
 * Constrói URL completa da imagem
 */
export const buildImageSrc = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  const baseURL = api.defaults.baseURL.replace(/\/api\/?$/, '');
  return `${baseURL}${url}`;
};

/**
 * Retorna configuração visual baseada no tipo de dano
 */
export const getDamageTypeConfig = (nome) => {
  const configs = {
    none: { icon: '🚫', variant: 'neutral' },
    physical: { icon: '⚔️', variant: 'physical' },
    magical: { icon: '✨', variant: 'magical' },
    true: { icon: '💀', variant: 'true' },
    fire: { icon: '🔥', variant: 'fire' },
    ice: { icon: '❄️', variant: 'ice' },
    lightning: { icon: '⚡', variant: 'lightning' },
    poison: { icon: '☠️', variant: 'poison' },
  };
  return configs[nome?.toLowerCase()] || { icon: '⚔️', variant: 'default' };
};

/**
 * Converte objeto DamageType para formato CSV
 */
export const damageTypeToCSV = (damageType) => {
  return {
    nome: damageType.nome || '',
    label: damageType.label || '',
    descricao: damageType.descricao || '',
    cor: damageType.cor || '',
    formula: damageType.formula || '',
    ordem: damageType.ordem || 0,
    ativo: damageType.ativo ? 'true' : 'false'
  };
};
