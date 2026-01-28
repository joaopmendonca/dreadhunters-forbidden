// src/pages/Characters/components/CharactersHeader.js

import React from 'react';
import { FaDownload, FaFileUpload, FaPlus, FaUsers } from 'react-icons/fa';
import PageHeader from '../../../shared/components/PageHeader';
import Button from '../../../shared/components/Button';
import TextInput from '../../../shared/components/TextInput';
import styles from '../styles/Characters.module.css';

export default function CharactersHeader({
  totalCount,
  classes,
  characters,
  searchName,
  filterClass,
  uploading,
  fileInputRef,
  onNew,
  onSearch,
  onFilterChange,
  onCSVUpload,
  onExportCSV,
  onDownloadTemplate,
}) {
  const filterTabs = [
    { 
      id: 'all', 
      icon: <FaUsers />, 
      label: 'Todos', 
      count: totalCount, 
      active: filterClass === '', 
      onClick: () => onFilterChange('')
    },
    ...classes.map(cls => ({
      id: cls._id,
      icon: '⚔️',
      label: cls.name,
      count: characters.filter(ch => ch.class === cls._id).length,
      active: filterClass === cls._id,
      onClick: () => onFilterChange(cls._id)
    }))
  ];

  return (
    <PageHeader
      statsCounters={[
        { icon: <FaUsers />, value: totalCount, label: 'Total' },
        ...classes.slice(0, 4).map(cls => ({
          icon: '⚔️',
          value: characters.filter(ch => ch.class === cls._id).length,
          label: cls.name
        }))
      ]}
      controls={
        <>
          <Button
            backgroundColor="var(--maroon)"
            textColor="var(--light)"
            hoverColor="var(--gold)"
            icon={<FaPlus />}
            onClick={onNew}
          >
            Novo NPC
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
            onChange={(e) => onSearch(e.target.value)}
            placeholder="🔍 Buscar NPC…"
            className={styles.searchInput}
          />
        </>
      }
      filterTabs={filterTabs}
    />
  );
}
