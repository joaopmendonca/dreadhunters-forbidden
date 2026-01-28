// src/pages/Login/components/LoginCard.js

import React from 'react';
import { FaLock } from 'react-icons/fa';
import gameLogo from '../../../assets/game-logo-label.png';
import { LOGIN_LABELS } from '../constants';
import LoginForm from './LoginForm';
import styles from '../styles/Login.module.css';

export default function LoginCard({ formProps }) {
  return (
    <div className={styles.card}>
      <img src={gameLogo} alt="Game Logo" className={styles.logo} />

      <div className={styles.title}>
        <FaLock className={styles.lockIcon} />
        {LOGIN_LABELS.TITLE}
      </div>

      <LoginForm {...formProps} />
    </div>
  );
}
