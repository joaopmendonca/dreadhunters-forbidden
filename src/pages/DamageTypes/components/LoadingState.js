import React from 'react';
import styles from '../styles/DamageTypes.module.css';

export default function LoadingState() {
  return (
    <div className={styles.loading}>
      <div className={styles.loadingSpinner}></div>
      <span>Carregando tipos de dano…</span>
    </div>
  );
}
