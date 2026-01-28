import React from 'react';
import PropTypes from 'prop-types';
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
    color: textColor,           // <-- aqui é onde aplicamos textColor
    '--hover-bg': hoverColor || backgroundColor,
  };

  return (
    <button
      className={`${styles.button} ${className}`}
      style={style}
      onClick={onClick}
      {...rest}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      <span className={styles.text}>{children}</span>
    </button>
  );
}

Button.propTypes = {
  backgroundColor: PropTypes.string,
  textColor:       PropTypes.string,   // <-- declarada aqui
  hoverColor:      PropTypes.string,
  icon:            PropTypes.element,
  children:        PropTypes.node.isRequired,
  onClick:         PropTypes.func,
  className:       PropTypes.string,
};

Button.defaultProps = {
  backgroundColor: 'var(--blue-2)',
  textColor:       '#fff',            // <-- valor padrão
  hoverColor:      null,
  icon:            null,
  onClick:         () => {},
  className:       '',
};
