import React from 'react';
import { FaPlus, FaDownload, FaFileUpload } from 'react-icons/fa';
import Button from '../../../shared/components/Button';
import TextInput from '../../../shared/components/TextInput';
import styles from '../styles/Skills.module.css';

export function SkillsHeader({
  onNew,
  onCSVUpload,
  onExportCSV,
  onDownloadTemplate,
  searchName,
  onSearchChange,
  uploading,
  fileInputRef,
  skillsCount
}) {
  return (
    <div className={styles.pageHeader}>
      <div className={styles.statsCounter}>
        <div className={styles.counterItem}>
          <span>✨</span>
          <div>
            <strong>{skillsCount}</strong>
            <small>Skills</small>
          </div>
        </div>
      </div>

      <div className={styles.controls}>
        <Button
          backgroundColor="var(--maroon)"
          textColor="var(--light)"
          hoverColor="var(--gold)"
          onClick={onNew}
          icon={<FaPlus />}
        >
          Nova Skill
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={onCSVUpload}
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
          onClick={onExportCSV}
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
          onChange={e => onSearchChange(e.target.value)}
          placeholder="🔍 Buscar por nome…"
          className={styles.searchInput}
        />
      </div>
    </div>
  );
}
