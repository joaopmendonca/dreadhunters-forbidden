import { FaDownload, FaFileUpload, FaPlus } from 'react-icons/fa';
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
  onFilterChange,
}) {
  return (
    <PageHeader
      statsCounters={[
        { icon: 'shield', value: totalCount, label: 'Roles', variant: 'counterGold' },
      ]}
      controls={
        <>
          <Button
            backgroundColor="var(--maroon)"
            textColor="var(--light)"
            hoverColor="rgba(212, 175, 55, 0.18)"
            onClick={onNew}
            icon={<FaPlus />}
          >
            Nova Role
          </Button>

          <Button
            backgroundColor="rgba(13, 17, 16, 0.96)"
            textColor="var(--light)"
            hoverColor="rgba(212, 175, 55, 0.16)"
            onClick={onImport}
            icon={<FaFileUpload />}
          >
            Importar CSV
          </Button>

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
            textColor="var(--light-1)"
            hoverColor="rgba(212, 175, 55, 0.16)"
            onClick={onDownloadTemplate}
            icon={<FaDownload />}
          >
            Template
          </Button>

          <TextInput
            className={styles.searchInput}
            placeholder="Buscar por nome..."
            value={searchName}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </>
      }
      filterTabs={[
        {
          id: 'all',
          label: 'Todas',
          icon: 'shield',
          count: totalCount,
          active: filterStatus === 'all',
          onClick: () => onFilterChange('all'),
        },
      ]}
    />
  );
}
