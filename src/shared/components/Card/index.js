import React from 'react';
import { FaEdit, FaTimes } from 'react-icons/fa';
import { renderIcon, renderIconLabel } from '../IconRenderer';
import styles from './Card.module.css';

function Card({ children, variant = 'default', className = '', onClick, ...props }) {
  const variantClass = styles[`card${variant.charAt(0).toUpperCase() + variant.slice(1)}`] || '';

  return (
    <div className={`${styles.card} ${variantClass} ${className}`} onClick={onClick} {...props}>
      {children}
    </div>
  );
}

function TopBar({ children, badge }) {
  return (
    <div className={styles.topBar}>
      <div className={styles.topBarBadge}>{badge}</div>
      <div className={styles.topBarActions}>{children}</div>
    </div>
  );
}

function Badge({ children, variant = 'default', className = '', ...props }) {
  const variantClass = styles[`badge${variant.charAt(0).toUpperCase() + variant.slice(1)}`] || '';

  return (
    <span className={`${styles.badge} ${variantClass} ${className}`} {...props}>
      {typeof children === 'string' ? renderIconLabel(children) : children}
    </span>
  );
}

function Actions({ onEdit, onDelete, editTitle = 'Editar', deleteTitle = 'Excluir' }) {
  return (
    <div className={styles.actions}>
      {onEdit && (
        <button
          className={styles.actionButton}
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          title={editTitle}
        >
          <FaEdit />
        </button>
      )}
      {onDelete && (
        <button
          className={`${styles.actionButton} ${styles.actionButtonDelete}`}
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          title={deleteTitle}
        >
          <FaTimes />
        </button>
      )}
    </div>
  );
}

function Header({ image, imageAlt = '', type, title, subtitle, children }) {
  return (
    <div className={styles.header}>
      {image && (
        <div className={styles.headerImage}>
          <img src={image} alt={imageAlt || title} />
        </div>
      )}
      <div className={styles.headerInfo}>
        {type && <span className={styles.headerType}>{typeof type === 'string' ? renderIconLabel(type) : type}</span>}
        {title && <h3 className={styles.headerTitle}>{title}</h3>}
        {subtitle && <p className={styles.headerSubtitle}>{subtitle}</p>}
        {children}
      </div>
    </div>
  );
}

function Body({ children, className = '' }) {
  return <div className={`${styles.body} ${className}`}>{children}</div>;
}

function Section({ title, children, className = '' }) {
  return (
    <div className={`${styles.section} ${className}`}>
      {title && <strong className={styles.sectionTitle}>{typeof title === 'string' ? renderIconLabel(title) : title}</strong>}
      <div className={styles.sectionContent}>{children}</div>
    </div>
  );
}

function SectionLabel({ children }) {
  return <span className={styles.sectionLabel}>{typeof children === 'string' ? renderIconLabel(children) : children}</span>;
}

function SeverityBadge({ severity = 'leve', label }) {
  const configs = {
    leve: { nome: 'Leve', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' },
    media: { nome: 'Média', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' },
    grave: { nome: 'Grave', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)' },
  };
  const config = configs[severity] || configs.leve;

  return (
    <span
      className={styles.severityBadge}
      style={{
        backgroundColor: config.bg,
        color: config.color,
        borderColor: config.color,
      }}
    >
      {label || `Severidade - ${config.nome.toLowerCase()}`}
    </span>
  );
}

function LevelCard({ severity = 'leve', children, className = '' }) {
  const severityClass = styles[`level${severity.charAt(0).toUpperCase() + severity.slice(1)}`] || '';

  return <div className={`${styles.levelCard} ${severityClass} ${className}`}>{children}</div>;
}

function StatList({ stats = [], emptyMessage = 'Nenhum dado' }) {
  if (!stats || stats.length === 0) {
    return <p className={styles.emptyStats}>{emptyMessage}</p>;
  }

  return (
    <div className={styles.statList}>
      {stats.map((stat, idx) => (
        <div key={idx} className={styles.statItem}>
          <span
            className={`${styles.statValue} ${
              String(stat.value).startsWith('-')
                ? styles.statNegative
                : String(stat.value).startsWith('+')
                  ? styles.statPositive
                  : ''
            }`}
          >
            {stat.value}
          </span>
          <span className={styles.statLabel}>{stat.label}</span>
        </div>
      ))}
    </div>
  );
}

function Overlay({ icon, message, children }) {
  return (
    <div className={styles.overlay}>
      {icon && <span className={styles.overlayIcon}>{renderIcon(icon, { className: styles.overlayIconGlyph })}</span>}
      {message && <span className={styles.overlayMessage}>{message}</span>}
      {children}
    </div>
  );
}

function Footer({ children, className = '' }) {
  return <div className={`${styles.footer} ${className}`}>{children}</div>;
}

function Grid({ children, columns = 'auto-fill', minWidth = '380px', gap = '1.5rem', className = '' }) {
  return (
    <div
      className={`${styles.grid} ${className}`}
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(${minWidth}, 1fr))`,
        gap,
      }}
    >
      {children}
    </div>
  );
}

Card.TopBar = TopBar;
Card.Badge = Badge;
Card.Actions = Actions;
Card.Header = Header;
Card.Body = Body;
Card.Section = Section;
Card.SectionLabel = SectionLabel;
Card.SeverityBadge = SeverityBadge;
Card.LevelCard = LevelCard;
Card.StatList = StatList;
Card.Overlay = Overlay;
Card.Footer = Footer;
Card.Grid = Grid;

export default Card;
