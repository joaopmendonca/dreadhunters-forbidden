// src/shared/components/Modal/components/ModalBody.js

import React from 'react';
import styles from '../styles/Modal.module.css';
import { COLUMN_LAYOUTS } from '../constants';

export default function ModalBody({ children, columns = COLUMN_LAYOUTS.SINGLE }) {
  return (
    <div className={styles.body}>
      <div className={`${styles.bodyContent} ${columns === COLUMN_LAYOUTS.DOUBLE ? styles.doubleColumn : ''}`}>
        {children}
      </div>
    </div>
  );
}
