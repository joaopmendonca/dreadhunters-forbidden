export const MESSAGES = {
  FETCH_ERROR: 'Erro ao buscar itens',
  DELETE_SUCCESS: 'Item excluído com sucesso!',
  DELETE_ERROR: 'Erro ao excluir item',
  DELETE_CONFIRM: 'Confirma exclusão do item?',
  SAVE_SUCCESS_CREATE: 'Item criado com sucesso!',
  SAVE_SUCCESS_UPDATE: 'Item atualizado com sucesso!',
  SAVE_ERROR: 'Erro ao salvar item',
  VALIDATION_ERROR: 'Preencha Tipo e Raridade antes de salvar',
  ICON_DELETE_SUCCESS: 'Ícone removido com sucesso!',
  ICON_DELETE_ERROR: 'Erro ao remover ícone',
  ICON_DELETE_CONFIRM: 'Remover este ícone?'
};

export const TYPE_OPTIONS = [
  { value: '', label: 'Selecione' },
  { value: 'consumable', label: 'Consumível' },
  { value: 'equipment', label: 'Equipamento' },
  { value: 'material', label: 'Material' },
  { value: 'key', label: 'Chave' },
  { value: 'quest', label: 'Quest' },
];

export const RARITY_OPTIONS = [
  { value: '', label: 'Selecione' },
  { value: 'common', label: 'Comum' },
  { value: 'uncommon', label: 'Incomum' },
  { value: 'rare', label: 'Raro' },
  { value: 'epic', label: 'Épico' },
  { value: 'legendary', label: 'Lendário' },
];

