export const ITEMS_PER_PAGE = 10;

export const USER_STATUS = {
  ALL: 'all',
  ACTIVE: 'active',
  BANNED: 'banned',
  PENDING: 'pending',
};

export const USER_STATUS_LABELS = {
  active: 'Ativo',
  banned: 'Banido',
  pending: 'Pendente',
};

export const USER_STATUS_VARIANTS = {
  active: 'green',
  banned: 'fisica',
  pending: 'orange',
};

export const FILTER_TABS_CONFIG = [
  {
    id: 'all',
    label: 'Todos',
    variant: null,
  },
  {
    id: 'active',
    label: 'Ativos',
    variant: 'filterTabGreen',
  },
  {
    id: 'banned',
    label: 'Banidos',
    variant: 'filterTabRed',
  },
  {
    id: 'pending',
    label: 'Pendentes',
    variant: 'filterTabOrange',
  },
];
