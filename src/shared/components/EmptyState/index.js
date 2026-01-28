// src/components/EmptyState/index.js
import PropTypes from 'prop-types';
import styles from './EmptyState.module.css';

/**
 * EmptyState - Componente para exibir estado vazio
 * 
 * Props:
 * - icon: Emoji ou ReactNode para o ícone
 * - title: Título da mensagem (opcional)
 * - message: Mensagem principal
 * - action: ReactNode com botão de ação (opcional)
 */
export default function EmptyState({ icon, title, message, action }) {
  return (
    <div className={styles.emptyState}>
      {icon && <span className={styles.emptyIcon}>{icon}</span>}
      {title && <h3 className={styles.emptyTitle}>{title}</h3>}
      {message && <p className={styles.emptyMessage}>{message}</p>}
      {action && <div className={styles.emptyAction}>{action}</div>}
    </div>
  );
}

EmptyState.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string,
  message: PropTypes.string,
  action: PropTypes.node
};

EmptyState.defaultProps = {
  icon: '📭',
  title: null,
  message: 'Nenhum item encontrado.',
  action: null
};
