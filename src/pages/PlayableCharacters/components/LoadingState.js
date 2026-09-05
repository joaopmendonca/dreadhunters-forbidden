import React from 'react';
import styles from '../styles/PlayableCharacters.module.css';

export default function LoadingState() {
  return (
    <div className={styles.loading}>
      <div className={styles.loadingSpinner} />
      <span>Carregando personagens jogáveis…</span>
    </div>
  );
}
