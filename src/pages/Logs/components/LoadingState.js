import React from 'react';
import styles from '../styles/Logs.module.css';

export default function LoadingState() {
  return (
    <div className={styles.loading}>
      <div className={styles.loadingSpinner}></div>
      <span>Carregando logs…</span>
    </div>
  );
}
