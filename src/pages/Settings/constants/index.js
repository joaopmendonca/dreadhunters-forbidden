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
  statPointsLevelInterval: 2,
  maxStatValue: 24,
  minStatValue: 1,
  maxLevel: 99,
  maxStatPointsPerClass: 18,
  minutesPerUnit: 1,
  questQueueSize: 3,
  movementSpeedStatKey: 'dex'
};

export const SETTINGS_SECTIONS = [
  {
    id: 'characters',
    icon: 'FaUsers',
    title: 'Configurações de Personagens',
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
    id: 'stats',
    icon: 'FaDice',
    title: 'Sistema de Atributos (Stats)',
    fields: [
      {
        key: 'initialStatPoints',
        label: 'Pontos Iniciais de Atributos',
        type: 'number',
        min: 0,
        helpText: 'Pontos extras distribuíveis na criação do personagem',
      },
      {
        key: 'maxStatPointsPerClass',
        label: 'Máximo de Pontos por Classe',
        type: 'number',
        min: 1,
        helpText: 'Limite total de pontos que podem ser distribuídos na criação',
      },
      {
        key: 'baselinePerStat',
        label: 'Valor Base por Atributo',
        type: 'number',
        min: 1,
        helpText: 'Valor mínimo inicial de cada atributo',
      },
      {
        key: 'minStatValue',
        label: 'Valor Mínimo de Atributo',
        type: 'number',
        min: 1,
      },
      {
        key: 'maxStatValue',
        label: 'Valor Máximo de Atributo',
        type: 'number',
        min: 1,
      },
    ],
  },
  {
    id: 'progression',
    icon: 'FaGamepad',
    title: 'Progressão e Level-Up',
    fields: [
      {
        key: 'statPointsPerLevel',
        label: 'Pontos por Nível',
        type: 'number',
        min: 0,
        helpText: 'Quantos pontos de atributo o jogador ganha por level-up',
      },
      {
        key: 'statPointsLevelInterval',
        label: 'A Cada Quantos Níveis',
        type: 'number',
        min: 1,
        helpText: 'Intervalo de níveis para ganhar pontos manuais (ex: 2 = níveis 2, 4, 6...)',
      },
      {
        key: 'maxLevel',
        label: 'Nível Máximo de Personagem',
        type: 'number',
        min: 1,
      },
    ],
  },
  {
    id: 'world',
    icon: 'FaMap',
    title: 'Mundo e Gameplay',
    fields: [
      {
        key: 'minutesPerUnit',
        label: 'Tempo de Viagem (min/unidade)',
        type: 'number',
        min: 0.01,
        step: 0.01,
        helpText: 'Minutos necessários para percorrer 1 unidade de distância',
      },
      {
        key: 'questQueueSize',
        label: 'Tamanho da Fila de Quests',
        type: 'number',
        min: 1,
        helpText: 'Número máximo de quests na fila por personagem',
      },
      {
        key: 'movementSpeedStatKey',
        label: 'Stat de Velocidade de Movimento',
        type: 'text',
        helpText: 'Chave do stat usado para calcular velocidade de deslocamento (ex: dex)',
      },
    ],
  },
];
