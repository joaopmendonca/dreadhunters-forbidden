import { useFieldDefinitions } from '../../../shared/components/GenericCSVImport/hooks';

/**
 * Hook para configuração de importação CSV de Quests
 */
export default function useQuestsImport() {
  const { createField } = useFieldDefinitions();

  const fields = [
    createField('title', 'Título', 'string', {
      required: true,
      unique: true,
      example: 'A Primeira Missão'
    }),
    createField('type', 'Tipo', 'string', {
      required: true,
      example: 'main'
    }),
    createField('description', 'Descrição', 'string', {
      required: false,
      example: 'Colete 10 ervas medicinais'
    }),
    createField('levelRequirement', 'Nível Mínimo', 'number', {
      required: false,
      example: '5'
    })
  ];

  const autoMapping = {
    'titulo': 'title',
    'título': 'title',
    'title': 'title',
    'tipo': 'type',
    'type': 'type',
    'descrição': 'description',
    'descricao': 'description',
    'description': 'description',
    'nivel': 'levelRequirement',
    'nível': 'levelRequirement',
    'level': 'levelRequirement',
    'levelrequirement': 'levelRequirement'
  };

  const transformDataForAPI = (data) => {
    return {
      title: data.title?.trim() || '',
      type: data.type?.toLowerCase().trim() || 'side',
      description: data.description?.trim() || '',
      levelRequirement: data.levelRequirement ? parseInt(data.levelRequirement, 10) : 1
    };
  };

  const isDuplicate = (item, existingList) => {
    return existingList.some(existing => 
      existing.title.toLowerCase() === item.title.toLowerCase()
    );
  };

  return {
    fields,
    autoMapping,
    transformDataForAPI,
    isDuplicate,
    entityName: 'Quest',
    entityNamePlural: 'quests'
  };
}
