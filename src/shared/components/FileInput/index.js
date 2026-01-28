import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import styles from './FileInput.module.css';

export default function FileInput({
  fileName,
  onChange,
  accept,
  disabled,
  className,
  buttonLabel
}) {
  const inputRef = useRef();

  return (
    <div className={`${styles.wrapper} ${className || ''}`}>
      <button
        type="button"
        className={styles.button}
        onClick={() => inputRef.current.click()}
        disabled={disabled}
      >
        {buttonLabel}
      </button>
      <span className={styles.fileName}>
        {fileName || 'Nenhum arquivo escolhido'}
      </span>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={onChange}
        disabled={disabled}
        className={styles.input}
      />
    </div>
  );
}

FileInput.propTypes = {
  fileName:    PropTypes.string,
  onChange:    PropTypes.func.isRequired,
  accept:      PropTypes.string,
  disabled:    PropTypes.bool,
  className:   PropTypes.string,
  buttonLabel: PropTypes.string
};

FileInput.defaultProps = {
  fileName:    '',
  accept:      '',
  disabled:    false,
  className:   '',
  buttonLabel: 'Escolher arquivo'
};
