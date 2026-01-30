// ============================================================================
// Download - Funções para download de arquivos
// ============================================================================

/**
 * Gera e faz download do template CSV
 */
export function downloadTemplate(fieldDefinitions, entityNamePlural) {
  const csvHeaders = fieldDefinitions.map(f => f.label).join(',');
  const example = fieldDefinitions.map(f => {
    if (f.example) return f.example;
    switch (f.type) {
      case 'number': return '100';
      case 'currency': return '1500.00';
      case 'boolean': return 'true';
      case 'date': return '01/01/2024';
      case 'array': return 'valor1,valor2';
      default: return 'Exemplo';
    }
  }).join(',');

  const csv = `${csvHeaders}\n${example}`;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `template_${entityNamePlural.toLowerCase().replace(/ /g, '_')}.csv`;
  link.click();
}

/**
 * Gera e faz download do relatório de erros
 */
export function downloadErrorReport(validationResult, file, fieldDefinitions, entityNamePlural) {
  if (!validationResult) return;

  let report = 'RELATÓRIO DE VALIDAÇÃO\n';
  report += `Data: ${new Date().toLocaleString('pt-BR')}\n`;
  report += `Arquivo: ${file?.name}\n`;
  report += `Entidade: ${entityNamePlural}\n\n`;
  report += `Total de registros: ${validationResult.total}\n`;
  report += `Válidos: ${validationResult.valid.length}\n`;
  report += `Com avisos: ${validationResult.warnings.length}\n`;
  report += `Com erros: ${validationResult.errors.length}\n`;
  report += `Duplicados: ${validationResult.duplicates.length}\n\n`;

  if (validationResult.errors.length > 0) {
    report += '=== ERROS ===\n';
    validationResult.errors.forEach(err => {
      report += `Linha ${err.row}: ${err.errors.join(', ')}\n`;
      const firstField = fieldDefinitions[0];
      const identifier = firstField ? err.item[firstField.key] : 'N/A';
      report += `  Dados: ${identifier}\n\n`;
    });
  }

  if (validationResult.warnings.length > 0) {
    report += '=== AVISOS ===\n';
    validationResult.warnings.forEach(warn => {
      report += `Linha ${warn.row}: ${warn.warnings.join(', ')}\n`;
    });
  }

  if (validationResult.duplicates.length > 0) {
    report += '\n=== DUPLICADOS ===\n';
    validationResult.duplicates.forEach(dup => {
      const firstField = fieldDefinitions[0];
      const identifier = firstField ? dup[firstField.key] : 'N/A';
      report += `Linha ${dup._rowIndex}: ${identifier}\n`;
    });
  }

  const blob = new Blob([report], { type: 'text/plain;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'relatorio_validacao.txt';
  link.click();
}
