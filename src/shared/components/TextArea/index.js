import React from 'react';
import PropTypes from 'prop-types';
import styles from './TextArea.module.css';

const TextArea = React.forwardRef(({
  value,
  onChange,
  placeholder,
  rows,
  disabled,
  className,
  ...rest
}, ref) => {
  return (
    <textarea
      ref={ref}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      className={`${styles.textarea} ${className || ''}`}
      {...rest}
    />
  );
});

TextArea.displayName = 'TextArea';

TextArea.propTypes = {
  value:       PropTypes.string.isRequired,
  onChange:    PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  rows:        PropTypes.number,
  disabled:    PropTypes.bool,
  className:   PropTypes.string
};

TextArea.defaultProps = {
  placeholder: '',
  rows:        3,
  disabled:    false,
  className:   ''
};

export default TextArea;
