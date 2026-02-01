import React from 'react';
import Modal, { MODAL_SIZES } from '../Modal';
import styles from './ConfirmationModal.module.css';

export default function ConfirmationModal({
  isOpen,
  onClose,
  title = 'Confirmar Ação',
  icon: Icon,
  iconColor = '#e63946',
  message,
  cancelText = 'Cancelar',
  confirmText = 'Confirmar',
  onConfirm,
  isLoading = false,
  confirmDanger = true,
}) {
  if (!isOpen) return null;

  const buttons = [
    {
      text: cancelText,
      onClick: onClose,
      buttonColor: 'var(--dark-4)',
      textColor: 'var(--light)',
      disabled: isLoading
    },
    {
      text: confirmText,
      onClick: onConfirm,
      buttonColor: confirmDanger ? 'var(--accent-red)' : 'var(--blue-2)',
      textColor: 'var(--light)',
      disabled: isLoading
    }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={MODAL_SIZES.SMALL}
      closeOnOverlayClick={false}
    >
      <Modal.Body>
        <div className={styles.content}>
          {Icon && (
            <div className={styles.iconWrapper}>
              <Icon style={{ color: iconColor, fontSize: '2.5rem' }} />
            </div>
          )}

          <div className={styles.message}>
            {message}
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
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
      </Modal.Footer>
    </Modal>
  );
}
