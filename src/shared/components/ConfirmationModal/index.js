import React from 'react';
import { FaTimes } from 'react-icons/fa';
import styles from './ConfirmationModal.module.css';

export default function ConfirmationModal({
  isOpen,
  onClose,
  icon: Icon,             // componente de ícone (ex: FaExclamationTriangle)
  iconColor = '#fff',     // cor do ícone
  message,                // texto ou nó React
  buttons = [],           // array de { text, onClick, buttonColor, textColor, disabled }
}) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.close} onClick={onClose}>
          <FaTimes />
        </button>

        <div className={styles.content}>
          {Icon && (
            <div className={styles.iconWrapper}>
              <Icon style={{ color: iconColor, fontSize: '2.5rem' }} />
            </div>
          )}

          <div className={styles.message}>
            {message}
          </div>

          <div className={styles.buttons}>
            {buttons.map((btn, idx) => (
              <button
                key={idx}
                onClick={btn.onClick}
                disabled={btn.disabled}
                className={styles.button}
                style={{
                  background: btn.buttonColor,
                  color: btn.textColor,
                }}
              >
                {btn.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
