// src/pages/DamageTypes/hooks/useDamageTypesImport.js

import { useFieldDefinitions } from '../../../shared/components/GenericCSVImport/hooks';

/**
 * Hook para gerenciar importação CSV de Tipos de Dano
 */
export function useDamageTypesImport() {
  const { createField } = useFieldDefinitions();

  const fields = [
    createField('nome', 'Nome (Slug)', 'string', {
      required: true,
      unique: true,
      example: 'physical'
    }),
    createField('label', 'Label', 'string', {
      required: true,
      example: 'Físico'
    }),
    createField('descricao', 'Descrição', 'string', {
      required: false,
      example: 'Dano causado por armas e golpes físicos'
    }),
    createField('cor', 'Cor', 'string', {
      required: false,
      example: '#C41E3A'
    }),
    createField('formula', 'Fórmula', 'string', {
      required: false,
      example: 'p_atk * 1.0'
    }),
    createField('ordem', 'Ordem', 'number', {
      required: false,
      example: '0'
    }),
    createField('ativo', 'Ativo', 'boolean', {
      required: false,
      example: 'true'
    })
  ];

  const autoMapping = {
    'nome': 'nome',
    'name': 'nome',
    'slug': 'nome',
    'id': 'nome',
    'label': 'label',
    'nome_exibicao': 'label',
    'display_name': 'label',
    'titulo': 'label',
    'title': 'label',
    'descricao': 'descricao',
    'description': 'descricao',
    'desc': 'descricao',
    'cor': 'cor',
    'color': 'cor',
    'colour': 'cor',
    'formula': 'formula',
    'formula_dano': 'formula',
    'damage_formula': 'formula',
    'ordem': 'ordem',
    'order': 'ordem',
    'position': 'ordem',
    'sort': 'ordem',
    'ativo': 'ativo',
    'active': 'ativo',
    'enabled': 'ativo',
    'habilitado': 'ativo'
  };

  const transformDataForAPI = (mappedData) => {
    return mappedData.map(damageType => ({
      nome: damageType.nome?.toLowerCase().trim(),
      label: damageType.label?.trim(),
      descricao: damageType.descricao?.trim() || '',
      cor: damageType.cor?.trim() || '#888888',
      formula: damageType.formula?.trim() || '',
      ordem: parseInt(damageType.ordem) || 0,
      ativo: damageType.ativo === true || damageType.ativo === 'true' || damageType.ativo === '1'
    }));
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
