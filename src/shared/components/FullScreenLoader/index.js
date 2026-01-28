// src/shared/components/FullScreenLoader/index.js
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { PulseLoader } from 'react-spinners';
import styles from './FullScreenLoader.module.css';

export default function FullScreenLoader({ visible, message }) {
  useEffect(() => {
    const body = document.body;
    const html = document.documentElement;
    const prevBodyOverflow = body.style.overflow;
    const prevHtmlOverflow = html.style.overflowY;

    if (visible) {
      body.style.overflow = 'hidden';
      html.style.overflowY = 'scroll';
    } else {
      body.style.overflow = prevBodyOverflow;
      html.style.overflowY = prevHtmlOverflow;
    }

    return () => {
      body.style.overflow = prevBodyOverflow;
      html.style.overflowY = prevHtmlOverflow;
    };
  }, [visible]);

  if (!visible) return null;

  return ReactDOM.createPortal(
    <div className={styles.overlay}>
      <div className={styles.content}>
        <PulseLoader color="#1E90FF" loading={true} size={15} margin={8} />
        <p className={styles.message}>{message}</p>
      </div>
    </div>,
    document.body
  );
}

FullScreenLoader.propTypes = {
  visible: PropTypes.bool,
  message: PropTypes.string,
};

FullScreenLoader.defaultProps = {
  visible: false,
  message: 'Carregando…',
};
