import React from 'react';
import PropTypes from 'prop-types';
import styles from './MetricCard.module.css';

/**
 * Pequeno "kpi"-card (valor + rotulo) para dashboards.
 *
 * Props
 * -----
 * - label  - texto abaixo do valor (ex.: "Usuarios")
 * - value  - numero ja formatado ou string
 * - color  - cor de destaque (hex, var() ou nome CSS)
 * - icon   - (opcional) JSX com icone ou string emoji
 *
 * Exemplo:
 * <MetricCard label="Usuarios" value={totalUsers} color="var(--maroon)" icon="..." />
 */
export default function MetricCard({ label, value, color, icon }) {
  // Renderiza o icone: se for string (emoji), exibe diretamente; se for elemento React, faz clone
  const renderIcon = () => {
    if (!icon) return null;
    if (typeof icon === 'string') {
      return <span style={{ fontSize: '1.5rem' }}>{icon}</span>;
    }
    return React.cloneElement(icon, { color });
  };

  return (
    <div className={styles.card}>
      {icon && (
        <div
          className={styles.iconWrapper}
          style={{ backgroundColor: `${color}20` /* 12% opacity */ }}
        >
          {renderIcon()}
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
  label:  PropTypes.string.isRequired,
  value:  PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  color:  PropTypes.string,
  icon:   PropTypes.oneOfType([PropTypes.element, PropTypes.string])
};

MetricCard.defaultProps = {
  color: 'var(--gold)',
  icon:  null
};
