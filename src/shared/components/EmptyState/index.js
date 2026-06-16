import PropTypes from 'prop-types';
import { renderIcon } from '../IconRenderer';
import styles from './EmptyState.module.css';

export default function EmptyState({ icon, title, message, action }) {
  return (
    <div className={styles.emptyState}>
      {icon && <span className={styles.emptyIcon}>{renderIcon(icon, { className: styles.emptyIconGlyph })}</span>}
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
  action: PropTypes.node,
};

EmptyState.defaultProps = {
  icon: 'empty',
  title: null,
  message: 'Nenhum item encontrado.',
  action: null,
};
