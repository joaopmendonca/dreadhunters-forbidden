// src/pages/Classes/components/LoadingState.js

import React from 'react';
import styles from '../styles/Classes.module.css';

export default function LoadingState() {
  return (
    <div className={styles.loading}>
      <div className={styles.loadingSpinner}></div>
      <span>Carregando classes…</span>
    </div>
  );
}
