import { useMemo } from 'react';

/**
 * Hook para configuração de importação CSV de Quests
 */
export default function useQuestsImport() {
  const fields = useMemo(() => [
    {
      name: 'title',
      label: 'Título',
      required: true,
      example: 'A Primeira Missão'
    },
    {
      name: 'type',
      label: 'Tipo',
      required: true,
      example: 'main (main, side ou daily)'
    },
    {
      name: 'description',
      label: 'Descrição',
      required: false,
      example: 'Colete 10 ervas medicinais'
    },
    {
      name: 'levelRequirement',
      label: 'Nível Mínimo',
      required: false,
      example: '5'
    }
  ], []);

  const autoMapping = useMemo(() => ({
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
  }), []);

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
    entityName: 'quest',
    entityNamePlural: 'quests'
  };
}
