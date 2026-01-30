// ============================================================================
// useFieldDefinitions - Hook para definições de campos
// ============================================================================

import { useCallback } from 'react';

export function useFieldDefinitions() {
  /**
   * Cria uma definição de campo
   * @param {string} key - Chave do campo
   * @param {string} label - Label para exibição
   * @param {string} type - Tipo do campo (string, number, boolean, json, array, date)
   * @param {object} options - Opções adicionais (required, unique, example, validate, transform)
   */
  const createField = useCallback((key, label, type = 'string', options = {}) => {
    // Suporta tanto a forma antiga (objeto) quanto a nova (parâmetros separados)
    if (typeof key === 'object') {
      const config = key;
      return {
        key: config.key,
        label: config.label,
        required: config.required || false,
        unique: config.unique || false,
        type: config.type || 'string',
        example: config.example || '',
        validate: config.validate,
        transform: config.transform
      };
    }
    
    return {
      key,
      label,
      required: options.required || false,
      unique: options.unique || false,
      type,
      example: options.example || '',
      validate: options.validate,
      transform: options.transform
    };
  }, []);

  const createFields = useCallback((fieldsConfig) => {
    return fieldsConfig.map(config => createField(config));
  }, [createField]);

  return {
    createField,
    createFields
  };
}
