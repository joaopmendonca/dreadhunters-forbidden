import { useCallback, useEffect, useState } from 'react';
import BaseLayout from '../../../shared/components/BaseLayout';
import EmptyState from '../../../shared/components/EmptyState';
import Pagination from '../../../shared/components/Pagination';
import useLogs from '../hooks/useLogs';
import styles from '../styles/Logs.module.css';
import LoadingState from './LoadingState';
import LogCard from './LogCard';
import LogsDashboard from './LogsDashboard';
import LogsHeader from './LogsHeader';

export default function LogsPage() {
  const {
    logs,
    pagination,
    stats,
    filters,
    loading,
    statsLoading,
    fetchLogs,
    fetchStats,
    updateFilters,
    resetFilters,
    goToPage
  } = useLogs();

  const [showDashboard, setShowDashboard] = useState(true);

  // ─── Fetch inicial ───────────────────────────────────────────────────────
  useEffect(() => {
    fetchLogs();
    fetchStats(filters.period);
  }, []);

  // ─── Refetch quando filtros mudam ────────────────────────────────────────
  useEffect(() => {
    fetchLogs(filters);
  }, [filters, fetchLogs]);

  // ─── Handler para mudança de filtros ─────────────────────────────────────
  const handleFiltersChange = useCallback((newFilters) => {
    updateFilters(newFilters);
    
    // Se mudou o período, atualiza stats também
    if ('period' in newFilters) {
      fetchStats(newFilters.period);
    }
  }, [updateFilters, fetchStats]);

  // ─── Handler para reset de filtros ───────────────────────────────────────
  const handleResetFilters = useCallback(() => {
    resetFilters();
    fetchStats('all');
  }, [resetFilters, fetchStats]);

  // ─── Handler para refresh ────────────────────────────────────────────────
  const handleRefresh = useCallback(() => {
    fetchLogs(filters);
    fetchStats(filters.period);
  }, [fetchLogs, fetchStats, filters]);

  // ─── Handler para mudança de página ──────────────────────────────────────
  const handlePageChange = useCallback((newPage) => {
    goToPage(newPage + 1); // Pagination é 0-indexed, API é 1-indexed
  }, [goToPage]);

  // ─── Verifica se há filtros ativos ───────────────────────────────────────
  const hasActiveFilters = 
    filters.category || 
    filters.level || 
    filters.action || 
    filters.entityType || 
    filters.search ||
    filters.period !== 'all';

  return (
    <BaseLayout title="Logs de Atividade">
      {/* ─── Header com filtros ──────────────────────────────────────────── */}
      <LogsHeader
        pagination={pagination}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onResetFilters={handleResetFilters}
        onRefresh={handleRefresh}
        loading={loading}
      />

      {/* ─── Toggle Dashboard ────────────────────────────────────────────── */}
      <div className={styles.dashboardToggle}>
        <button
          className={`${styles.toggleButton} ${showDashboard ? styles.active : ''}`}
          onClick={() => setShowDashboard(!showDashboard)}
        >
          {showDashboard ? '📊 Ocultar Dashboard' : '📊 Mostrar Dashboard'}
        </button>
      </div>

      {/* ─── Dashboard de Estatísticas ───────────────────────────────────── */}
      {showDashboard && (
        <LogsDashboard 
          stats={stats} 
          loading={statsLoading}
          period={filters.period}
        />
      )}

      {/* ─── Lista de Logs ───────────────────────────────────────────────── */}
      <div className={styles.logsSection}>
        <div className={styles.logsSectionHeader}>
          <h2 className={styles.logsSectionTitle}>
            📋 Histórico de Atividades
          </h2>
          {pagination.total > 0 && (
            <span className={styles.logsCount}>
              Mostrando {logs.length} de {pagination.total}
            </span>
          )}
        </div>

        {loading ? (
          <LoadingState />
        ) : logs.length === 0 ? (
          <EmptyState
            icon={hasActiveFilters ? "🔍" : "📋"}
            title={hasActiveFilters ? "Nenhum log encontrado" : "Sem logs registrados"}
            message={
              hasActiveFilters 
                ? "Tente ajustar seus filtros ou busca"
                : "Não há registros de atividade no sistema"
            }
          />
        ) : (
          <>
            <div className={styles.logsList}>
              {logs.map(log => (
                <LogCard key={log._id} log={log} />
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <Pagination
                currentPage={pagination.page - 1} // Pagination é 0-indexed
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </BaseLayout>
  );
}
