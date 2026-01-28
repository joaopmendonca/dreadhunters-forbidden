import React from 'react';
import styles from '../styles/Attributes.module.css';

export function LoadingState() {
  return (
    <div className={styles.loading}>
      <div className={styles.loadingSpinner}></div>
      <span>Carregando atributos…</span>
    </div>
  );
}
