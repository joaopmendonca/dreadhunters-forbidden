import PropTypes from 'prop-types';
import React from 'react';
import FileInput from '../FileInput';
import IconButton from '../IconButton';
import { useImageLightbox } from '../ImageLightbox';
import styles from './PhotoInput.module.css';

export default function PhotoInput({
  file,
  previewUrl,
  onFileChange,
  onRemove,
  accept,
  disabled,
  placeholderLabel,
  contain
}) {
  const [broken, setBroken] = React.useState(false);
  const { open: openLightbox } = useImageLightbox();

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
        <div className={`${styles.previewWrapper} ${contain ? styles.containPreview : ''}`}>
          {!broken ? (
            <img
              src={previewUrl}
              alt="Preview"
              className={`${styles.preview} ${contain ? styles.contain : ''}`}
              onError={() => setBroken(true)}
              onClick={() => openLightbox(previewUrl, placeholderLabel || 'Preview')}
              title="Ver em tela cheia"
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
  placeholderLabel: PropTypes.string,
  contain:          PropTypes.bool
};

PhotoInput.defaultProps = {
  file:             null,
  previewUrl:       '',
  accept:           'image/*',
  disabled:         false,
  placeholderLabel: 'Escolher foto',
  contain: false
};
