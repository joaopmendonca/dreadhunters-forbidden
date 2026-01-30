// ============================================================================
// MappingStep - Etapa de Mapeamento de Colunas
// ============================================================================

import React from 'react';
import styles from '../styles/GenericCSVImport.module.css';

export function MappingStep({ headers, mapping, fieldDefinitions, onMappingChange, error }) {
  const mappedCount = Object.keys(mapping).length;

  return (
    <>
      <div className={styles.mappingHeader}>
        <h3>Mapeamento de Colunas</h3>
        <p>Conecte as colunas do seu CSV aos campos do sistema</p>
      </div>

      <div className={styles.mappingGrid}>
        {headers.map((header, index) => (
          <div key={index} className={styles.mappingRow}>
            <div className={styles.csvColumn}>
              <span className={styles.columnIndex}>Col {index + 1}</span>
              <span className={styles.columnName}>{header || '(vazio)'}</span>
            </div>
            
            <div className={styles.mappingArrow}>→</div>
            
            <select
              className={styles.systemFieldSelect}
              value={mapping[index] || ''}
              onChange={(e) => onMappingChange(index, e.target.value)}
            >
              <option value="">Ignorar coluna</option>
              {fieldDefinitions.map(field => {
                const isUsed = Object.values(mapping).includes(field.key) && mapping[index] !== field.key;
                return (
                  <option 
                    key={field.key} 
                    value={field.key}
                    disabled={isUsed}
                  >
                    {field.label} {field.required ? '*' : ''} {isUsed ? '(já mapeado)' : ''}
                  </option>
                );
              })}
            </select>
          </div>
        ))}
      </div>

      <div className={styles.mappingLegend}>
        <span className={styles.legendRequired}>* Campos obrigatórios</span>
        <span className={styles.legendCount}>
          {mappedCount} de {headers.length} colunas mapeadas
        </span>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}
    </>
  );
}

export default MappingStep;
