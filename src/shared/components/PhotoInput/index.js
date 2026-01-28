import PropTypes from 'prop-types';
import React from 'react';
import FileInput from '../FileInput';
import IconButton from '../IconButton';
import styles from './PhotoInput.module.css';

export default function PhotoInput({
  file,
  previewUrl,
  onFileChange,
  onRemove,
  accept,
  disabled,
  placeholderLabel
}) {
  const [broken, setBroken] = React.useState(false);

  React.useEffect(() => {
    setBroken(false);
  }, [previewUrl, file]);
  return (
    <div className={styles.wrapper}>
      {!previewUrl ? (
        <FileInput
          fileName={file?.name}
          onChange={onFileChange}
          accept={accept}
          disabled={disabled}
          buttonLabel={placeholderLabel}
        />
      ) : (
        <div className={styles.previewWrapper}>
          {!broken ? (
            <img
              src={previewUrl}
              alt="Preview"
              className={styles.preview}
              onError={() => setBroken(true)}
            />
          ) : (
            <div className={styles.brokenPlaceholder} />
          )}
          <IconButton
            icon={<span>&times;</span>}
            onClick={onRemove}
            hoverColor="var(--accent-red)"
            disabled={disabled}
            className={styles.removeBtn}
            title="Remover foto"
          />
        </div>
      )}
    </div>
  );
}

PhotoInput.propTypes = {
  file:             PropTypes.instanceOf(File),
  previewUrl:       PropTypes.string,
  onFileChange:     PropTypes.func.isRequired,
  onRemove:         PropTypes.func.isRequired,
  accept:           PropTypes.string,
  disabled:         PropTypes.bool,
  placeholderLabel: PropTypes.string
};

PhotoInput.defaultProps = {
  file:             null,
  previewUrl:       '',
  accept:           'image/*',
  disabled:         false,
  placeholderLabel: 'Escolher foto'
};
