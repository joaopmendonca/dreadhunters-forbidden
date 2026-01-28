export const MESSAGES = {
  LOADING_SERVERS: 'Carregando servidores…',
  LOADING_CONFIG: 'Carregando configuração…',
  SAVING: 'Salvando…',
  SELECT_SERVER: 'Selecione um servidor para visualizar e editar suas configurações.',
  SELECT_PROMPT: 'Informe o slug do servidor',
  SAVE_SUCCESS: 'Configuração salva.',
  ERROR_LOAD: 'Falha ao carregar configuração.',
  ERROR_SAVE: 'Erro ao salvar configuração.',
};

export const CONFIG_DEFAULTS = {
  maxCharactersPerUser: 3,
  allowDuplicateNames: false,
  initialStatPoints: 6,
  baselinePerStat: 1,
  statPointsPerLevel: 1,
  maxStatValue: 24,
  minStatValue: 1,
  maxLevel: 99,
  maxStatPointsPerClass: 20,
  minutesPerUnit: 1,
};

export const SETTINGS_SECTIONS = [
  {
    id: 'general',
    icon: 'FaUsers',
    title: 'Configurações Gerais',
    fields: [
      {
        key: 'maxCharactersPerUser',
        label: 'Máx. Personagens por Usuário',
        type: 'number',
        min: 1,
      },
      {
        key: 'allowDuplicateNames',
        label: 'Permitir Nomes Duplicados',
        type: 'checkbox',
      },
    ],
  },
  {
    id: 'gameplay',
    icon: 'FaGamepad',
    title: 'Configurações de Gameplay',
    fields: [
      {
        key: 'initialStatPoints',
        label: 'Pontos Iniciais de Atributos',
        type: 'number',
        min: 0,
      },
      {
        key: 'maxStatPointsPerClass',
        label: 'Máximo de Pontos por Classe',
        type: 'number',
        min: 1,
      },
      {
        key: 'baselinePerStat',
        label: 'Valor Base por Atributo',
        type: 'number',
        min: 1,
      },
      {
        key: 'statPointsPerLevel',
        label: 'Pontos por Nível',
        type: 'number',
        min: 0,
      },
      {
        key: 'maxStatValue',
        label: 'Valor Máximo de Atributo',
        type: 'number',
        min: 1,
      },
      {
        key: 'minStatValue',
        label: 'Valor Mínimo de Atributo',
        type: 'number',
        min: 1,
      },
      {
        key: 'maxLevel',
        label: 'Nível Máximo de Personagem',
        type: 'number',
        min: 1,
      },
      {
        key: 'minutesPerUnit',
        label: 'Tempo de Viagem (min/unidade)',
        type: 'number',
        min: 0.01,
        step: 0.01,
      },
    ],
  },
];
