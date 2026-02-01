// src/pages/Login/components/LoginCard.js

import React from 'react';
import { FaBook } from 'react-icons/fa';
import gameLogo from '../../../assets/game-logo-label.png';
import { LOGIN_LABELS } from '../constants';
import LoginForm from './LoginForm';
import styles from '../styles/Login.module.css';

export default function LoginCard({ formProps }) {
  return (
    <div className={styles.grimoire}>
      {/* Lombada do livro */}
      <div className={styles.spine} />

      {/* Capa do card estilo livro */}
      <div className={styles.card}>
        <img src={gameLogo} alt="Game Logo" className={styles.logo} />

        <div className={styles.title}>
          <FaBook className={styles.titleIcon} />
          <span>{LOGIN_LABELS.TITLE}</span>
        </div>

        <div className={styles.divider}>
          <span className={styles.dividerOrnament}>✧</span>
        </div>

        <LoginForm {...formProps} />
      </div>
    </div>
  );
}
