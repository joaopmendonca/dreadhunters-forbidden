import React from 'react';
import PropTypes from 'prop-types';
import { renderIcon } from '../IconRenderer';
import styles from './MetricCard.module.css';

export default function MetricCard({ label, value, color, icon }) {
  return (
    <div className={styles.card}>
      {icon && (
        <div
          className={styles.iconWrapper}
          style={{ backgroundColor: `${color}20` }}
        >
          {renderIcon(icon, { color, style: { width: '1.25rem', height: '1.25rem' } })}
        </div>
      )}

      <div className={styles.texts}>
        <span className={styles.value} style={{ color }}>
          {value}
        </span>
        <span className={styles.label}>{label}</span>
      </div>
    </div>
  );
}

MetricCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  color: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
};

MetricCard.defaultProps = {
  color: 'var(--gold)',
  icon: null,
};
