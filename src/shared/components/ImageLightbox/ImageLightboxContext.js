// src/shared/components/ImageLightbox/ImageLightboxContext.js

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import ReactDOM from 'react-dom';
import styles from './ImageLightbox.module.css';

const ImageLightboxContext = createContext(null);

/**
 * Comportamento único para todos os modais do Forbidden: qualquer imagem
 * (PNG, JPEG, etc.) pode ser aberta em tela cheia com overlay escuro.
 * Fecha ao clicar no fundo, no botão ou pressionando ESC.
 */
export function ImageLightboxProvider({ children }) {
  const [current, setCurrent] = useState(null); // { src, alt }

  const open = useCallback((src, alt = '') => {
    if (!src) return;
    setCurrent({ src, alt });
  }, []);

  const close = useCallback(() => setCurrent(null), []);

  useEffect(() => {
    if (!current) return;

    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        close();
      }
    };
    // captura para fechar o lightbox antes de qualquer modal reagir ao ESC
    document.addEventListener('keydown', handleEsc, true);
    return () => document.removeEventListener('keydown', handleEsc, true);
  }, [current, close]);

  const value = useMemo(() => ({ open, close }), [open, close]);

  return (
    <ImageLightboxContext.Provider value={value}>
      {children}
      {current &&
        ReactDOM.createPortal(
          <div
            className={styles.overlay}
            onClick={close}
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              className={styles.closeButton}
              onClick={close}
              aria-label="Fechar"
            >
              &times;
            </button>
            <img
              src={current.src}
              alt={current.alt}
              className={styles.image}
              onClick={(e) => e.stopPropagation()}
            />
          </div>,
          document.body
        )}
    </ImageLightboxContext.Provider>
  );
}

export function useImageLightbox() {
  const ctx = useContext(ImageLightboxContext);
  if (!ctx) {
    // fallback seguro caso algum componente seja usado fora do provider
    return { open: () => {}, close: () => {} };
  }
  return ctx;
}
