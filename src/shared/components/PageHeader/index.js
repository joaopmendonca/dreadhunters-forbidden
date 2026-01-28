// src/components/PageHeader/index.js
import PropTypes from 'prop-types';
import styles from './PageHeader.module.css';

/**
 * PageHeader - Componente reutilizável de cabeçalho de página
 * 
 * Props:
 * - statsCounters: Array de contadores [{icon, value, label, variant}]
 * - controls: ReactNode com botões e inputs de controle
 * - filterTabs: Array de tabs [{id, icon, label, count, active, onClick}]
 */
export default function PageHeader({ statsCounters, controls, filterTabs }) {
  // Sempre mostra o header, mesmo sem dados
  const hasStats = statsCounters && statsCounters.length > 0;
  const hasFilters = filterTabs && filterTabs.length > 0;

  return (
    <div className={styles.pageHeader}>
      {/* Header Top: Stats + Controls */}
      <div className={styles.headerTop}>
        {/* Stats Counter */}
        {hasStats && (
          <div className={styles.statsCounter}>
            {statsCounters.map((counter, idx) => (
              <div 
                key={idx} 
                className={`${styles.counterItem} ${counter.variant ? styles[counter.variant] : ''}`}
              >
                <span className={styles.counterIcon}>{counter.icon}</span>
                <strong className={styles.counterValue}>{counter.value}</strong>
                <small className={styles.counterLabel}>{counter.label}</small>
              </div>
            ))}
          </div>
        )}

        {/* Controls (botões, inputs, etc) - sempre visível */}
        {controls && (
          <div className={styles.controls}>
            {controls}
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      {hasFilters && (
        <div className={styles.filterTabs}>
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.filterTab} ${tab.active ? styles.filterTabActive : ''} ${tab.variant ? styles[tab.variant] : ''}`}
              onClick={tab.onClick}
            >
              {tab.icon} {tab.label} 
              {tab.count !== undefined && (
                <span className={styles.filterTabCount}>{tab.count}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

PageHeader.propTypes = {
  statsCounters: PropTypes.arrayOf(PropTypes.shape({
    icon: PropTypes.node.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    label: PropTypes.string.isRequired,
    variant: PropTypes.string
  })),
  controls: PropTypes.node,
  filterTabs: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    icon: PropTypes.node,
    label: PropTypes.string.isRequired,
    count: PropTypes.number,
    active: PropTypes.bool,
    onClick: PropTypes.func,
    variant: PropTypes.string
  }))
};

PageHeader.defaultProps = {
  statsCounters: [],
  controls: null,
  filterTabs: []
};
