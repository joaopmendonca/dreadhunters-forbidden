import React from 'react';
import styles from '../styles/LoadingState.module.css';

export const LoadingState = () => (
  <div className={styles.loading}>
    <div className={styles.loadingSpinner}></div>
    <span>Carregando servidores…</span>
  </div>
);
