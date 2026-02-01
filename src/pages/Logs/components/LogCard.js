import { useState } from 'react';
import Card from '../../../shared/components/Card';
import { 
  getActionIcon, 
  getActionLabel, 
  getLevelIcon, 
  getLevelVariant,
  getCategoryIcon,
  getCategoryLabel,
  getEntityIcon,
  getEntityLabel,
  LEVELS
} from '../constants';
import styles from '../styles/Logs.module.css';

export default function LogCard({ log, onViewDetails }) {
  const [expanded, setExpanded] = useState(false);

  const levelInfo = LEVELS[log.level] || LEVELS.INFO;
  const timestamp = new Date(log.timestamp).toLocaleString('pt-BR');
  const timeAgo = getTimeAgo(log.timestamp);

  // Determina a variante do card baseado no nível
  const cardVariant = getCardVariant(log.level);

  return (
    <div className={`${styles.logCard} ${styles[`level${log.level}`]}`}>
      {/* ─── Header ──────────────────────────────────────────────────────── */}
      <div className={styles.logCardHeader}>
        <div className={styles.logCardBadges}>
          {/* Badge de Nível */}
          <span className={`${styles.badge} ${styles[`badge${log.level}`]}`}>
            {getLevelIcon(log.level)} {levelInfo.label}
          </span>
          
          {/* Badge de Categoria */}
          <span className={`${styles.badge} ${styles.badgeCategory}`}>
            {getCategoryIcon(log.category)} {getCategoryLabel(log.category)}
          </span>
          
          {/* Badge de Ação */}
          <span className={`${styles.badge} ${styles.badgeAction}`}>
            {getActionIcon(log.action)} {getActionLabel(log.action)}
          </span>
        </div>
        
        <span className={styles.logCardTime} title={timestamp}>
          {timeAgo}
        </span>
      </div>

      {/* ─── Summary ─────────────────────────────────────────────────────── */}
      <div className={styles.logCardSummary}>
        {log.summary}
      </div>

      {/* ─── Meta Info ───────────────────────────────────────────────────── */}
      <div className={styles.logCardMeta}>
        <span className={styles.metaItem}>
          👤 {log.userName || 'Sistema'}
        </span>
        
        {log.entityType && (
          <span className={styles.metaItem}>
            {getEntityIcon(log.entityType)} {getEntityLabel(log.entityType)}
            {log.entityName && `: ${log.entityName}`}
          </span>
        )}
        
        {log.metadata?.statusCode && (
          <span className={`${styles.metaItem} ${getStatusClass(log.metadata.statusCode)}`}>
            📡 {log.metadata.statusCode}
          </span>
        )}
        
        {log.metadata?.duration && (
          <span className={styles.metaItem}>
            ⏱️ {log.metadata.duration}ms
          </span>
        )}
      </div>

      {/* ─── Expand Button ───────────────────────────────────────────────── */}
      {(log.changes || log.metadata) && (
        <button 
          className={styles.expandButton}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? '▲ Menos detalhes' : '▼ Mais detalhes'}
        </button>
      )}

      {/* ─── Expanded Details ────────────────────────────────────────────── */}
      {expanded && (
        <div className={styles.logCardDetails}>
          {/* Metadata */}
          {log.metadata && (
            <div className={styles.detailSection}>
              <h4 className={styles.detailTitle}>📋 Metadados</h4>
              <div className={styles.detailGrid}>
                {log.metadata.method && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Método:</span>
                    <span className={styles.detailValue}>{log.metadata.method}</span>
                  </div>
                )}
                {log.metadata.route && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Rota:</span>
                    <span className={styles.detailValue}>{log.metadata.route}</span>
                  </div>
                )}
                {log.metadata.ip && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>IP:</span>
                    <span className={styles.detailValue}>{log.metadata.ip}</span>
                  </div>
                )}
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Data/Hora:</span>
                  <span className={styles.detailValue}>{timestamp}</span>
                </div>
              </div>
            </div>
          )}

          {/* Changes */}
          {log.changes && (log.changes.before || log.changes.after) && (
            <div className={styles.detailSection}>
              <h4 className={styles.detailTitle}>📝 Alterações</h4>
              
              {log.changes.fields && log.changes.fields.length > 0 && (
                <div className={styles.changedFields}>
                  <strong>Campos alterados:</strong> {log.changes.fields.join(', ')}
                </div>
              )}
              
              <div className={styles.changesGrid}>
                {log.changes.before && (
                  <div className={styles.changesBefore}>
                    <h5>Antes:</h5>
                    <pre>{JSON.stringify(log.changes.before, null, 2)}</pre>
                  </div>
                )}
                {log.changes.after && (
                  <div className={styles.changesAfter}>
                    <h5>Depois:</h5>
                    <pre>{JSON.stringify(log.changes.after, null, 2)}</pre>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function getTimeAgo(timestamp) {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'agora';
  if (diffMin < 60) return `${diffMin}min atrás`;
  if (diffHour < 24) return `${diffHour}h atrás`;
  if (diffDay < 7) return `${diffDay}d atrás`;
  
  return date.toLocaleDateString('pt-BR');
}

function getCardVariant(level) {
  switch (level) {
    case 'ERROR':
    case 'CRITICAL':
      return 'red';
    case 'WARNING':
      return 'yellow';
    default:
      return 'blue';
  }
}

function getStatusClass(statusCode) {
  if (statusCode >= 500) return styles.statusError;
  if (statusCode >= 400) return styles.statusWarning;
  return styles.statusSuccess;
}
