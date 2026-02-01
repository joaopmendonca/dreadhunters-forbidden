export const STATUS_OPTIONS = [
  { value: 'online', label: 'Online' },
  { value: 'offline', label: 'Offline' },
  { value: 'maintenance', label: 'Manutenção' },
];

export const REGION_OPTIONS = [
  { value: 'sa', label: 'América do Sul' },
  { value: 'na', label: 'América do Norte' },
  { value: 'eu', label: 'Europa' },
  { value: 'asia', label: 'Ásia' },
  { value: 'oce', label: 'Oceania' },
];

export const MESSAGES = {
  LOADING: 'Carregando servidores…',
  DELETE_CONFIRM: 'Confirma exclusão do servidor?',
  DELETE_SUCCESS: 'Servidor removido.',
  SAVE_SUCCESS: 'Servidor salvo com sucesso.',
  ERROR_FETCH: 'Falha ao carregar servidores.',
  ERROR_DELETE: 'Erro ao remover servidor.',
  ERROR_SAVE: 'Falha ao salvar servidor.',
  NO_RESULTS: 'Nenhum servidor encontrado.',
};
