// src/pages/Users/components/LoadingState.js

import React from 'react';
import styles from '../styles/Users.module.css';

export default function LoadingState() {
  return (
    <div className={styles.loading}>
      <div className={styles.loadingSpinner}></div>
      <span>Carregando usuários…</span>
    </div>
  );
}
