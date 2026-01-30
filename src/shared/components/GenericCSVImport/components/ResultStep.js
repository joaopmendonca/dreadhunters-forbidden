// ============================================================================
// ResultStep - Etapa de Resultado da Importação
// ============================================================================

import React from 'react';
import styles from '../styles/GenericCSVImport.module.css';

export function ResultStep({ importResult, entityNamePlural }) {
  if (!importResult) return null;

  return (
    <div className={styles.importResult}>
      <div className={styles.resultIcon}>🎉</div>
      <h3>Importação Concluída!</h3>
      
      <div className={styles.resultStats}>
        <div className={`${styles.resultItem} ${styles.success}`}>
          <span className={styles.resultNumber}>{importResult.success}</span>
          <span className={styles.resultLabel}>{entityNamePlural} importados</span>
        </div>
        
        {importResult.updated > 0 && (
          <div className={`${styles.resultItem} ${styles.updated}`}>
            <span className={styles.resultNumber}>{importResult.updated}</span>
            <span className={styles.resultLabel}>Atualizados</span>
          </div>
        )}
        
        {importResult.skipped > 0 && (
          <div className={`${styles.resultItem} ${styles.skipped}`}>
            <span className={styles.resultNumber}>{importResult.skipped}</span>
            <span className={styles.resultLabel}>Ignorados</span>
          </div>
        )}
        
        {importResult.errors > 0 && (
          <div className={`${styles.resultItem} ${styles.errors}`}>
            <span className={styles.resultNumber}>{importResult.errors}</span>
            <span className={styles.resultLabel}>Com erros</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResultStep;
