import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styles from './Tooltip.module.css';

/**
 * Tooltip Component
 * @param {React.ReactNode} children - O elemento que dispara o tooltip
 * @param {React.ReactNode} content - O conteúdo do tooltip
 * @param {string} position - Posição do tooltip: 'top', 'bottom', 'left', 'right'
 * @param {number} delay - Delay em ms antes de mostrar o tooltip
 */
export default function Tooltip({ 
  children, 
  content, 
  position = 'top', 
  delay = 200,
  maxWidth = 280
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);
  const timeoutRef = useRef(null);

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      
      let top = 0;
      let left = 0;

      switch (position) {
        case 'top':
          top = triggerRect.top - tooltipRect.height - 8;
          left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
          break;
        case 'bottom':
          top = triggerRect.bottom + 8;
          left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
          break;
        case 'left':
          top = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
          left = triggerRect.left - tooltipRect.width - 8;
          break;
        case 'right':
          top = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
          left = triggerRect.right + 8;
          break;
        default:
          break;
      }

      // Prevent tooltip from going off-screen
      const padding = 10;
      if (left < padding) left = padding;
      if (left + tooltipRect.width > window.innerWidth - padding) {
        left = window.innerWidth - tooltipRect.width - padding;
      }
      if (top < padding) top = padding;
      if (top + tooltipRect.height > window.innerHeight - padding) {
        top = window.innerHeight - tooltipRect.height - padding;
      }

      setCoords({ top, left });
    }
  }, [isVisible, position]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (!content) {
    return children;
  }

  const tooltipElement = isVisible && (
    <div
      ref={tooltipRef}
      className={`${styles.tooltip} ${styles[position]}`}
      style={{ 
        top: coords.top, 
        left: coords.left,
        maxWidth: maxWidth
      }}
    >
      {content}
    </div>
  );

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        className={styles.trigger}
      >
        {children}
      </span>
      {ReactDOM.createPortal(tooltipElement, document.body)}
    </>
  );
}
