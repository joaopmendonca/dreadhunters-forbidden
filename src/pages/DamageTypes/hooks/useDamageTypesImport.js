// src/pages/DamageTypes/hooks/useDamageTypesImport.js

/**
 * Hook para gerenciar importação CSV de Tipos de Dano
 */
export function useDamageTypesImport() {
  const fields = [
    { 
      name: 'nome', 
      label: 'Nome (Slug)', 
      required: true, 
      type: 'text',
      description: 'Identificador único em minúsculas (ex: physical, magical)'
    },
    { 
      name: 'label', 
      label: 'Label', 
      required: true, 
      type: 'text',
      description: 'Nome exibido ao usuário (ex: Físico, Mágico)'
    },
    { 
      name: 'descricao', 
      label: 'Descrição', 
      required: false, 
      type: 'text',
      description: 'Descrição do tipo de dano'
    },
    { 
      name: 'cor', 
      label: 'Cor', 
      required: false, 
      type: 'text',
      description: 'Cor em hexadecimal (ex: #ff6b35)'
    },
    { 
      name: 'formula', 
      label: 'Fórmula', 
      required: false, 
      type: 'text',
      description: 'Fórmula completa de cálculo (ex: p_atk - target.p_def)'
    },
    { 
      name: 'ordem', 
      label: 'Ordem', 
      required: false, 
      type: 'number',
      description: 'Ordem de exibição (número)'
    },
    { 
      name: 'ativo', 
      label: 'Ativo', 
      required: false, 
      type: 'boolean',
      description: 'Se o tipo está ativo (true/false)'
    }
  ];

  const autoMapping = {
    'nome': ['nome', 'name', 'slug', 'id'],
    'label': ['label', 'nome_exibicao', 'display_name', 'titulo', 'title'],
    'descricao': ['descricao', 'description', 'desc'],
    'cor': ['cor', 'color', 'colour'],
    'formula': ['formula', 'formula_dano', 'damage_formula'],
    'ordem': ['ordem', 'order', 'position', 'sort'],
    'ativo': ['ativo', 'active', 'enabled', 'habilitado']
  };

  const transformDataForAPI = (damageType) => {
    return {
      nome: damageType.nome?.toLowerCase().trim(),
      label: damageType.label?.trim(),
      descricao: damageType.descricao?.trim() || '',
      cor: damageType.cor?.trim() || '#888888',
      formula: damageType.formula?.trim() || '',
      ordem: parseInt(damageType.ordem) || 0,
      ativo: damageType.ativo === true || damageType.ativo === 'true' || damageType.ativo === '1'
    };
  };

  const isDuplicate = (damageType, existingData) => {
    return existingData.some(
      existing => existing.nome?.toLowerCase() === damageType.nome?.toLowerCase()
    );
  };

  const entityNamePlural = 'Tipos de Dano';

  return {
    fields,
    autoMapping,
    transformDataForAPI,
    isDuplicate,
    entityNamePlural
  };
}
