import React from 'react';
import styles from '../styles/Roles.module.css';

export default function LoadingState() {
  return (
    <div className={styles.loading}>
      <div className={styles.loadingSpinner}></div>
      <span>Carregando roles…</span>
    </div>
  );
}
