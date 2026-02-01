// src/pages/Login/components/LoginPage.js

import React from 'react';
import FullScreenLoader from '../../../shared/components/FullScreenLoader';
import LoginCard from './LoginCard';
import { useLogin } from '../hooks/useLogin';
import { LOGIN_MESSAGES } from '../constants';
import styles from '../styles/Login.module.css';

export default function LoginPage() {
  const {
    loginField,
    setLoginField,
    password,
    setPassword,
    loading,
    handleSubmit,
    handleKeyDown,
  } = useLogin();

  const formProps = {
    loginField,
    setLoginField,
    password,
    setPassword,
    loading,
    handleSubmit,
    handleKeyDown,
  };

  return (
    <>
      <FullScreenLoader visible={loading} message={LOGIN_MESSAGES.AUTHENTICATING} />

      <div className={styles.container}>
        <div className={styles.content}>
          <LoginCard formProps={formProps} />
        </div>
      </div>
    </>
  );
}