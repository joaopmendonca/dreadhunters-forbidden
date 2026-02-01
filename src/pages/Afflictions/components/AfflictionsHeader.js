import { FaBrain, FaDownload, FaFileUpload, FaHeartBroken, FaPlus, FaSkull } from 'react-icons/fa';
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
  fileInputRef
}) {
  return (
    <PageHeader
      statsCounters={[
        { icon: <FaSkull />, value: totalCount, label: 'Total' },
        { icon: <FaBrain />, value: mentalCount, label: 'Mental', variant: 'counterMental' },
        { icon: <FaHeartBroken />, value: fisicaCount, label: 'Física', variant: 'counterFisica' }
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
            Nova Aflição
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

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={onUploadCSV}
            style={{ display: 'none' }}
          />

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
            placeholder="🔍 Buscar aflição…"
            value={searchName}
            onChange={e => onSearchChange(e.target.value)}
          />
        </>
      }
      filterTabs={[
        {
          id: 'all',
          icon: <FaSkull />,
          label: 'Todas',
          count: totalCount,
          active: filterTipo === 'all',
          onClick: () => onFilterChange('all')
        },
        {
          id: 'mental',
          icon: <FaBrain />,
          label: 'Mental',
          count: mentalCount,
          active: filterTipo === 'mental',
          onClick: () => onFilterChange('mental'),
          variant: 'filterTabPurple'
        },
        {
          id: 'fisica',
          icon: <FaHeartBroken />,
          label: 'Física',
          count: fisicaCount,
          active: filterTipo === 'fisica',
          onClick: () => onFilterChange('fisica'),
          variant: 'filterTabRed'
        }
      ]}
    />
  );
}
