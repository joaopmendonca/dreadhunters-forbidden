import styles from '../styles/Afflictions.module.css';

export default function LoadingState() {
  return (
    <div className={styles.loading}>
      <div className={styles.loadingSpinner}></div>
      <p>Carregando aflições…</p>
    </div>
  );
}
