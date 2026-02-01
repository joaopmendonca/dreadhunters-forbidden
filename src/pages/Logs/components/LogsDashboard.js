import { useMemo } from 'react';
import {
    FaDatabase,
    FaExclamationTriangle,
    FaHistory,
    FaShieldAlt,
    FaUserShield
} from 'react-icons/fa';
import {
    CATEGORIES,
    ENTITY_TYPES,
    getEntityIcon,
    getLevelIcon
} from '../constants';
import styles from '../styles/Logs.module.css';

export default function LogsDashboard({ stats, loading, period }) {
  // ─── Métricas principais ─────────────────────────────────────────────────
  const mainStats = useMemo(() => {
    if (!stats) return [];

    const errorCount = (stats.byLevel?.ERROR || 0) + (stats.byLevel?.CRITICAL || 0);
    const warningCount = stats.byLevel?.WARNING || 0;

    return [
      {
        icon: <FaHistory />,
        value: stats.total || 0,
        label: 'Total de Logs',
        color: 'blue'
      },
      {
        icon: <FaExclamationTriangle />,
        value: errorCount,
        label: 'Erros',
        color: errorCount > 0 ? 'red' : 'gray'
      },
      {
        icon: <FaShieldAlt />,
        value: warningCount,
        label: 'Avisos',
        color: warningCount > 0 ? 'yellow' : 'gray'
      },
      {
        icon: <FaUserShield />,
        value: stats.byCategory?.AUTH || 0,
        label: 'Autenticação',
        color: 'purple'
      },
      {
        icon: <FaDatabase />,
        value: stats.byCategory?.ENTITY || 0,
        label: 'Entidades',
        color: 'blue'
      }
    ];
  }, [stats]);

  // ─── Top entidades modificadas ───────────────────────────────────────────
  const topEntities = useMemo(() => {
    if (!stats?.byEntityType) return [];

    return Object.entries(stats.byEntityType)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([type, count]) => ({
        type,
        count,
        icon: getEntityIcon(type),
        label: ENTITY_TYPES[type]?.label || type
      }));
  }, [stats]);

  // ─── Erros recentes ──────────────────────────────────────────────────────
  const recentErrors = useMemo(() => {
    return stats?.recentErrors || [];
  }, [stats]);

  if (loading) {
    return (
      <div className={styles.dashboardLoading}>
        <div className={styles.loadingSpinner}>⏳</div>
        <p>Carregando estatísticas...</p>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className={styles.dashboard}>
      {/* ─── Stats Cards ──────────────────────────────────────────────────── */}
      <div className={styles.statsRow}>
        {mainStats.map((stat, idx) => (
          <div key={idx} className={`${styles.statCard} ${styles[`stat${stat.color}`]}`}>
            <div className={styles.statIcon}>{stat.icon}</div>
            <div className={styles.statValue}>{stat.value.toLocaleString()}</div>
            <div className={styles.statLabel}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* ─── Secondary Row ────────────────────────────────────────────────── */}
      <div className={styles.dashboardRow}>
        {/* Top Entidades */}
        <div className={styles.dashboardCard}>
          <h3 className={styles.dashboardCardTitle}>
            📊 Entidades Mais Modificadas
          </h3>
          {topEntities.length > 0 ? (
            <ul className={styles.entityList}>
              {topEntities.map(({ type, count, icon, label }) => (
                <li key={type} className={styles.entityItem}>
                  <span className={styles.entityIcon}>{icon}</span>
                  <span className={styles.entityLabel}>{label}</span>
                  <span className={styles.entityCount}>{count}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.noData}>Nenhuma entidade modificada</p>
          )}
        </div>

        {/* Erros Recentes */}
        <div className={styles.dashboardCard}>
          <h3 className={styles.dashboardCardTitle}>
            🚨 Erros Recentes
          </h3>
          {recentErrors.length > 0 ? (
            <ul className={styles.errorList}>
              {recentErrors.map((error, idx) => (
                <li key={error._id || idx} className={styles.errorItem}>
                  <span className={styles.errorIcon}>
                    {getLevelIcon(error.level)}
                  </span>
                  <div className={styles.errorContent}>
                    <span className={styles.errorSummary}>
                      {error.summary}
                    </span>
                    <span className={styles.errorTime}>
                      {new Date(error.timestamp).toLocaleString('pt-BR')}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.noData}>✅ Nenhum erro recente</p>
          )}
        </div>

        {/* Atividade por Categoria */}
        <div className={styles.dashboardCard}>
          <h3 className={styles.dashboardCardTitle}>
            📂 Por Categoria
          </h3>
          <ul className={styles.categoryList}>
            {Object.entries(CATEGORIES).map(([key, { label, icon, color }]) => {
              const count = stats.byCategory?.[key] || 0;
              return (
                <li key={key} className={styles.categoryItem}>
                  <span className={styles.categoryIcon}>{icon}</span>
                  <span className={styles.categoryLabel}>{label}</span>
                  <span className={styles.categoryCount}>{count}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
