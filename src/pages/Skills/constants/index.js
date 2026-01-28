export const MESSAGES = {
  EMPTY_TITLE: 'Nenhuma skill encontrada',
  EMPTY_MESSAGE: 'Crie uma nova skill para começar',
  LOADING: 'Carregando skills…',
  LOADING_STATUS: 'Carregando status...',
  CSV_TEMPLATE_NAME: 'template-skills.csv',
  CSV_EXPORT_NAME: 'skills-export.csv'
};

export const CSV_TEMPLATE = `name,description,type,levelRequirement
Golpe Certeiro,"Ataque físico preciso",active,1`;

export const TYPE_OPTIONS = [
  { value: '', label: '— Selecione o tipo —' },
  { value: 'active', label: 'Ativa' },
  { value: 'passive', label: 'Passiva' }
];
