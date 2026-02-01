// ============================================================================
// Afflictions CSV Import - Hook customizado para importação de aflições
// ============================================================================

import { useFieldDefinitions } from '../../../shared/components/GenericCSVImport/hooks';
import { isInEnum } from '../../../shared/components/GenericCSVImport/utils';

/**
 * Hook que define a configuração de importação para Aflições
 */
export function useAfflictionsImport() {
  const { createField } = useFieldDefinitions();

  // Define os campos de acordo com o modelo Affliction
  const AFFLICTION_FIELDS = [
    createField('nome', 'Nome', 'string', {
      required: true,
      unique: true,
      example: 'Paranoia'
    }),
    createField('tipo', 'Tipo', 'string', {
      required: true,
      example: 'mental',
      validate: (value) => {
        const validTypes = ['mental', 'fisica'];
        return isInEnum(value, validTypes) || 'Tipo deve ser: mental, fisica';
      }
    }),
    createField('descricao', 'Descrição', 'string', {
      required: true,
      example: 'Uma profunda desconfiança de todos ao redor',
      validate: (value) => {
        if (!value || value.length < 3) return 'Descrição deve ter no mínimo 3 caracteres';
        return true;
      }
    }),
    createField('ordem', 'Ordem', 'number', { 
      example: '0',
      validate: (value) => {
        if (value === '' || value === null || value === undefined) return true; // opcional
        const num = parseInt(value);
        if (isNaN(num)) return 'Ordem deve ser um número';
        return true;
      }
    }),
    createField('ativo', 'Ativo', 'boolean', { 
      example: 'true',
      validate: (value) => {
        if (value === '' || value === null || value === undefined) return true; // opcional
        const lower = String(value).toLowerCase();
        if (!['true', 'false', '1', '0', 'sim', 'nao', 'não', 'yes', 'no'].includes(lower)) {
          return 'Ativo deve ser: true/false, 1/0, sim/não';
        }
        return true;
      }
    })
  ];

  // Mapeamento automático
  const AFFLICTION_AUTO_MAPPING = {
    'nome': 'nome',
    'name': 'nome',
    'Nome': 'nome',
    'Name': 'nome',
    'tipo': 'tipo',
    'type': 'tipo',
    'Tipo': 'tipo',
    'Type': 'tipo',
    'descricao': 'descricao',
    'descrição': 'descricao',
    'description': 'descricao',
    'Descrição': 'descricao',
    'Description': 'descricao',
    'ordem': 'ordem',
    'order': 'ordem',
    'Ordem': 'ordem',
    'Order': 'ordem',
    'ativo': 'ativo',
    'active': 'ativo',
    'Ativo': 'ativo',
    'Active': 'ativo'
  };

  /**
   * Transforma dados mapeados do CSV para formato da API
   */
  const transformDataForAPI = (mappedData) => {
    return mappedData.map(row => {
      // Converter ativo para boolean
      let ativoValue = true;
      if (row.ativo !== undefined && row.ativo !== null && row.ativo !== '') {
        const lower = String(row.ativo).toLowerCase();
        ativoValue = ['true', '1', 'sim', 'yes'].includes(lower);
      }

      return {
        nome: row.nome?.trim(),
        tipo: row.tipo?.toLowerCase(),
        descricao: row.descricao?.trim(),
        ordem: row.ordem ? parseInt(row.ordem) : 0,
        ativo: ativoValue,
        niveis: [
          { severidade: 'leve', penalidades: [] },
          { severidade: 'media', penalidades: [] },
          { severidade: 'grave', penalidades: [] }
        ]
      };
    });
  };

  /**
   * Verifica se aflição já existe (duplicado)
   */
  const isDuplicate = (newRow, existingData) => {
    return existingData.some(affliction =>
      affliction.nome?.toLowerCase() === newRow.nome?.toLowerCase()
    );
  };

  return {
    fields: AFFLICTION_FIELDS,
    autoMapping: AFFLICTION_AUTO_MAPPING,
    transformDataForAPI,
    isDuplicate,
    entityNamePlural: 'afflictions'
  };
}
