import { FaHistory } from 'react-icons/fa';
import PageHeader from '../../../shared/components/PageHeader';
import TextInput from '../../../shared/components/TextInput';
import Select from '../../../shared/components/Select';
import { PERIOD_OPTIONS } from '../constants';
import styles from '../styles/Logs.module.css';

export default function LogsHeader({
  totalCount,
  searchTerm,
  onSearchChange,
  filterAction,
  onActionChange,
  actionOptions,
  filterPeriod,
  onPeriodChange
}) {
  return (
    <PageHeader
      statsCounters={[
        { icon: <FaHistory />, value: totalCount, label: 'Total' }
      ]}
      controls={
        <>
          <TextInput
            className={styles.searchInput}
            placeholder="🔍 Buscar ação ou usuário…"
            value={searchTerm}
            onChange={e => onSearchChange(e.target.value)}
          />

          <Select
            className={styles.filterSelect}
            options={[{ value: '', label: 'Todas as Ações' }, ...actionOptions]}
            value={filterAction}
            onChange={onActionChange}
          />

          <Select
            className={styles.filterSelect}
            options={PERIOD_OPTIONS}
            value={filterPeriod}
            onChange={onPeriodChange}
          />
        </>
      }
    />
  );
}
