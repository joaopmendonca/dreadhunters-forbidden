import { FaPlus, FaFlask, FaShieldAlt, FaCube, FaKey, FaScroll } from 'react-icons/fa';
import Button from '../../../shared/components/Button';
import PageHeader from '../../../shared/components/PageHeader';
import TextInput from '../../../shared/components/TextInput';
import styles from '../styles/Items.module.css';

export default function ItemsHeader({
  totalCount,
  consumableCount,
  equipmentCount,
  materialCount,
  keyCount,
  questCount,
  searchName,
  onSearchChange,
  filterType,
  onFilterChange,
  onNew
}) {
  return (
    <PageHeader
      statsCounters={[
        { icon: '🎒', value: totalCount, label: 'Total' },
        { icon: <FaFlask />, value: consumableCount, label: 'Consumível', variant: 'counterGreen' },
        { icon: <FaShieldAlt />, value: equipmentCount, label: 'Equipamento', variant: 'counterMaroon' },
        { icon: <FaCube />, value: materialCount, label: 'Material', variant: 'counterBlue' }
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
            Novo Item
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
          icon: '🎒',
          label: 'Todos',
          count: totalCount,
          active: filterType === 'all',
          onClick: () => onFilterChange('all')
        },
        {
          id: 'consumable',
          icon: <FaFlask />,
          label: 'Consumível',
          count: consumableCount,
          active: filterType === 'consumable',
          onClick: () => onFilterChange('consumable'),
          variant: 'filterTabGreen'
        },
        {
          id: 'equipment',
          icon: <FaShieldAlt />,
          label: 'Equipamento',
          count: equipmentCount,
          active: filterType === 'equipment',
          onClick: () => onFilterChange('equipment'),
          variant: 'filterTabMaroon'
        },
        {
          id: 'material',
          icon: <FaCube />,
          label: 'Material',
          count: materialCount,
          active: filterType === 'material',
          onClick: () => onFilterChange('material'),
          variant: 'filterTabBlue'
        },
        {
          id: 'key',
          icon: <FaKey />,
          label: 'Chave',
          count: keyCount,
          active: filterType === 'key',
          onClick: () => onFilterChange('key'),
          variant: 'filterTabGold'
        },
        {
          id: 'quest',
          icon: <FaScroll />,
          label: 'Quest',
          count: questCount,
          active: filterType === 'quest',
          onClick: () => onFilterChange('quest'),
          variant: 'filterTabPurple'
        }
      ]}
    />
  );
}
