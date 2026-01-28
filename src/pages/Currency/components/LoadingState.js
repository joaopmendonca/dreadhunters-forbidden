import styles from '../styles/Currency.module.css';

export default function LoadingState() {
  return (
    <div className={styles.loading}>
      <div className={styles.loadingSpinner}></div>
      <p>Carregando moedas…</p>
    </div>
  );
}
