// src/pages/PlayableCharacters/constants/index.js

export const ITEMS_PER_PAGE = 12;

export const RARITIES = [
  { value: 'common', label: 'Comum' },
  { value: 'rare', label: 'Raro' },
  { value: 'epic', label: 'Épico' },
  { value: 'legendary', label: 'Lendário' },
];

export const UNLOCK_TYPES = [
  { value: 'starter', label: 'Inicial (starter)' },
  { value: 'quest', label: 'Quest' },
  { value: 'shop', label: 'Loja' },
  { value: 'event', label: 'Evento' },
];

export const GENDERS = [
  { value: 'male', label: 'Masculino' },
  { value: 'female', label: 'Feminino' },
  { value: 'other', label: 'Outro' },
];

export const MESSAGES = {
  FETCH_ERROR: 'Falha ao carregar personagens jogáveis.',
  DELETE_CONFIRM: 'Confirma exclusão deste personagem jogável?',
  DELETE_SUCCESS: 'Personagem jogável removido.',
  DELETE_ERROR: 'Erro ao remover personagem jogável.',
  SAVE_SUCCESS_CREATE: 'Personagem jogável criado.',
  SAVE_SUCCESS_UPDATE: 'Personagem jogável atualizado.',
  SAVE_ERROR: 'Erro ao salvar personagem jogável.',
};
