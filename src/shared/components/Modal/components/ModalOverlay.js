// src/shared/components/Modal/components/ModalOverlay.js

import React from 'react';
import styles from '../styles/Modal.module.css';

export default function ModalOverlay({ onClick, closing }) {
  return (
    <div 
      className={`${styles.overlay} ${closing ? styles.closing : ''}`}
      onClick={onClick}
    />
  );
}
