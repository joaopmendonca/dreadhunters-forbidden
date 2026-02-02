import React from 'react';
import styles from '../styles/Quests.module.css';

export default function LoadingState() {
  return (
    <div className={styles.loading}>
      <div className={styles.loadingSpinner}></div>
      <span>Carregando quests…</span>
    </div>
  );
}
