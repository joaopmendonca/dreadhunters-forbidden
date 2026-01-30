// ============================================================================
// UploadStep - Etapa de Upload
// ============================================================================

import React, { useRef } from 'react';
import { useDragDrop } from '../hooks/useDragDrop';
import styles from '../styles/GenericCSVImport.module.css';

export function UploadStep({ onFileSelect, error, downloadTemplate }) {
  const fileInputRef = useRef(null);
  const { isDragging, handleDragEnter, handleDragLeave, handleDragOver, handleDrop } = useDragDrop(onFileSelect);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div 
      className={`${styles.uploadZone} ${isDragging ? styles.dragging : ''}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        accept=".csv"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      
      <div className={styles.uploadIcon}>
        {isDragging ? '📥' : '📁'}
      </div>
      
      <h3>{isDragging ? 'Solte o arquivo aqui' : 'Arraste um arquivo CSV'}</h3>
      <p>ou clique no botão abaixo para selecionar</p>
      
      <button 
        className={styles.btnPrimary}
        onClick={() => fileInputRef.current?.click()}
      >
        Selecionar Arquivo
      </button>
      
      <div className={styles.templateDownload}>
        <span>Não tem um arquivo? </span>
        <button className={styles.btnLink} onClick={downloadTemplate}>
          📄 Baixar modelo CSV
        </button>
      </div>
      
      {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  );
}

export default UploadStep;
