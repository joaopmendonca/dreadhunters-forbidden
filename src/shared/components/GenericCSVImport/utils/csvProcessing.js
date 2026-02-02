// ============================================================================
// CSV Processing - Funções de processamento de CSV
// ============================================================================

import { parseArray, parseBoolean, parseDate, parseJSON, parseNumber } from './parsers';

/**
 * Auto-detecta mapeamento baseado nos headers do CSV
 */
export function autoDetectMapping(csvHeaders, autoMapping = {}) {
  const detected = {};
  const normalizedMapping = {};

  // Normaliza o autoMapping
  Object.entries(autoMapping).forEach(([csvKey, systemField]) => {
    normalizedMapping[csvKey.toLowerCase().trim()] = systemField;
  });

  csvHeaders.forEach((header, index) => {
    const normalized = header.toLowerCase().trim();
    if (normalizedMapping[normalized]) {
      detected[index] = normalizedMapping[normalized];
    }
  });

  return detected;
}

/**
 * Converte dados CSV usando o mapeamento
 */
export function convertData(rawData, mapping, fieldDefinitions, customParseValue) {
  const parseValue = customParseValue || defaultParseValue;

  return rawData.map((row, rowIndex) => {
    const item = { _rowIndex: rowIndex + 2 };

    Object.entries(mapping).forEach(([csvIndex, systemField]) => {
      const value = row[csvIndex];
      const fieldDef = fieldDefinitions.find(f => f.key === systemField);
      
      if (fieldDef) {
        item[systemField] = parseValue(value, fieldDef.type);
      } else {
        item[systemField] = value?.trim() || null;
      }
    });

    return item;
  });
}

/**
 * Parser padrão de valores
 */
function defaultParseValue(value, type) {
  switch (type) {
    case 'number':
    case 'currency':
      return parseNumber(value);
    case 'boolean':
      return parseBoolean(value);
    case 'date':
      return parseDate(value);
    case 'array':
      return parseArray(value);
    case 'json':
      return parseJSON(value);
    case 'string':
    default:
      return value?.trim() || null;
  }
}

/**
 * Valida os dados convertidos
 */
export function validateData(data, fieldDefinitions, existingData, customValidateRow, customIsDuplicate) {
  const errors = [];
  const warnings = [];
  const valid = [];
  const duplicates = [];

  const validateRow = customValidateRow || defaultValidateRow;
  const checkDuplicate = customIsDuplicate || defaultIsDuplicate;

  data.forEach((item) => {
    const rowErrors = [];
    const rowWarnings = [];

    // Validação customizada ou padrão
    validateRow(item, rowErrors, rowWarnings, fieldDefinitions);

    // Verifica duplicados
    const isDupe = checkDuplicate(item, existingData, fieldDefinitions);

    if (isDupe) {
      duplicates.push({ ...item });
    }

    if (rowErrors.length > 0) {
      errors.push({
        row: item._rowIndex,
        item,
        errors: rowErrors
      });
    } else if (rowWarnings.length > 0) {
      warnings.push({
        row: item._rowIndex,
        item,
        warnings: rowWarnings
      });
      valid.push(item);
    } else {
      valid.push(item);
    }
  });

  return { valid, errors, warnings, duplicates, total: data.length };
}

/**
 * Validação padrão de linha
 */
function defaultValidateRow(item, rowErrors, rowWarnings, fieldDefinitions) {
  fieldDefinitions.forEach(field => {
    if (field.required && (!item[field.key] || String(item[field.key]).trim() === '')) {
      rowErrors.push(`${field.label} é obrigatório`);
    }

    if (field.validate && item[field.key]) {
      const validationResult = field.validate(item[field.key], item);
      if (validationResult !== true) {
        rowWarnings.push(validationResult || `${field.label} inválido`);
      }
    }
  });
}

/**
 * Verificação padrão de duplicados
 */
function defaultIsDuplicate(item, existingData, fieldDefinitions) {
  const requiredFields = fieldDefinitions
    .filter(f => f.required && f.unique)
    .map(f => f.key);

  if (requiredFields.length === 0) return false;

  return existingData.some(existing => {
    return requiredFields.some(field => 
      existing[field] && item[field] && 
      String(existing[field]).toLowerCase() === String(item[field]).toLowerCase()
    );
  });
}
