import { FaPlus, FaScroll, FaStar, FaCalendarDay, FaDownload, FaFileUpload } from 'react-icons/fa';
import Button from '../../../shared/components/Button';
import PageHeader from '../../../shared/components/PageHeader';
import TextInput from '../../../shared/components/TextInput';
import styles from '../styles/Quests.module.css';

export default function QuestsHeader({
  totalCount,
  mainCount,
  sideCount,
  dailyCount,
  searchTitle,
  onSearchChange,
  filterType,
  onFilterChange,
  onNew,
  onImport,
  onExportCSV,
  onDownloadTemplate
}) {
  return (
    <PageHeader
      statsCounters={[
        { icon: '📜', value: totalCount, label: 'Total' },
        { icon: <FaScroll />, value: mainCount, label: 'Principal', variant: 'counterGold' },
        { icon: <FaStar />, value: sideCount, label: 'Secundária', variant: 'counterGreen' },
        { icon: <FaCalendarDay />, value: dailyCount, label: 'Diária', variant: 'counterBlue' }
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
            Nova Quest
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
            placeholder="🔍 Buscar por título…"
            value={searchTitle}
            onChange={e => onSearchChange(e.target.value)}
          />
        </>
      }
      filterTabs={[
        {
          id: 'all',
          icon: '📜',
          label: 'Todas',
          count: totalCount,
          active: filterType === 'all',
          onClick: () => onFilterChange('all')
        },
        {
          id: 'main',
          icon: <FaScroll />,
          label: 'Principal',
          count: mainCount,
          active: filterType === 'main',
          onClick: () => onFilterChange('main'),
          variant: 'filterTabGold'
        },
        {
          id: 'side',
          icon: <FaStar />,
          label: 'Secundária',
          count: sideCount,
          active: filterType === 'side',
          onClick: () => onFilterChange('side'),
          variant: 'filterTabGreen'
        },
        {
          id: 'daily',
          icon: <FaCalendarDay />,
          label: 'Diária',
          count: dailyCount,
          active: filterType === 'daily',
          onClick: () => onFilterChange('daily'),
          variant: 'filterTabBlue'
        }
      ]}
    />
  );
}
