export const MESSAGES = {
  FETCH_ERROR: 'Erro ao carregar logs',
  STATS_ERROR: 'Erro ao carregar estatísticas',
  FILTERS_ERROR: 'Erro ao carregar filtros'
};

// ─── Categorias ────────────────────────────────────────────────────────────
export const CATEGORIES = {
  AUTH: { label: 'Autenticação', icon: '🔐', color: 'purple' },
  ENTITY: { label: 'Entidades', icon: '📦', color: 'blue' },
  SYSTEM: { label: 'Sistema', icon: '⚙️', color: 'gray' },
  SECURITY: { label: 'Segurança', icon: '🛡️', color: 'red' }
};

export const CATEGORY_OPTIONS = [
  { value: '', label: 'Todas Categorias' },
  { value: 'AUTH', label: '🔐 Autenticação' },
  { value: 'ENTITY', label: '📦 Entidades' },
  { value: 'SYSTEM', label: '⚙️ Sistema' },
  { value: 'SECURITY', label: '🛡️ Segurança' }
];

// ─── Níveis ────────────────────────────────────────────────────────────────
export const LEVELS = {
  INFO: { label: 'Info', icon: 'ℹ️', color: 'blue', variant: 'info' },
  WARNING: { label: 'Aviso', icon: '⚠️', color: 'yellow', variant: 'warning' },
  ERROR: { label: 'Erro', icon: '❌', color: 'red', variant: 'error' },
  CRITICAL: { label: 'Crítico', icon: '🚨', color: 'darkred', variant: 'critical' }
};

export const LEVEL_OPTIONS = [
  { value: '', label: 'Todos Níveis' },
  { value: 'INFO', label: 'ℹ️ Info' },
  { value: 'WARNING', label: '⚠️ Aviso' },
  { value: 'ERROR', label: '❌ Erro' },
  { value: 'CRITICAL', label: '🚨 Crítico' }
];

// ─── Ações ─────────────────────────────────────────────────────────────────
export const ACTIONS = {
  CREATE: { label: 'Criar', icon: '➕', color: 'green' },
  UPDATE: { label: 'Atualizar', icon: '✏️', color: 'blue' },
  DELETE: { label: 'Excluir', icon: '🗑️', color: 'red' },
  BULK_UPDATE: { label: 'Atualizar em lote', icon: '📝', color: 'blue' },
  BULK_DELETE: { label: 'Excluir em lote', icon: '🗑️', color: 'red' },
  LOGIN: { label: 'Login', icon: '🔓', color: 'green' },
  LOGOUT: { label: 'Logout', icon: '🔐', color: 'gray' },
  LOGIN_FAILED: { label: 'Login Falhou', icon: '🚫', color: 'red' },
  TOKEN_REFRESH_FAILED: { label: 'Token Expirado', icon: '⏰', color: 'orange' },
  ACCESS_DENIED: { label: 'Acesso Negado', icon: '🚷', color: 'red' },
  IMPORT: { label: 'Importar', icon: '📥', color: 'purple' },
  EXPORT: { label: 'Exportar', icon: '📤', color: 'purple' },
  CONFIG_CHANGE: { label: 'Config. Alterada', icon: '🔧', color: 'orange' }
};

export const ACTION_OPTIONS = [
  { value: '', label: 'Todas Ações' },
  { value: 'CREATE', label: '➕ Criar' },
  { value: 'UPDATE', label: '✏️ Atualizar' },
  { value: 'DELETE', label: '🗑️ Excluir' },
  { value: 'LOGIN', label: '🔓 Login' },
  { value: 'LOGOUT', label: '🔐 Logout' },
  { value: 'LOGIN_FAILED', label: '🚫 Login Falhou' },
  { value: 'ACCESS_DENIED', label: '🚷 Acesso Negado' },
  { value: 'IMPORT', label: '📥 Importar' },
  { value: 'EXPORT', label: '📤 Exportar' }
];

// ─── Tipos de Entidade ─────────────────────────────────────────────────────
export const ENTITY_TYPES = {
  user: { label: 'Usuário', icon: '👤' },
  character: { label: 'Personagem', icon: '🧙' },
  item: { label: 'Item', icon: '🎒' },
  skill: { label: 'Habilidade', icon: '⚔️' },
  class: { label: 'Classe', icon: '📚' },
  role: { label: 'Papel', icon: '🎭' },
  affliction: { label: 'Aflição', icon: '💀' },
  attribute: { label: 'Atributo', icon: '📊' },
  damageType: { label: 'Tipo de Dano', icon: '💥' },
  currency: { label: 'Moeda', icon: '💰' },
  enemy: { label: 'Inimigo', icon: '👹' },
  quest: { label: 'Missão', icon: '📜' },
  location: { label: 'Localização', icon: '🗺️' },
  server: { label: 'Servidor', icon: '🖥️' },
  config: { label: 'Configuração', icon: '⚙️' }
};

export const ENTITY_TYPE_OPTIONS = [
  { value: '', label: 'Todas Entidades' },
  { value: 'item', label: '🎒 Item' },
  { value: 'skill', label: '⚔️ Habilidade' },
  { value: 'character', label: '🧙 Personagem' },
  { value: 'class', label: '📚 Classe' },
  { value: 'user', label: '👤 Usuário' },
  { value: 'enemy', label: '👹 Inimigo' },
  { value: 'quest', label: '📜 Missão' },
  { value: 'location', label: '🗺️ Localização' },
  { value: 'affliction', label: '💀 Aflição' },
  { value: 'attribute', label: '📊 Atributo' },
  { value: 'currency', label: '💰 Moeda' },
  { value: 'damageType', label: '💥 Tipo de Dano' },
  { value: 'role', label: '🎭 Papel' },
  { value: 'server', label: '🖥️ Servidor' }
];

// ─── Períodos ──────────────────────────────────────────────────────────────
export const PERIOD_OPTIONS = [
  { value: 'all', label: 'Todo Período' },
  { value: '1h', label: 'Última hora' },
  { value: '24h', label: 'Últimas 24h' },
  { value: '7d', label: 'Últimos 7 dias' },
  { value: '30d', label: 'Últimos 30 dias' }
];

// ─── Helpers ───────────────────────────────────────────────────────────────
export const getActionIcon = (action) => ACTIONS[action]?.icon || '📋';
export const getActionLabel = (action) => ACTIONS[action]?.label || action;
export const getActionColor = (action) => ACTIONS[action]?.color || 'gray';

export const getLevelIcon = (level) => LEVELS[level]?.icon || 'ℹ️';
export const getLevelLabel = (level) => LEVELS[level]?.label || level;
export const getLevelVariant = (level) => LEVELS[level]?.variant || 'info';

export const getCategoryIcon = (category) => CATEGORIES[category]?.icon || '📋';
export const getCategoryLabel = (category) => CATEGORIES[category]?.label || category;
export const getCategoryColor = (category) => CATEGORIES[category]?.color || 'gray';

export const getEntityIcon = (entityType) => ENTITY_TYPES[entityType]?.icon || '📦';
export const getEntityLabel = (entityType) => ENTITY_TYPES[entityType]?.label || entityType;

// ─── Mapeamento de período para datas ──────────────────────────────────────
export const getPeriodDates = (period) => {
  const now = new Date();
  let startDate = null;

  switch (period) {
    case '1h':
      startDate = new Date(now.getTime() - 1 * 60 * 60 * 1000);
      break;
    case '24h':
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      break;
    case '7d':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    default:
      return { startDate: null, endDate: null };
  }

  return {
    startDate: startDate.toISOString(),
    endDate: now.toISOString()
  };
};

// Legacy export for backwards compatibility
export const ACTION_ICONS = Object.fromEntries(
  Object.entries(ACTIONS).map(([key, val]) => [key, val.icon])
);
