import { useFieldDefinitions } from '../../../shared/components/GenericCSVImport/hooks';

export default function useLocationsImport() {
  const { createField } = useFieldDefinitions();

  const fields = [
    createField('name', 'Nome', 'string', {
      required: true,
      unique: true,
      example: 'Taverna do Caçador Perdido'
    }),
    createField('description', 'Descrição', 'string', {
      required: false,
      example: 'Um refúgio sombrio onde caçadores compartilham histórias'
    }),
    createField('position.x', 'Posição X', 'number', {
      required: false,
      example: '100'
    }),
    createField('position.y', 'Posição Y', 'number', {
      required: false,
      example: '150'
    })
  ];

  const autoMapping = {
    'nome': 'name',
    'name': 'name',
    'descrição': 'description',
    'descricao': 'description',
    'description': 'description',
    'position.x': 'position.x',
    'posicao.x': 'position.x',
    'x': 'position.x',
    'position.y': 'position.y',
    'posicao.y': 'position.y',
    'y': 'position.y'
  };

  const transformDataForAPI = (row) => {
    return {
      name: row.name?.trim(),
      description: row.description?.trim() || '',
      position: {
        x: row['position.x'] ? Number(row['position.x']) : 0,
        y: row['position.y'] ? Number(row['position.y']) : 0
      }
    };
  };

  const isDuplicate = (newItem, existingItems) => {
    return existingItems.some(
      item => item.name?.toLowerCase() === newItem.name?.toLowerCase()
    );
  };

  return {
    fields,
    autoMapping,
    transformDataForAPI,
    isDuplicate,
    entityName: 'Local',
    entityNamePlural: 'locais'
  };
}
