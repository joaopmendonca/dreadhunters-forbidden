// src/pages/Classes/components/ClassesHeader.js

import React from 'react';
import { FaDownload, FaFileUpload, FaPlus } from 'react-icons/fa';
import { GiSwordman, GiShield, GiCrossedSwords, GiSpellBook } from 'react-icons/gi';
import PageHeader from '../../../shared/components/PageHeader';
import Button from '../../../shared/components/Button';
import TextInput from '../../../shared/components/TextInput';
import styles from '../styles/Classes.module.css';

const ROLE_ICONS = {
  'tank': <GiShield />,
  'dps': <GiCrossedSwords />,
  'support': <GiSpellBook />,
  'default': <GiSwordman />
};

export default function ClassesHeader({
  totalCount,
  rolesList,
  roleCounters,
  filterRole,
  onFilterChange,
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
        { icon: '⚔️', value: totalCount, label: 'Total' }
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
      filterTabs={[
        {
          id: 'all',
          icon: <GiSwordman />,
          label: 'Todas',
          count: totalCount,
          active: filterRole === 'all',
          onClick: () => onFilterChange('all')
        },
        ...rolesList.map((role, index) => ({
          id: role._id,
          icon: ROLE_ICONS[role.nome?.toLowerCase()] || ROLE_ICONS.default,
          label: role.nome,
          count: roleCounters[role._id] || 0,
          active: filterRole === role._id,
          onClick: () => onFilterChange(role._id),
          variant: ['filterTabOrange', 'filterTabBlue', 'filterTabPurple', 'filterTabRed'][index % 4]
        }))
      ]}
    />
  );
}
