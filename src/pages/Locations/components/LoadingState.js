import { FaSpinner } from 'react-icons/fa';
import styles from '../styles/Locations.module.css';

export default function LoadingState() {
  return (
    <div className={styles.loading}>
      <FaSpinner className={styles.loadingSpinner} />
      <p>Carregando locais…</p>
    </div>
  );
}
