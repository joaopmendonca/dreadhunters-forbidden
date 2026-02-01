import { FaDownload, FaPlus, FaFileUpload } from 'react-icons/fa';
import { GiShield } from 'react-icons/gi';
import Button from '../../../shared/components/Button';
import PageHeader from '../../../shared/components/PageHeader';
import TextInput from '../../../shared/components/TextInput';
import styles from '../styles/Roles.module.css';

export default function RolesHeader({
  totalCount,
  searchName,
  onSearchChange,
  onNew,
  onImport,
  onExportCSV,
  onDownloadTemplate,
  filterStatus,
  onFilterChange
}) {
  const filterTabs = [
    { value: 'all', label: 'Todas', icon: <GiShield />, variant: 'default' }
  ];

  return (
    <PageHeader
      statsCounters={[
        { icon: '🛡️', value: totalCount, label: 'Roles' }
      ]}
      filterTabs={filterTabs}
      currentFilter={filterStatus}
      onFilterChange={onFilterChange}
      controls={
        <>
          <Button
            backgroundColor="var(--maroon)"
            textColor="var(--light)"
            hoverColor="var(--gold)"
            onClick={onNew}
            icon={<FaPlus />}
          >
            Nova Role
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
            placeholder="🔍 Buscar por nome…"
            value={searchName}
            onChange={e => onSearchChange(e.target.value)}
          />
        </>
      }
    />
  );
}

