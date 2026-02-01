import { FaHistory, FaFilter, FaSync } from 'react-icons/fa';
import PageHeader from '../../../shared/components/PageHeader';
import TextInput from '../../../shared/components/TextInput';
import Select from '../../../shared/components/Select';
import { 
  PERIOD_OPTIONS, 
  CATEGORY_OPTIONS, 
  LEVEL_OPTIONS, 
  ACTION_OPTIONS,
  ENTITY_TYPE_OPTIONS 
} from '../constants';
import styles from '../styles/Logs.module.css';

export default function LogsHeader({
  pagination,
  filters,
  onFiltersChange,
  onResetFilters,
  onRefresh,
  loading
}) {
  const handleFilterChange = (key) => (value) => {
    onFiltersChange({ [key]: value });
  };

  return (
    <PageHeader
      statsCounters={[
        { 
          icon: <FaHistory />, 
          value: pagination?.total || 0, 
          label: 'Total de Logs' 
        }
      ]}
      controls={
        <div className={styles.headerControls}>
          {/* Busca */}
          <TextInput
            className={styles.searchInput}
            placeholder="🔍 Buscar nos logs…"
            value={filters.search}
            onChange={e => handleFilterChange('search')(e.target.value)}
          />

          {/* Filtros */}
          <div className={styles.filtersRow}>
            <Select
              className={styles.filterSelect}
              options={PERIOD_OPTIONS}
              value={filters.period}
              onChange={handleFilterChange('period')}
            />

            <Select
              className={styles.filterSelect}
              options={CATEGORY_OPTIONS}
              value={filters.category}
              onChange={handleFilterChange('category')}
            />

            <Select
              className={styles.filterSelect}
              options={LEVEL_OPTIONS}
              value={filters.level}
              onChange={handleFilterChange('level')}
            />

            <Select
              className={styles.filterSelect}
              options={ACTION_OPTIONS}
              value={filters.action}
              onChange={handleFilterChange('action')}
            />

            <Select
              className={styles.filterSelect}
              options={ENTITY_TYPE_OPTIONS}
              value={filters.entityType}
              onChange={handleFilterChange('entityType')}
            />
          </div>

          {/* Botões de ação */}
          <div className={styles.headerActions}>
            <button 
              className={styles.resetButton}
              onClick={onResetFilters}
              title="Limpar filtros"
            >
              <FaFilter /> Limpar
            </button>
            <button 
              className={styles.refreshButton}
              onClick={onRefresh}
              disabled={loading}
              title="Atualizar"
            >
              <FaSync className={loading ? styles.spinning : ''} /> Atualizar
            </button>
          </div>
        </div>
      }
    />
  );
}
