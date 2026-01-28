export const MESSAGES = {
  loading: 'Carregando roles…',
  empty: 'Nenhuma role encontrada',
  emptyDesc: 'Crie uma nova role para começar',
  deleteConfirm: 'Confirma exclusão da role?',
  deleteSuccess: 'Role removida.',
  deleteError: 'Erro ao remover role.',
  saveSuccess: 'Role criada com sucesso.',
  updateSuccess: 'Role atualizada com sucesso.',
  saveError: 'Erro ao salvar role.',
  fetchError: 'Falha ao buscar roles.',
  exportSuccess: 'Exportado com sucesso!',
  noRoles: 'Nenhuma role para exportar',
  invalidCSV: 'Selecione um arquivo CSV',
  importError: 'Erro ao processar CSV'
};

export const CSV_TEMPLATE = `name,description
Admin,"Acesso total ao sistema"
Player,"Jogador padrão"`;
