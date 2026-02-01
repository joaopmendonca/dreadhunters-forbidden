import { useMemo } from 'react';

/**
 * Hook para configuração de importação CSV de Roles
 */
export default function useRolesImport() {
  const fields = useMemo(() => [
    {
      name: 'name',
      label: 'Nome',
      required: true,
      example: 'Tank'
    },
    {
      name: 'description',
      label: 'Descrição',
      required: false,
      example: 'Role focada em defesa e proteção do grupo'
    }
  ], []);

  const autoMapping = useMemo(() => ({
    'nome': 'name',
    'name': 'name',
    'descrição': 'description',
    'descricao': 'description',
    'description': 'description',
    'desc': 'description'
  }), []);

  const transformDataForAPI = (data) => {
    return {
      name: data.name?.trim() || '',
      description: data.description?.trim() || ''
    };
  };

  const isDuplicate = (item, existingList) => {
    return existingList.some(existing => 
      existing.name.toLowerCase() === item.name.toLowerCase()
    );
  };

  return {
    fields,
    autoMapping,
    transformDataForAPI,
    isDuplicate,
    entityName: 'role',
    entityNamePlural: 'roles'
  };
}
