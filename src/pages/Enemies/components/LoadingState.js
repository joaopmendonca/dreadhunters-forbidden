import styles from '../styles/Enemies.module.css';

export default function LoadingState() {
  return (
    <div className={styles.loading}>
      <div className={styles.loadingSpinner}></div>
      <p>Carregando…</p>
    </div>
  );
}
