import { FaSpinner } from 'react-icons/fa';
import styles from '../styles/Quests.module.css';

export default function LoadingState() {
  return (
    <div className={styles.loading}>
      <FaSpinner className={styles.loadingSpinner} />
      <p>Carregando quests…</p>
    </div>
  );
}
