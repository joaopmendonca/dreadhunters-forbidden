// src/shared/components/Modal/components/Modal.js

import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import ModalOverlay from './ModalOverlay';
import ModalHeader from './ModalHeader';
import ModalBody from './ModalBody';
import ModalFooter from './ModalFooter';
import { preventBodyScroll, handleEscapeKey } from '../utils';
import { MODAL_SIZES } from '../constants';
import styles from '../styles/Modal.module.css';

function Modal({ 
  isOpen, 
  onClose, 
  title, 
  icon,
  children, 
  size = MODAL_SIZES.MEDIUM,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
}) {
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      preventBodyScroll(true);
    }

    return () => {
      preventBodyScroll(false);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!closeOnEscape || !onClose) return;

    const handleKeyDown = (e) => handleEscapeKey(e, handleClose);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeOnEscape, onClose]);

  const handleClose = () => {
    if (!onClose) return;
    
    setClosing(true);
    setTimeout(() => {
      onClose();
      setClosing(false);
    }, 200);
  };

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen && !closing) return null;

  return ReactDOM.createPortal(
    <div 
      className={`${styles.overlay} ${closing ? styles.closing : ''}`}
      onClick={handleOverlayClick}
    >
      <div className={`${styles.modal} ${styles[size]} ${closing ? styles.closing : ''}`}>
        {title && (
          <ModalHeader 
            title={title} 
            icon={icon}
            onClose={showCloseButton ? handleClose : null} 
          />
        )}
        {children}
      </div>
    </div>,
    document.body
  );
}

// Subcomponents
Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

export default Modal;
