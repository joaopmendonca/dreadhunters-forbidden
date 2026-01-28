import React from 'react';
import styles from '../styles/SettingsHint.module.css';

export const SettingsHint = ({ message }) => {
  return (
    <div className={styles.hint}>
      <span className={styles.icon}>⚙️</span>
      <span className={styles.text}>{message}</span>
    </div>
  );
};
