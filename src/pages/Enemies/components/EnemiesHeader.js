import { FaPlus, FaSkull, FaStar, FaCrown, FaFileUpload, FaDownload } from 'react-icons/fa';
import Button from '../../../shared/components/Button';
import PageHeader from '../../../shared/components/PageHeader';
import TextInput from '../../../shared/components/TextInput';
import styles from '../styles/Enemies.module.css';

export default function EnemiesHeader({
  totalCount,
  normalCount,
  eliteCount,
  bossCount,
  searchName,
  onSearchChange,
  filterType,
  onFilterChange,
  onNew,
  onImport,
  onExport,
  onDownloadTemplate
}) {
  return (
    <PageHeader
      statsCounters={[
        { icon: '👹', value: totalCount, label: 'Total' },
        { icon: <FaSkull />, value: normalCount, label: 'Normal', variant: 'counterGray' },
        { icon: <FaStar />, value: eliteCount, label: 'Elite', variant: 'counterMaroon' },
        { icon: <FaCrown />, value: bossCount, label: 'Boss', variant: 'counterGold' }
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
            Novo Inimigo
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
            placeholder="🔍 Buscar por nome…"
            value={searchName}
            onChange={e => onSearchChange(e.target.value)}
          />
        </>
      }
      filterTabs={[
        {
          id: 'all',
          icon: '👹',
          label: 'Todos',
          count: totalCount,
          active: filterType === 'all',
          onClick: () => onFilterChange('all')
        },
        {
          id: 'normal',
          icon: <FaSkull />,
          label: 'Normal',
          count: normalCount,
          active: filterType === 'normal',
          onClick: () => onFilterChange('normal'),
          variant: 'filterTabGray'
        },
        {
          id: 'elite',
          icon: <FaStar />,
          label: 'Elite',
          count: eliteCount,
          active: filterType === 'elite',
          onClick: () => onFilterChange('elite'),
          variant: 'filterTabMaroon'
        },
        {
          id: 'boss',
          icon: <FaCrown />,
          label: 'Boss',
          count: bossCount,
          active: filterType === 'boss',
          onClick: () => onFilterChange('boss'),
          variant: 'filterTabGold'
        }
      ]}
    />
  );
}
