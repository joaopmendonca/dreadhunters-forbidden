// ============================================================================
// Attributes CSV Import - Hook customizado para importação de atributos
// ============================================================================

import { useFieldDefinitions } from '../../../shared/components/GenericCSVImport/hooks';
import { isInEnum } from '../../../shared/components/GenericCSVImport/utils';

/**
 * Hook que define a configuração de importação para Atributos
 */
export function useAttributesImport() {
  const { createField } = useFieldDefinitions();

  // Define os campos de acordo com o modelo Status
  const ATTRIBUTE_FIELDS = [
    createField('nome', 'Nome (Identificador)', 'string', {
      required: true,
      unique: true,
      example: 'str'
    }),
    createField('label', 'Label (Exibição)', 'string', {
      required: true,
      example: 'STR',
      validate: (value) => {
        if (!value || value.length < 1) return 'Label deve ter no mínimo 1 caractere';
        return true;
      }
    }),
    createField('tipo', 'Tipo', 'string', {
      required: true,
      example: 'base',
      validate: (value) => {
        const validTypes = ['base', 'derivado'];
        return isInEnum(value, validTypes) || 'Tipo deve ser: base, derivado';
      }
    }),
    createField('descricao', 'Descrição', 'string', {
      example: 'Força - Aumenta dano físico'
    }),
    createField('unidade', 'Unidade', 'string', {
      example: 'pontos'
    }),
    createField('formula', 'Fórmula', 'string', {
      example: 'STR * 2 + nivel'
    }),
    createField('visivel', 'Visível', 'boolean', {
      example: 'true',
      validate: (value) => {
        if (value === '' || value === null || value === undefined) return true;
        const lower = String(value).toLowerCase();
        if (!['true', 'false', '1', '0', 'sim', 'nao', 'não', 'yes', 'no'].includes(lower)) {
          return 'Visível deve ser: true/false, 1/0, sim/não';
        }
        return true;
      }
    }),
    createField('ordem', 'Ordem', 'number', {
      example: '1',
      validate: (value) => {
        if (value === '' || value === null || value === undefined) return true;
        const num = parseInt(value);
        if (isNaN(num)) return 'Ordem deve ser um número';
        return true;
      }
    })
  ];

  // Mapeamento automático
  const ATTRIBUTE_AUTO_MAPPING = {
    'nome': 'nome',
    'name': 'nome',
    'Nome': 'nome',
    'Name': 'nome',
    'label': 'label',
    'Label': 'label',
    'tipo': 'tipo',
    'type': 'tipo',
    'Tipo': 'tipo',
    'Type': 'tipo',
    'descricao': 'descricao',
    'descrição': 'descricao',
    'description': 'descricao',
    'Descrição': 'descricao',
    'Description': 'descricao',
    'unidade': 'unidade',
    'unit': 'unidade',
    'Unidade': 'unidade',
    'Unit': 'unidade',
    'formula': 'formula',
    'fórmula': 'formula',
    'Formula': 'formula',
    'Fórmula': 'formula',
    'visivel': 'visivel',
    'visible': 'visivel',
    'Visível': 'visivel',
    'Visible': 'visivel',
    'ordem': 'ordem',
    'order': 'ordem',
    'Ordem': 'ordem',
    'Order': 'ordem'
  };

  /**
   * Transforma dados mapeados do CSV para formato da API
   */
  const transformDataForAPI = (mappedData) => {
    return mappedData.map(row => {
      // Converter visível para boolean
      let visivelValue = true;
      if (row.visivel !== undefined && row.visivel !== null && row.visivel !== '') {
        const lower = String(row.visivel).toLowerCase();
        visivelValue = ['true', '1', 'sim', 'yes'].includes(lower);
      }

      return {
        nome: row.nome?.trim(),
        label: row.label?.trim() || row.nome?.trim(),
        tipo: row.tipo?.toLowerCase(),
        descricao: row.descricao?.trim() || '',
        unidade: row.unidade?.trim() || 'pontos',
        formula: row.formula?.trim() || '',
        visivel: visivelValue,
        ordem: row.ordem ? parseInt(row.ordem) : 0
      };
    });
  };

  /**
   * Verifica se atributo já existe (duplicado)
   */
  const isDuplicate = (newRow, existingData) => {
    return existingData.some(attribute =>
      attribute.nome?.toLowerCase() === newRow.nome?.toLowerCase()
    );
  };

  return {
    fields: ATTRIBUTE_FIELDS,
    autoMapping: ATTRIBUTE_AUTO_MAPPING,
    transformDataForAPI,
    isDuplicate,
    entityNamePlural: 'attributes'
  };
}
