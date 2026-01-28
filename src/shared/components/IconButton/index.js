import React from 'react';
import PropTypes from 'prop-types';
import styles from './IconButton.module.css';

export default function IconButton({
  icon,
  onClick,
  backgroundColor,
  iconColor,
  hoverColor,
  title,
  className,
  ...rest
}) {
  const style = {
    backgroundColor,
    color: iconColor,
    '--hover-bg': hoverColor || backgroundColor
  };

  return (
    <button
      type="button"
      className={`${styles.button} ${className}`}
      style={style}
      onClick={onClick}
      title={title}
      {...rest}
    >
      {icon}
    </button>
  );
}

IconButton.propTypes = {
  icon:            PropTypes.element.isRequired,
  onClick:         PropTypes.func,
  backgroundColor: PropTypes.string,
  iconColor:       PropTypes.string,
  hoverColor:      PropTypes.string,
  title:           PropTypes.string,
  className:       PropTypes.string
};

IconButton.defaultProps = {
  onClick:         () => {},
  backgroundColor: 'transparent',
  iconColor:       'var(--light)',
  hoverColor:      'rgba(255,255,255,0.1)',
  title:           '',
  className:       ''
};
