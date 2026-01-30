// ============================================================================
// Parsers - Funções de parsing de valores
// ============================================================================

/**
 * Parse de número
 */
export function parseNumber(value) {
  if (!value || value === '-' || value === '') return null;
  const cleaned = String(value).trim().replace(/\./g, '').replace(',', '.');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? null : parsed;
}

/**
 * Parse de boolean
 */
export function parseBoolean(value) {
  if (!value) return false;
  const str = String(value).toLowerCase().trim();
  return ['true', '1', 'yes', 'sim', 's', 'y'].includes(str);
}

/**
 * Parse de data (DD/MM/YYYY)
 */
export function parseDate(dateStr) {
  if (!dateStr || dateStr === '-' || dateStr === '') return null;
  const parts = String(dateStr).split('/');
  if (parts.length === 3) {
    const date = new Date(parts[2], parts[1] - 1, parts[0]);
    if (!isNaN(date.getTime())) return date;
  }
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? null : date;
}

/**
 * Parse de array (valores separados por vírgula)
 */
export function parseArray(value) {
  if (!value || value === '-' || value === '') return [];
  return String(value).split(',').map(v => v.trim()).filter(Boolean);
}

/**
 * Parse de JSON
 */
export function parseJSON(value) {
  if (!value || value === '-' || value === '') return null;
  try {
    return JSON.parse(value);
  } catch (e) {
    return null;
  }
}
