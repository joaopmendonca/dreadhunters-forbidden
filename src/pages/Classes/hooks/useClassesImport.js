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
      name: 'nome',
      label: 'Nome',
      required: true,
      example: 'Observador'
    },
    {
      name: 'descricao',
      label: 'Descrição',
      required: false,
      example: 'Investigador atento que percebe o que outros ignoram'
    },
    {
      name: 'role',
      label: 'Role',
      required: true,
      example: 'Híbrido'
    },
    {
      name: 'str',
      label: 'STR',
      required: true,
      example: '2'
    },
    {
      name: 'dex',
      label: 'DEX',
      required: true,
      example: '3'
    },
    {
      name: 'con',
      label: 'CON',
      required: true,
      example: '3'
    },
    {
      name: 'int',
      label: 'INT',
      required: true,
      example: '5'
    },
    {
      name: 'wis',
      label: 'WIS',
      required: true,
      example: '5'
    },
    {
      name: 'luk',
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
    // Encontra a role pelo nome
    const role = rolesList.find(r => 
      r.name.toLowerCase() === data.role?.toLowerCase()
    );

    if (!role) {
      throw new Error(`Role "${data.role}" não encontrada`);
    }

    return {
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
