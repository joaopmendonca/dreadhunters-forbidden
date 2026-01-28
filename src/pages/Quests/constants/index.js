export const MESSAGES = {
  FETCH_ERROR: 'Erro ao carregar quests',
  FETCH_META_ERROR: 'Erro ao carregar meta-dados',
  DELETE_SUCCESS: 'Quest removida com sucesso!',
  DELETE_ERROR: 'Erro ao remover quest',
  DELETE_CONFIRM: 'Confirma exclusão da quest?',
  SAVE_SUCCESS_CREATE: 'Quest criada com sucesso!',
  SAVE_SUCCESS_UPDATE: 'Quest atualizada com sucesso!',
  SAVE_ERROR: 'Erro ao salvar quest',
  ICON_DELETE_SUCCESS: 'Ícone removido com sucesso!',
  ICON_DELETE_ERROR: 'Erro ao remover ícone',
  ICON_DELETE_CONFIRM: 'Remover este ícone?',
  VALIDATION_TITLE: 'Título é obrigatório'
};

export const TYPE_OPTIONS = [
  { value: 'main', label: 'Principal' },
  { value: 'side', label: 'Secundária' },
  { value: 'daily', label: 'Diária' }
];

export const OBJECTIVE_TYPE_OPTIONS = [
  { value: 'kill', label: 'Matar Inimigo' },
  { value: 'collect', label: 'Coletar Item' },
  { value: 'talk', label: 'Falar com NPC' },
  { value: 'visit', label: 'Visitar Local' }
];

export const OBJECTIVE_ICONS = {
  kill: '🗡️',
  collect: '📦',
  talk: '💬',
  visit: '📍'
};
