// src/pages/Characters/components/LoadingState.js

import React from 'react';
import styles from '../styles/Characters.module.css';

export default function LoadingState() {
  return (
    <div className={styles.loading}>
      <div className={styles.loadingSpinner}></div>
      <span>Carregando NPCs…</span>
    </div>
  );
}
