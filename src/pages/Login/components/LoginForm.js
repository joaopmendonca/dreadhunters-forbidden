// src/pages/Login/components/LoginForm.js

import React from 'react';
import { LOGIN_PLACEHOLDERS, LOGIN_LABELS } from '../constants';
import styles from '../styles/Login.module.css';

export default function LoginForm({
  loginField,
  setLoginField,
  password,
  setPassword,
  loading,
  handleSubmit,
  handleKeyDown,
}) {
  return (
    <div className={styles.form}>
      <label className={styles.label}>
        {LOGIN_LABELS.LOGIN}
        <input
          type="text"
          value={loginField}
          onChange={e => setLoginField(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={LOGIN_PLACEHOLDERS.LOGIN_FIELD}
          className={styles.input}
          disabled={loading}
          required
        />
      </label>

      <label className={styles.label}>
        {LOGIN_LABELS.PASSWORD}
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={LOGIN_PLACEHOLDERS.PASSWORD}
          className={styles.input}
          disabled={loading}
          required
        />
      </label>

      <button
        type="button"
        className={styles.primaryButton}
        onClick={handleSubmit}
        disabled={loading}
      >
        {LOGIN_LABELS.SUBMIT}
      </button>
    </div>
  );
}
