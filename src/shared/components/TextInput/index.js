import React from 'react';
import PropTypes from 'prop-types';
import styles from './TextInput.module.css';

export default function TextInput({
  value,
  onChange,
  placeholder,
  type,
  className,
  ...rest
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`${styles.input} ${className || ''}`}
      {...rest}
    />
  );
}

TextInput.propTypes = {
  value:      PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange:   PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  type:       PropTypes.string,
  className:  PropTypes.string,
};

TextInput.defaultProps = {
  placeholder: '',
  type:        'text',
  className:   '',
};
