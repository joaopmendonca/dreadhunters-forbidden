export const MESSAGES = {
  loading: 'Carregando aflições…',
  empty: 'Nenhuma aflição encontrada',
  emptyDesc: 'Tente ajustar sua busca ou crie uma nova aflição',
  deleteConfirm: 'Confirma exclusão?',
  deleteSuccess: 'Aflição excluída!',
  deleteError: 'Erro ao excluir aflição',
  saveSuccess: 'Aflição criada!',
  updateSuccess: 'Aflição atualizada!',
  saveError: 'Erro ao salvar',
  fetchError: 'Erro ao buscar dados',
  exportSuccess: 'Exportado com sucesso!',
  noAfflictions: 'Nenhuma aflição para exportar',
  invalidCSV: 'Selecione um arquivo CSV',
  noStatus: 'Carregue os status primeiro',
  importError: 'Erro ao processar CSV'
};

export const TIPO_OPTIONS = [
  { value: 'mental', label: '🧠 Mental' },
  { value: 'fisica', label: '💔 Física' }
];

export const SEVERIDADE_OPTIONS = [
  { value: 'leve', label: '🟢 Leve' },
  { value: 'media', label: '🟡 Média' },
  { value: 'grave', label: '🔴 Grave' }
];

export const CSV_TEMPLATE = `nome,tipo,descricao,nivel_leve,nivel_medio,nivel_grave
Exemplo Mental,mental,"Descrição aqui",max_sp:-1|accuracy:-15,max_sp:-1|accuracy:-25,max_sp:-2|accuracy:-35`;
