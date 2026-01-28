import { useEffect, useState } from 'react';
import BaseLayout from '../../../shared/components/BaseLayout';
import Card from '../../../shared/components/Card';
import EmptyState from '../../../shared/components/EmptyState';
import Pagination from '../../../shared/components/Pagination';
import useLogs from '../hooks/useLogs';
import LogsHeader from './LogsHeader';
import LogCard from './LogCard';
import LoadingState from './LoadingState';

const ITEMS_PER_PAGE = 10;

export default function LogsPage() {
  const { logsList, loading, fetchLogs } = useLogs();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [page, setPage] = useState(0);

  useEffect(() => {
    fetchLogs();
  }, []);

  // Extrai tipos de ação únicos dos logs
  const actionOptions = Array.from(new Set(logsList.map(l => l.action))).map(action => ({
    value: action,
    label: action
  }));

  // Calcula cutoff para período selecionado
  const now = Date.now();
  const cutoff = filterPeriod === '24h'
    ? now - 24 * 60 * 60 * 1000
    : filterPeriod === '7d'
      ? now - 7 * 24 * 60 * 60 * 1000
      : filterPeriod === '30d'
        ? now - 30 * 24 * 60 * 60 * 1000
        : 0;

  // Filtra logs
  const filtered = logsList.filter(log => {
    const matchesSearch = log.action?.toLowerCase().includes(searchTerm.toLowerCase())
      || log.userName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = !filterAction || log.action === filterAction;
    const ts = new Date(log.timestamp).getTime();
    const matchesPeriod = !cutoff || ts >= cutoff;
    return matchesSearch && matchesAction && matchesPeriod;
  });

  const pageCount = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const pageItems = filtered.slice(
    page * ITEMS_PER_PAGE,
    (page + 1) * ITEMS_PER_PAGE
  );

  return (
    <BaseLayout title="Logs de Atividade">
      <LogsHeader
        totalCount={logsList.length}
        searchTerm={searchTerm}
        onSearchChange={value => {
          setSearchTerm(value);
          setPage(0);
        }}
        filterAction={filterAction}
        onActionChange={value => {
          setFilterAction(value);
          setPage(0);
        }}
        actionOptions={actionOptions}
        filterPeriod={filterPeriod}
        onPeriodChange={value => {
          setFilterPeriod(value);
          setPage(0);
        }}
      />

      {loading ? (
        <LoadingState />
      ) : (
        <>
          {pageItems.length === 0 && searchTerm === '' && filterAction === '' && filterPeriod === 'all' ? (
            <EmptyState
              icon="📋"
              title="Nenhum log encontrado"
              message="Não há registros de atividade no sistema"
            />
          ) : pageItems.length === 0 ? (
            <EmptyState
              icon="🔍"
              title="Nenhum log encontrado"
              message="Tente ajustar seus filtros ou busca"
            />
          ) : (
            <>
              <Card.Grid minWidth="300px">
                {pageItems.map(log => (
                  <LogCard key={log._id} log={log} />
                ))}
              </Card.Grid>

              {pageCount > 1 && (
                <Pagination
                  currentPage={page}
                  totalPages={pageCount}
                  onPageChange={setPage}
                />
              )}
            </>
          )}
        </>
      )}
    </BaseLayout>
  );
}
