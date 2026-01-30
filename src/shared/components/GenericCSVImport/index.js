// ============================================================================
// Generic CSV Import - Exportação Principal
// ============================================================================

// Componente principal
export { default } from './components/GenericCSVImport';
export { default as GenericCSVImport } from './components/GenericCSVImport';

// Componentes auxiliares
export { default as UploadStep } from './components/UploadStep';
export { default as MappingStep } from './components/MappingStep';
export { default as ValidationStep } from './components/ValidationStep';
export { default as ResultStep } from './components/ResultStep';
export { default as StepsIndicator } from './components/StepsIndicator';
export { default as LoadingOverlay } from './components/LoadingOverlay';
export { default as Footer } from './components/Footer';

// Hooks
export { useCSVImport, useDragDrop, useFieldDefinitions } from './hooks';

// Utils
export {
  autoDetectMapping,
  convertData,
  validateData,
  parseNumber,
  parseBoolean,
  parseDate,
  parseArray,
  parseJSON,
  isValidEmail,
  isInRange,
  hasLength,
  isInEnum,
  isValidURL,
  isValidJSON,
  downloadTemplate,
  downloadErrorReport
} from './utils';

// Constants
export {
  FIELD_TYPES,
  CSV_PARSE_CONFIG,
  VALIDATION_MESSAGES,
  DUPLICATE_OPTIONS,
  IMPORT_STEPS,
  VALIDATION_STATUS
} from './constants';
