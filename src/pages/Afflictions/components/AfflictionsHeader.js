import { FaDownload, FaFileUpload, FaPlus } from 'react-icons/fa';
import Button from '../../../shared/components/Button';
import PageHeader from '../../../shared/components/PageHeader';
import TextInput from '../../../shared/components/TextInput';
import styles from '../styles/Afflictions.module.css';

export default function AfflictionsHeader({
  totalCount,
  mentalCount,
  fisicaCount,
  searchName,
  onSearchChange,
  filterTipo,
  onFilterChange,
  onNew,
  onImport,
  onUploadCSV,
  onExportCSV,
  onDownloadTemplate,
  uploading,
  fileInputRef,
}) {
  return (
    <PageHeader
      statsCounters={[
        { icon: 'skull', value: totalCount, label: 'Total', variant: 'counterOrange' },
        { icon: 'brain', value: mentalCount, label: 'Mental', variant: 'counterPurple' },
        { icon: 'brokenHeart', value: fisicaCount, label: 'Física', variant: 'counterRed' },
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
            Nova Aflição
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

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={onUploadCSV}
            style={{ display: 'none' }}
          />

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
            disabled={uploading}
          >
            Template
          </Button>

          <TextInput
            className={styles.searchInput}
            placeholder="Buscar aflição..."
            value={searchName}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </>
      }
      filterTabs={[
        {
          id: 'all',
          icon: 'skull',
          label: 'Todas',
          count: totalCount,
          active: filterTipo === 'all',
          onClick: () => onFilterChange('all'),
        },
        {
          id: 'mental',
          icon: 'brain',
          label: 'Mental',
          count: mentalCount,
          active: filterTipo === 'mental',
          onClick: () => onFilterChange('mental'),
          variant: 'filterTabPurple',
        },
        {
          id: 'fisica',
          icon: 'brokenHeart',
          label: 'Física',
          count: fisicaCount,
          active: filterTipo === 'fisica',
          onClick: () => onFilterChange('fisica'),
          variant: 'filterTabRed',
        },
      ]}
    />
  );
}
