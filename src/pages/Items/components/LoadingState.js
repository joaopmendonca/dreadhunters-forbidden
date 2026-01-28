import styles from '../styles/Items.module.css';

export default function LoadingState() {
  return (
    <div className={styles.loading}>
      <div className={styles.loadingSpinner}></div>
      <p>Carregando itens…</p>
    </div>
  );
}
