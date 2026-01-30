// ============================================================================
// Validators - Funções de validação
// ============================================================================

/**
 * Valida email
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida se está em um intervalo
 */
export function isInRange(value, min, max) {
  const num = Number(value);
  if (isNaN(num)) return false;
  return num >= min && num <= max;
}

/**
 * Valida comprimento
 */
export function hasLength(value, min, max) {
  if (!value) return false;
  const length = String(value).length;
  return length >= min && length <= max;
}

/**
 * Valida se está em um enum
 */
export function isInEnum(value, validOptions) {
  if (!value) return false;
  const normalized = String(value).toLowerCase().trim();
  return validOptions.some(opt => opt.toLowerCase() === normalized);
}

/**
 * Valida URL
 */
export function isValidURL(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Valida JSON
 */
export function isValidJSON(str) {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}
