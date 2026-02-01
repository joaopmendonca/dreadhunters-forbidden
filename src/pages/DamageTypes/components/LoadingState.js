import styles from '../styles/DamageTypes.module.css';

export default function LoadingState() {
  return (
    <div className={styles.loadingGrid}>
      {[...Array(6)].map((_, i) => (
        <div key={i} className={styles.skeleton} />
      ))}
    </div>
  );
}
