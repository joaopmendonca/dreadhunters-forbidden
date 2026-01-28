// src/pages/Classes/constants/index.js

export const ITEMS_PER_PAGE = 12;

export const PAGE_TITLE = 'Classes';

export const MESSAGES = {
  FETCH_ERROR: 'Falha ao buscar classes.',
  DELETE_SUCCESS: 'Classe removida.',
  DELETE_ERROR: 'Erro ao remover classe.',
  CREATE_SUCCESS: 'Classe criada com sucesso.',
  UPDATE_SUCCESS: 'Classe atualizada com sucesso.',
  SAVE_ERROR: 'Erro ao salvar classe.',
  IMPORT_SUCCESS_FORMAT: 'Importação: {created} criadas, {errors} erros',
  IMPORT_ERROR: 'Erro ao processar CSV',
  IMPORT_INVALID_FILE: 'Por favor, selecione um arquivo CSV',
  IMPORT_WAIT_ROLES: 'Aguarde o carregamento das roles',
  IMPORT_WAIT_STATS: 'Aguarde o carregamento dos status',
  EXPORT_SUCCESS: 'Exportado com sucesso!',
  EXPORT_EMPTY: 'Nenhuma classe para exportar',
  DELETE_CONFIRMATION: 'Confirma exclusão da classe?',
};

export const EMPTY_STATE = {
  ICON: '⚔️',
  TITLE: 'Nenhuma classe encontrada',
  MESSAGE: 'Crie uma nova classe para começar',
};

export const CSV_TEMPLATE = {
  FILE_NAME: 'template-classes.csv',
  EXPORT_FILE_NAME: 'classes-export.csv',
  EXAMPLE_NAME: 'Observador',
  EXAMPLE_DESCRIPTION: 'Detecta pistas escondidas',
  EXAMPLE_ROLE: 'Tank',
  EXAMPLE_STAT_VALUE: '10',
  EXAMPLE_SPECIAL: 'Rastro Oculto: +10% recompensa',
};
