import { FaPlus } from 'react-icons/fa';
import Button from '../../../shared/components/Button';
import PageHeader from '../../../shared/components/PageHeader';
import TextInput from '../../../shared/components/TextInput';
import styles from '../styles/Locations.module.css';

export default function LocationsHeader({ totalCount, searchName, onSearchChange, onNew }) {
  return (
    <PageHeader
      statsCounters={[
        { icon: '📍', value: totalCount, label: 'Total' }
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
            Novo Local
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
