import PropTypes from 'prop-types';
import { renderIcon, renderIconLabel } from '../IconRenderer';
import styles from './PageHeader.module.css';

export default function PageHeader({ statsCounters, controls, filterTabs }) {
  const hasStats = statsCounters && statsCounters.length > 0;
  const hasFilters = filterTabs && filterTabs.length > 0;

  return (
    <div className={styles.pageHeader}>
      <div className={styles.headerTop}>
        {hasStats && (
          <div className={styles.statsCounter}>
            {statsCounters.map((counter, idx) => (
              <div
                key={idx}
                className={`${styles.counterItem} ${counter.variant ? styles[counter.variant] : ''}`}
              >
                <span className={styles.counterIcon}>
                  {renderIcon(counter.icon, { className: styles.counterIconGlyph })}
                </span>
                <strong className={styles.counterValue}>{counter.value}</strong>
                <small className={styles.counterLabel}>{counter.label}</small>
              </div>
            ))}
          </div>
        )}

        {controls && <div className={styles.controls}>{controls}</div>}
      </div>

      {hasFilters && (
        <div className={styles.filterTabs}>
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.filterTab} ${tab.active ? styles.filterTabActive : ''} ${tab.variant ? styles[tab.variant] : ''}`}
              onClick={tab.onClick}
            >
              {tab.icon && <span className={styles.filterTabIcon}>{renderIcon(tab.icon, { className: styles.filterTabIconGlyph })}</span>}
              {renderIconLabel(tab.label, { className: styles.filterTabLabel })}
              {tab.count !== undefined && <span className={styles.filterTabCount}>{tab.count}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

PageHeader.propTypes = {
  statsCounters: PropTypes.arrayOf(PropTypes.shape({
    icon: PropTypes.node,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    label: PropTypes.string.isRequired,
    variant: PropTypes.string,
  })),
  controls: PropTypes.node,
  filterTabs: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    icon: PropTypes.node,
    label: PropTypes.string.isRequired,
    count: PropTypes.number,
    active: PropTypes.bool,
    onClick: PropTypes.func,
    variant: PropTypes.string,
  })),
};

PageHeader.defaultProps = {
  statsCounters: [],
  controls: null,
  filterTabs: [],
};
