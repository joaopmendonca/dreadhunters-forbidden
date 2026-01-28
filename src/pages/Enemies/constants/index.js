export const MESSAGES = {
  FETCH_ERROR: 'Não foi possível carregar inimigos',
  FETCH_META_ERROR: 'Erro ao carregar itens/moedas',
  DELETE_SUCCESS: 'Inimigo removido com sucesso!',
  DELETE_ERROR: 'Erro ao remover inimigo',
  DELETE_CONFIRM: 'Confirma exclusão do inimigo?',
  SAVE_SUCCESS_CREATE: 'Inimigo criado com sucesso!',
  SAVE_SUCCESS_UPDATE: 'Inimigo atualizado com sucesso!',
  SAVE_ERROR: 'Erro ao salvar inimigo',
  VALIDATION_NAME: 'Nome é obrigatório',
  VALIDATION_POINTS: 'Você deve distribuir exatamente {max} pontos. Atualmente: {current}',
  VALIDATION_LEVEL: 'Nível máximo permitido: {max}',
  ICON_DELETE_SUCCESS: 'Ícone removido com sucesso!',
  ICON_DELETE_ERROR: 'Erro ao remover ícone',
  ICON_DELETE_CONFIRM: 'Remover este ícone?'
};

export const TYPE_OPTIONS = [
  { value: 'normal', label: 'Normal' },
  { value: 'elite', label: 'Elite' },
  { value: 'boss', label: 'Boss' }
];

// Multiplicadores de pontos por tipo de inimigo
export const TYPE_MULTIPLIERS = {
  normal: 1,
  elite: 1.67,
  boss: 3.33
};
