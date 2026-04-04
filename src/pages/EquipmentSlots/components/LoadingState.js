import styles from '../styles/EquipmentSlots.module.css';

export default function LoadingState() {
  return (
    <div className={styles.loading}>
      <div className={styles.loadingSpinner}></div>
      <span>Carregando slots de equipamento...</span>
    </div>
  );
}
