// src/components/BaseLayout/index.jsx

import React from 'react';
import styles from './BaseLayout.module.css';

export default function BaseLayout({ title, children }) {
  return (
    <div className={styles.wrapper}>
      {title && <h1 className={styles.pageTitle}>{title}</h1>}
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
}
