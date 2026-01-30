// ============================================================================
// LoadingOverlay - Overlay de Carregamento
// ============================================================================

import React from 'react';
import styles from '../styles/GenericCSVImport.module.css';

export function LoadingOverlay() {
  return (
    <div className={styles.loadingOverlay}>
      <div className={styles.loadingSpinner}></div>
      <span>Processando...</span>
    </div>
  );
}

export default LoadingOverlay;
