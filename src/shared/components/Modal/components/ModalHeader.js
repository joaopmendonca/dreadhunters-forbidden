// src/shared/components/Modal/components/ModalHeader.js

import React from 'react';
import { FaTimes } from 'react-icons/fa';
import styles from '../styles/Modal.module.css';

export default function ModalHeader({ title, icon, onClose }) {
  return (
    <div className={styles.header}>
      <h2 className={styles.title}>
        {icon && <span>{icon}</span>}
        {title}
      </h2>
      {onClose && (
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Fechar modal"
        >
          <FaTimes />
        </button>
      )}
    </div>
  );
}
