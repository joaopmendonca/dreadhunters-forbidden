import React from 'react';
import { FaDownload, FaFileAlt, FaUpload } from 'react-icons/fa';
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
  const filterTabs = FILTER_TABS_CONFIG.map((tab) => {
    let count = 0;
    let icon = 'empty';

    switch (tab.id) {
      case 'all':
        count = totalCount;
        icon = 'users';
        break;
      case 'active':
        count = activeCount;
        icon = 'check';
        break;
      case 'banned':
        count = bannedCount;
        icon = 'ban';
        break;
      case 'pending':
        count = pendingCount;
        icon = 'hourglass';
        break;
      default:
        break;
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
        { icon: 'users', value: totalCount, label: 'Total' },
        { icon: 'check', value: activeCount, label: 'Ativos', variant: 'counterGreen' },
        { icon: 'ban', value: bannedCount, label: 'Banidos', variant: 'counterRed' },
      ]}
      controls={
        <>
          <Button
            backgroundColor="rgba(13, 17, 16, 0.96)"
            textColor="var(--light)"
            hoverColor="rgba(212, 175, 55, 0.16)"
            onClick={onExportCSV}
            icon={<FaDownload />}
          >
            Exportar CSV
          </Button>

          <Button
            backgroundColor="rgba(13, 17, 16, 0.96)"
            textColor="var(--light)"
            hoverColor="rgba(212, 175, 55, 0.16)"
            onClick={onOpenImport}
            icon={<FaUpload />}
          >
            Importar CSV
          </Button>

          <Button
            backgroundColor="rgba(13, 17, 16, 0.96)"
            textColor="var(--light-1)"
            hoverColor="rgba(212, 175, 55, 0.16)"
            onClick={onDownloadTemplate}
            icon={<FaFileAlt />}
          >
            Template
          </Button>

          <TextInput
            className={styles.searchInput}
            placeholder="Buscar usuário..."
            value={searchName}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </>
      }
      filterTabs={filterTabs}
    />
  );
}
