import React from 'react';
import PropTypes from 'prop-types';
import { renderIcon } from '../IconRenderer';
import styles from './Button.module.css';

export default function Button({
  backgroundColor,
  textColor,
  hoverColor,
  icon,
  children,
  onClick,
  className,
  ...rest
}) {
  const style = {
    backgroundColor,
    color: textColor,
    '--hover-bg': hoverColor || backgroundColor,
  };

  return (
    <button
      className={`${styles.button} ${className}`}
      style={style}
      onClick={onClick}
      {...rest}
    >
      {icon && <span className={styles.icon}>{renderIcon(icon, { className: styles.iconGlyph })}</span>}
      <span className={styles.text}>{children}</span>
    </button>
  );
}

Button.propTypes = {
  backgroundColor: PropTypes.string,
  textColor: PropTypes.string,
  hoverColor: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

Button.defaultProps = {
  backgroundColor: 'var(--blue-2)',
  textColor: '#fff',
  hoverColor: null,
  icon: null,
  onClick: () => {},
  className: '',
};
