import { useCallback, useState, useRef } from 'react';
import { useSnackbar } from 'notistack';
import api from '../../../config/api';
import { MESSAGES, getPeriodDates } from '../constants';

const DEFAULT_FILTERS = {
  category: '',
  level: '',
  action: '',
  entityType: '',
  search: '',
  period: 'all',
  page: 1,
  limit: 20
};

export default function useLogs() {
  const { enqueueSnackbar } = useSnackbar();

  // ─── States ──────────────────────────────────────────────────────────────
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);

  // Para evitar requisições duplicadas
  const abortControllerRef = useRef(null);

  // ─── Fetch Logs ──────────────────────────────────────────────────────────
  const fetchLogs = useCallback(async (customFilters = {}) => {
    // Cancela requisição anterior se existir
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setLoading(true);
    try {
      const activeFilters = { ...filters, ...customFilters };
      
      // Converte período para datas
      const { startDate, endDate } = getPeriodDates(activeFilters.period);
      
      const params = {
        page: activeFilters.page,
        limit: activeFilters.limit,
        ...(activeFilters.category && { category: activeFilters.category }),
        ...(activeFilters.level && { level: activeFilters.level }),
        ...(activeFilters.action && { action: activeFilters.action }),
        ...(activeFilters.entityType && { entityType: activeFilters.entityType }),
        ...(activeFilters.search && { search: activeFilters.search }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate })
      };

      const { data } = await api.get('/logs', { 
        params,
        signal: abortControllerRef.current.signal 
      });
      
      setLogs(data.logs || []);
      setPagination(data.pagination || {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0
      });
    } catch (err) {
      if (err.name !== 'CanceledError') {
        enqueueSnackbar(MESSAGES.FETCH_ERROR, { variant: 'error' });
      }
    } finally {
      setLoading(false);
    }
  }, [filters, enqueueSnackbar]);

  // ─── Fetch Stats ─────────────────────────────────────────────────────────
  const fetchStats = useCallback(async (period = 'all') => {
    setStatsLoading(true);
    try {
      const { startDate, endDate } = getPeriodDates(period);
      const params = {
        ...(startDate && { startDate }),
        ...(endDate && { endDate })
      };

      const { data } = await api.get('/logs/stats', { params });
      setStats(data);
    } catch {
      enqueueSnackbar(MESSAGES.STATS_ERROR, { variant: 'error' });
    } finally {
      setStatsLoading(false);
    }
  }, [enqueueSnackbar]);

  // ─── Update Filters ──────────────────────────────────────────────────────
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => {
      const updated = { ...prev, ...newFilters };
      // Reseta página ao mudar filtros (exceto se for mudança de página)
      if (!('page' in newFilters)) {
        updated.page = 1;
      }
      return updated;
    });
  }, []);

  // ─── Reset Filters ───────────────────────────────────────────────────────
  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  // ─── Go to Page ──────────────────────────────────────────────────────────
  const goToPage = useCallback((page) => {
    updateFilters({ page });
  }, [updateFilters]);

  // ─── Fetch Log Detail ────────────────────────────────────────────────────
  const fetchLogDetail = useCallback(async (id) => {
    try {
      const { data } = await api.get(`/logs/${id}`);
      return data;
    } catch {
      enqueueSnackbar('Erro ao carregar detalhes do log', { variant: 'error' });
      return null;
    }
  }, [enqueueSnackbar]);

  return {
    // Data
    logs,
    pagination,
    stats,
    filters,
    
    // Loading states
    loading,
    statsLoading,
    
    // Actions
    fetchLogs,
    fetchStats,
    fetchLogDetail,
    updateFilters,
    resetFilters,
    goToPage,

    // Legacy compatibility
    logsList: logs
  };
}
