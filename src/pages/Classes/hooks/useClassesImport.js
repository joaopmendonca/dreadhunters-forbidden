// ============================================================================
// Classes CSV Import - Hook customizado para importação de classes
// ============================================================================

import { useMemo } from 'react';

/**
 * Hook que define a configuração de importação para Classes
 */
export function useClassesImport() {
  const fields = useMemo(() => [
    {
      key: 'nome',
      label: 'Nome',
      required: true,
      example: 'Observador'
    },
    {
      key: 'descricao',
      label: 'Descrição',
      required: false,
      example: 'Investigador atento que percebe o que outros ignoram'
    },
    {
      key: 'role',
      label: 'Role',
      required: true,
      example: 'Híbrido'
    },
    {
      key: 'str',
      label: 'STR',
      required: true,
      example: '2'
    },
    {
      key: 'dex',
      label: 'DEX',
      required: true,
      example: '3'
    },
    {
      key: 'con',
      label: 'CON',
      required: true,
      example: '3'
    },
    {
      key: 'int',
      label: 'INT',
      required: true,
      example: '5'
    },
    {
      key: 'wis',
      label: 'WIS',
      required: true,
      example: '5'
    },
    {
      key: 'luk',
      label: 'LUK',
      required: true,
      example: '2'
    }
  ], []);

  const autoMapping = useMemo(() => ({
    'nome': 'nome',
    'name': 'nome',
    'descricao': 'descricao',
    'descrição': 'descricao',
    'description': 'descricao',
    'role': 'role',
    'papel': 'role',
    'str': 'str',
    'dex': 'dex',
    'con': 'con',
    'int': 'int',
    'wis': 'wis',
    'luk': 'luk'
  }), []);

  const transformDataForAPI = (data, rolesList) => {
    console.log('transformDataForAPI - data recebido:', data);
    console.log('transformDataForAPI - rolesList:', rolesList);
    
    // Encontra a role pelo nome
    const role = rolesList.find(r => 
      r.name.toLowerCase() === data.role?.toLowerCase()
    );

    if (!role) {
      throw new Error(`Role "${data.role}" não encontrada`);
    }

    const transformed = {
      name: data.nome?.trim() || '',
      description: data.descricao?.trim() || '',
      role: role._id,
      baseStats: {
        str: parseInt(data.str) || 0,
        dex: parseInt(data.dex) || 0,
        con: parseInt(data.con) || 0,
        int: parseInt(data.int) || 0,
        wis: parseInt(data.wis) || 0,
        luk: parseInt(data.luk) || 0
      }
    };
    
    console.log('transformDataForAPI - resultado:', transformed);
    return transformed;
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
    entityName: 'classe',
    entityNamePlural: 'classes'
  };
}

export default useClassesImport;
