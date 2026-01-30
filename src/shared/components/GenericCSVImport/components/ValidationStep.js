// ============================================================================
// ValidationStep - Etapa de Validação
// ============================================================================

import React from 'react';
import styles from '../styles/GenericCSVImport.module.css';

export function ValidationStep({ 
  validationResult, 
  duplicateAction, 
  setDuplicateAction,
  downloadErrorReport 
}) {
  if (!validationResult) return null;

  return (
    <div className={styles.validationSummary}>
      <h3>Resultado da Validação</h3>
      
      {/* Stats */}
      <div className={styles.validationStats}>
        <div className={`${styles.statCard} ${styles.statSuccess}`}>
          <span className={styles.statIcon}>✅</span>
          <span className={styles.statNumber}>{validationResult.valid.length}</span>
          <span className={styles.statLabel}>Válidos</span>
        </div>
        
        <div className={`${styles.statCard} ${styles.statWarning}`}>
          <span className={styles.statIcon}>⚠️</span>
          <span className={styles.statNumber}>{validationResult.warnings.length}</span>
          <span className={styles.statLabel}>Avisos</span>
        </div>
        
        <div className={`${styles.statCard} ${styles.statError}`}>
          <span className={styles.statIcon}>❌</span>
          <span className={styles.statNumber}>{validationResult.errors.length}</span>
          <span className={styles.statLabel}>Erros</span>
        </div>
        
        <div className={`${styles.statCard} ${styles.statDuplicate}`}>
          <span className={styles.statIcon}>🔄</span>
          <span className={styles.statNumber}>{validationResult.duplicates.length}</span>
          <span className={styles.statLabel}>Duplicados</span>
        </div>
      </div>

      {/* Duplicate Action */}
      {validationResult.duplicates.length > 0 && (
        <div className={styles.duplicateAction}>
          <h4>O que fazer com os duplicados?</h4>
          <div className={styles.duplicateOptions}>
            <label className={duplicateAction === 'skip' ? styles.active : ''}>
              <input 
                type="radio" 
                name="duplicate" 
                value="skip"
                checked={duplicateAction === 'skip'}
                onChange={(e) => setDuplicateAction(e.target.value)}
              />
              <span className={styles.optionIcon}>⏭️</span>
              <span className={styles.optionText}>Pular</span>
            </label>
            
            <label className={duplicateAction === 'update' ? styles.active : ''}>
              <input 
                type="radio" 
                name="duplicate" 
                value="update"
                checked={duplicateAction === 'update'}
                onChange={(e) => setDuplicateAction(e.target.value)}
              />
              <span className={styles.optionIcon}>🔄</span>
              <span className={styles.optionText}>Atualizar</span>
            </label>
            
            <label className={duplicateAction === 'create' ? styles.active : ''}>
              <input 
                type="radio" 
                name="duplicate" 
                value="create"
                checked={duplicateAction === 'create'}
                onChange={(e) => setDuplicateAction(e.target.value)}
              />
              <span className={styles.optionIcon}>➕</span>
              <span className={styles.optionText}>Criar novo</span>
            </label>
          </div>
        </div>
      )}

      {/* Errors List */}
      {validationResult.errors.length > 0 && (
        <div className={styles.errorList}>
          <h4>Registros com erros (não serão importados)</h4>
          <div className={styles.errorItems}>
            {validationResult.errors.slice(0, 5).map((err, idx) => (
              <div key={idx} className={styles.errorItem}>
                <span className={styles.errorRow}>Linha {err.row}</span>
                <span className={styles.errorDetail}>{err.errors.join(', ')}</span>
              </div>
            ))}
            {validationResult.errors.length > 5 && (
              <div className={styles.errorMore}>
                + {validationResult.errors.length - 5} erros adicionais
              </div>
            )}
          </div>
        </div>
      )}

      <button className={styles.btnDownloadReport} onClick={downloadErrorReport}>
        📥 Baixar Relatório Completo
      </button>
    </div>
  );
}

export default ValidationStep;
