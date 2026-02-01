export default function useLocationsImport() {
  return {
    fields: [
      { name: 'name', label: 'Nome', required: true },
      { name: 'description', label: 'Descrição', required: false }
    ],
    autoMapping: {
      'nome': 'name',
      'name': 'name',
      'descrição': 'description',
      'descricao': 'description',
      'description': 'description'
    },
    transformDataForAPI: (row) => ({
      name: row.name?.trim(),
      description: row.description?.trim() || ''
    }),
    isDuplicate: (newItem, existingItems) => {
      return existingItems.some(
        item => item.name?.toLowerCase() === newItem.name?.toLowerCase()
      );
    },
    entityNamePlural: 'locais'
  };
}
