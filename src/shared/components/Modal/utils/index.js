// src/shared/components/Modal/utils/index.js

export const preventBodyScroll = (prevent = true) => {
  if (prevent) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
};

export const handleEscapeKey = (e, onClose) => {
  if (e.key === 'Escape' && onClose) {
    onClose();
  }
};
