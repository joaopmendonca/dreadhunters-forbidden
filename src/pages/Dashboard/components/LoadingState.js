// src/pages/Dashboard/components/LoadingState.js

import React from 'react';
import styles from '../styles/Dashboard.module.css';

export default function LoadingState() {
  return (
    <div className={styles.loading}>
      <div className={styles.loadingSpinner}></div>
      <span>Carregando dashboard...</span>
    </div>
  );
}
