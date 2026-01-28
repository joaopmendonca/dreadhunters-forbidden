import { FaSpinner, FaHistory } from 'react-icons/fa';
import styles from '../styles/Logs.module.css';

export default function LoadingState() {
  return (
    <div className={styles.loading}>
      <FaSpinner className={styles.loadingSpinner} />
      <p>Carregando logs…</p>
    </div>
  );
}
