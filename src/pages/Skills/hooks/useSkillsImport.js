// ============================================================================
// Skills CSV Import - Hook customizado para importação de skills
// ============================================================================

import { useFieldDefinitions } from '../../../shared/components/GenericCSVImport/hooks';
import { isInEnum } from '../../../shared/components/GenericCSVImport/utils';

/**
 * Hook que define a configuração de importação para Skills
 */
export function useSkillsImport() {
  const { createField } = useFieldDefinitions();

  // Define os campos de acordo com o modelo Skill
  const SKILL_FIELDS = [
    createField('name', 'Nome', 'string', {
      required: true,
      unique: true,
      example: 'Golpe Certeiro'
    }),
    createField('description', 'Descrição', 'string', {
      required: true,
      example: 'Um ataque físico preciso',
      validate: (value) => {
        if (!value || value.length < 3) return 'Descrição deve ter no mínimo 3 caracteres';
        return true;
      }
    }),
    createField('type', 'Tipo', 'string', {
      required: true,
      example: 'active',
      validate: (value) => {
        const validTypes = ['active', 'passive'];
        return isInEnum(value, validTypes) || 'Tipo deve ser: active, passive';
      }
    }),
    createField('levelRequirement', 'Nível Mínimo', 'number', {
      required: true,
      example: '1',
      validate: (value) => {
        const num = parseInt(value);
        if (isNaN(num) || num < 1) return 'Nível mínimo deve ser no mínimo 1';
        return true;
      }
    })
  ];

  // Mapeamento automático
  const SKILL_AUTO_MAPPING = {
    'name': 'name',
    'nome': 'name',
    'Name': 'name',
    'Nome': 'name',
    'description': 'description',
    'descrição': 'description',
    'descricao': 'description',
    'Descrição': 'description',
    'type': 'type',
    'tipo': 'type',
    'Type': 'type',
    'Tipo': 'type',
    'levelRequirement': 'levelRequirement',
    'levelrequirement': 'levelRequirement',
    'level': 'levelRequirement',
    'nivel': 'levelRequirement',
    'nível': 'levelRequirement',
    'nivelminimo': 'levelRequirement',
    'nível mínimo': 'levelRequirement',
    'Level': 'levelRequirement'
  };

  /**
   * Transforma dados mapeados do CSV para formato da API
   */
  const transformDataForAPI = (mappedData) => {
    return mappedData.map(row => ({
      name: row.name?.trim(),
      description: row.description?.trim(),
      type: row.type?.toLowerCase(),
      levelRequirement: parseInt(row.levelRequirement) || 1,
      classRestrictions: [],
      statsModifiers: {},
      duration: { type: 'instant', value: 0 },
      afflictionEffects: [],
      recurringEffects: [],
      cost: { resources: [], items: [] },
      damage: { formula: '', type: 'none' },
      targets: ['self']
    }));
  };

  /**
   * Verifica se skill já existe (duplicado)
   */
  const isDuplicate = (newRow, existingData) => {
    return existingData.some(skill =>
      skill.name?.toLowerCase() === newRow.name?.toLowerCase()
    );
  };

  return {
    fields: SKILL_FIELDS,
    autoMapping: SKILL_AUTO_MAPPING,
    transformDataForAPI,
    isDuplicate,
    entityNamePlural: 'skills'
  };
}
