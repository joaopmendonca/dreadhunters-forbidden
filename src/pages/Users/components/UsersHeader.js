// src/pages/Users/components/UsersHeader.js

import React from 'react';
import { FaBan, FaCheck, FaClock, FaDownload, FaUpload, FaFileAlt, FaUsers } from 'react-icons/fa';
import PageHeader from '../../../shared/components/PageHeader';
import Button from '../../../shared/components/Button';
import TextInput from '../../../shared/components/TextInput';
import { FILTER_TABS_CONFIG } from '../constants';
import styles from '../styles/Users.module.css';

export default function UsersHeader({
  totalCount,
  activeCount,
  bannedCount,
  pendingCount,
  searchName,
  filterStatus,
  onSearchChange,
  onFilterChange,
  onExportCSV,
  onDownloadTemplate,
  onOpenImport,
}) {
  const filterTabs = FILTER_TABS_CONFIG.map(tab => {
    let count, icon;
    
    switch (tab.id) {
      case 'all':
        count = totalCount;
        icon = <FaUsers />;
        break;
      case 'active':
        count = activeCount;
        icon = <FaCheck />;
        break;
      case 'banned':
        count = bannedCount;
        icon = <FaBan />;
        break;
      case 'pending':
        count = pendingCount;
        icon = <FaClock />;
        break;
      default:
        count = 0;
        icon = null;
    }

    return {
      ...tab,
      icon,
      count,
      active: filterStatus === tab.id,
      onClick: () => onFilterChange(tab.id),
    };
  });

  return (
    <PageHeader
      statsCounters={[
        { icon: <FaUsers />, value: totalCount, label: 'Total' },
        { icon: <FaCheck />, value: activeCount, label: 'Ativos', variant: 'counterActive' },
        { icon: <FaBan />, value: bannedCount, label: 'Banidos', variant: 'counterBanned' }
      ]}
      controls={
        <>
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
            backgroundColor="var(--dark-3)" 
            textColor="var(--light)" 
            hoverColor="var(--gold)" 
            onClick={onOpenImport} 
            icon={<FaUpload />}
          >
            Importar CSV
          </Button>

          <Button 
            backgroundColor="var(--dark-4)" 
            textColor="var(--light-1)" 
            hoverColor="var(--gold)" 
            onClick={onDownloadTemplate} 
            icon={<FaFileAlt />}
          >
            Template
          </Button>

          <TextInput
            className={styles.searchInput}
            placeholder="🔍 Buscar usuário…"
            value={searchName}
            onChange={e => onSearchChange(e.target.value)}
          />
        </>
      }
      filterTabs={filterTabs}
    />
  );
}
