import { FaPlus, FaFileUpload, FaDownload, FaCheckCircle, FaTimesCircle, FaThLarge } from 'react-icons/fa';
import Button from '../../../shared/components/Button';
import PageHeader from '../../../shared/components/PageHeader';
import TextInput from '../../../shared/components/TextInput';
import styles from '../styles/EquipmentSlots.module.css';

export default function EquipmentSlotsHeader({
  totalCount,
  activeCount,
  inactiveCount,
  filterStatus,
  onFilterChange,
  searchName,
  onSearchChange,
  onNew,
  onImport,
  onExport,
  onDownloadTemplate
}) {
  return (
    <PageHeader
      statsCounters={[
        { icon: <FaThLarge />, value: totalCount, label: 'Total' },
        { icon: <FaCheckCircle />, value: activeCount, label: 'Ativos', variant: 'counterActive' },
        { icon: <FaTimesCircle />, value: inactiveCount, label: 'Inativos', variant: 'counterInactive' }
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
            Novo Slot
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
            className={styles.searchInput}
            placeholder="🔍 Buscar por key ou nome..."
            value={searchName}
            onChange={e => onSearchChange(e.target.value)}
          />
        </>
      }
      filterTabs={[
        {
          id: 'all',
          icon: <FaThLarge />,
          label: 'Todos',
          count: totalCount,
          active: filterStatus === 'all',
          onClick: () => onFilterChange('all')
        },
        {
          id: 'active',
          icon: <FaCheckCircle />,
          label: 'Ativos',
          count: activeCount,
          active: filterStatus === 'active',
          onClick: () => onFilterChange('active'),
          variant: 'filterTabGreen'
        },
        {
          id: 'inactive',
          icon: <FaTimesCircle />,
          label: 'Inativos',
          count: inactiveCount,
          active: filterStatus === 'inactive',
          onClick: () => onFilterChange('inactive'),
          variant: 'filterTabRed'
        }
      ]}
    />
  );
}
