import React from 'react';
import { FaPlus, FaDownload, FaFileUpload } from 'react-icons/fa';
import { GiMagicSwirl, GiBoltSpellCast, GiShieldReflect } from 'react-icons/gi';
import Button from '../../../shared/components/Button';
import PageHeader from '../../../shared/components/PageHeader';
import TextInput from '../../../shared/components/TextInput';
import styles from '../styles/Skills.module.css';

export function SkillsHeader({
  onNew,
  onImport,
  onExportCSV,
  onDownloadTemplate,
  searchName,
  onSearchChange,
  totalCount,
  activeCount,
  passiveCount,
  filterType,
  onFilterChange
}) {
  return (
    <PageHeader
      statsCounters={[
        { icon: <GiMagicSwirl />, value: totalCount, label: 'Total' },
        { icon: <GiBoltSpellCast />, value: activeCount, label: 'Ativa', variant: 'counterActive' },
        { icon: <GiShieldReflect />, value: passiveCount, label: 'Passiva', variant: 'counterPassive' }
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
            Nova Skill
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
            className={styles.searchInput}
            placeholder="🔍 Buscar skill…"
            value={searchName}
            onChange={e => onSearchChange(e.target.value)}
          />
        </>
      }
      filterTabs={[
        {
          id: 'all',
          icon: <GiMagicSwirl />,
          label: 'Todas',
          count: totalCount,
          active: filterType === 'all',
          onClick: () => onFilterChange('all')
        },
        {
          id: 'active',
          icon: <GiBoltSpellCast />,
          label: 'Ativa',
          count: activeCount,
          active: filterType === 'active',
          onClick: () => onFilterChange('active'),
          variant: 'filterTabOrange'
        },
        {
          id: 'passive',
          icon: <GiShieldReflect />,
          label: 'Passiva',
          count: passiveCount,
          active: filterType === 'passive',
          onClick: () => onFilterChange('passive'),
          variant: 'filterTabBlue'
        }
      ]}
    />
  );
}
