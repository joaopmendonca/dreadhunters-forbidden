// src/shared/components/Modal/components/ModalFooter.js

import React from 'react';
import styles from '../styles/Modal.module.css';

export default function ModalFooter({ children, alignment = 'end' }) {
  const alignmentClass = 
    alignment === 'center' ? styles.centered :
    alignment === 'between' ? styles.spaceBetween :
    '';

  return (
    <div className={`${styles.footer} ${alignmentClass}`}>
      {children}
    </div>
  );
}
