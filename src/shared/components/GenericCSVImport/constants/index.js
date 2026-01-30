// ============================================================================
// Constants - Definições de tipos e configurações
// ============================================================================

/**
 * Tipos de campo suportados
 */
export const FIELD_TYPES = {
  STRING: 'string',
  NUMBER: 'number',
  CURRENCY: 'currency',
  BOOLEAN: 'boolean',
  DATE: 'date',
  ARRAY: 'array',
  JSON: 'json'
};

/**
 * Configurações padrão do Papa Parse
 */
export const CSV_PARSE_CONFIG = {
  header: false,
  skipEmptyLines: true,
  encoding: 'UTF-8',
  dynamicTyping: false
};

/**
 * Mensagens de validação padrão
 */
export const VALIDATION_MESSAGES = {
  REQUIRED_FIELD: (field) => `${field} é obrigatório`,
  INVALID_TYPE: (field, type) => `${field} deve ser do tipo ${type}`,
  INVALID_EMAIL: 'E-mail inválido',
  INVALID_URL: 'URL inválida',
  OUT_OF_RANGE: (field, min, max) => `${field} deve estar entre ${min} e ${max}`,
  INVALID_LENGTH: (field, min, max) => `${field} deve ter entre ${min} e ${max} caracteres`,
  DUPLICATE: (field) => `${field} já existe no sistema`,
  INVALID_ENUM: (field, options) => `${field} deve ser um dos seguintes: ${options.join(', ')}`
};

/**
 * Opções de tratamento de duplicados
 */
export const DUPLICATE_OPTIONS = {
  SKIP: 'skip',
  UPDATE: 'update',
  CREATE_NEW: 'create_new'
};

/**
 * Estados do processo de importação
 */
export const IMPORT_STEPS = {
  UPLOAD: 1,
  MAPPING: 2,
  VALIDATION: 3,
  RESULT: 4
};

/**
 * Status de validação
 */
export const VALIDATION_STATUS = {
  VALID: 'valid',
  WARNING: 'warning',
  ERROR: 'error',
  DUPLICATE: 'duplicate'
};
