import { useMemo } from 'react';

/**
 * Hook para configuração de importação CSV de Roles
 */
export default function useRolesImport() {
  const fields = useMemo(() => [
    {
      key: 'nome',
      label: 'Nome',
      required: true,
      example: 'Tank'
    },
    {
      key: 'descricao',
      label: 'Descrição',
      required: false,
      example: 'Role focada em defesa e proteção do grupo'
    }
  ], []);

  const autoMapping = useMemo(() => ({
    'nome': 'nome',
    'name': 'nome',
    'descrição': 'descricao',
    'descricao': 'descricao',
    'description': 'descricao',
    'desc': 'descricao'
  }), []);

  const transformDataForAPI = (data) => {
    return {
      name: data.nome?.trim() || '',
      description: data.descricao?.trim() || ''
    };
  };

  const isDuplicate = (item, existingList) => {
    return existingList.some(existing => 
      existing.name.toLowerCase() === item.nome.toLowerCase()
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
