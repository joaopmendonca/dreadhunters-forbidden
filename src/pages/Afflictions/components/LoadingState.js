import React from 'react';
import styles from '../styles/Afflictions.module.css';

export default function LoadingState() {
  return (
    <div className={styles.loading}>
      <div className={styles.loadingSpinner}></div>
      <span>Carregando aflições…</span>
    </div>
  );
}
