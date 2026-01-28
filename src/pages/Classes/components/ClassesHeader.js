// src/pages/Classes/components/ClassesHeader.js

import React from 'react';
import { FaDownload, FaFileUpload, FaPlus } from 'react-icons/fa';
import PageHeader from '../../../shared/components/PageHeader';
import Button from '../../../shared/components/Button';
import TextInput from '../../../shared/components/TextInput';
import styles from '../styles/Classes.module.css';

export default function ClassesHeader({
  classesCount,
  onNew,
  onImport,
  onExport,
  onDownloadTemplate,
  searchName,
  onSearchChange,
  uploading,
  fileInputRef,
}) {
  return (
    <PageHeader
      statsCounters={[
        { icon: '⚔️', value: classesCount, label: 'Classes' }
      ]}
      controls={
        <>
          <Button
            backgroundColor="var(--maroon)"
            textColor="var(--light)"
            hoverColor="var(--gold)"
            onClick={onNew}
            icon={<FaPlus />}
          >
            Nova Classe
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={onImport}
            style={{ display: 'none' }}
          />

          <Button
            backgroundColor="var(--dark-3)"
            textColor="var(--light)"
            hoverColor="var(--gold)"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            icon={<FaFileUpload />}
          >
            {uploading ? 'Importando...' : 'Importar CSV'}
          </Button>

          <Button
            backgroundColor="var(--dark-3)"
            textColor="var(--light)"
            hoverColor="var(--gold)"
            onClick={onExport}
            icon={<FaDownload />}
          >
            Exportar CSV
          </Button>

          <Button
            backgroundColor="var(--dark-4)"
            textColor="var(--light-1)"
            hoverColor="var(--gold)"
            onClick={onDownloadTemplate}
            icon={<FaDownload />}
          >
            Template
          </Button>

          <TextInput
            value={searchName}
            onChange={onSearchChange}
            placeholder="🔍 Buscar por nome…"
            className={styles.searchInput}
          />
        </>
      }
    />
  );
}
