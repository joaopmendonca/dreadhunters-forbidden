import React from 'react';
import { FaPlus, FaDownload, FaFileUpload, FaCube, FaCalculator } from 'react-icons/fa';
import Button from '../../../shared/components/Button';
import TextInput from '../../../shared/components/TextInput';
import PageHeader from '../../../shared/components/PageHeader';
import styles from '../styles/Attributes.module.css';

export function AttributesHeader({
  onNew,
  onImport,
  onCSVUpload,
  onExportCSV,
  onDownloadTemplate,
  searchName,
  onSearchChange,
  uploading,
  fileInputRef,
  totalCount,
  baseCount,
  derivedCount,
  filterType,
  setFilterType,
  page,
  setPage
}) {
  return (
    <PageHeader
      statsCounters={[
        { icon: '📊', value: totalCount, label: 'Total' },
        { icon: '🎲', value: baseCount, label: 'Base', variant: 'counterBlue' },
        { icon: '🧮', value: derivedCount, label: 'Derivado', variant: 'counterPurple' }
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
            Novo Atributo
          </Button>

          <Button
            backgroundColor="var(--dark-3)"
            textColor="var(--light)"
            hoverColor="var(--gold)"
            onClick={onImport}
            icon={<FaFileUpload />}
          >
            Importar CSV
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

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={onCSVUpload}
            style={{ display: 'none' }}
          />

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
            onChange={e => {
              onSearchChange(e.target.value);
              setPage(0);
            }}
            placeholder="🔍 Buscar por nome…"
            className={styles.searchInput}
          />
        </>
      }
      filterTabs={[
        { 
          id: 'all', 
          label: 'Todos', 
          count: totalCount, 
          active: filterType === 'all', 
          onClick: () => { 
            setFilterType('all'); 
            setPage(0); 
          } 
        },
        { 
          id: 'base', 
          icon: <FaCube />, 
          label: 'Base', 
          count: baseCount, 
          active: filterType === 'base', 
          onClick: () => { 
            setFilterType('base'); 
            setPage(0); 
          },
          variant: 'filterTabBlue'
        },
        { 
          id: 'derivado', 
          icon: <FaCalculator />, 
          label: 'Derivado', 
          count: derivedCount, 
          active: filterType === 'derivado', 
          onClick: () => { 
            setFilterType('derivado'); 
            setPage(0); 
          },
          variant: 'filterTabPurple'
        }
      ]}
    />
  );
}
