import { useCallback, useState } from 'react';
import { useSnackbar } from 'notistack';
import api from '../../../config/api';
import { MESSAGES } from '../constants';

export default function useLogs() {
  const { enqueueSnackbar } = useSnackbar();

  const [logsList, setLogsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/logs');
      const normalized = data.map(l => ({
        ...l,
        userId: l.userId ?? l.user?._id ?? null,
        userName: l.userName ?? l.user?.username ?? '—',
        timestamp: l.timestamp
      }));
      setLogsList(normalized);
    } catch {
      enqueueSnackbar(MESSAGES.FETCH_ERROR, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  return {
    logsList,
    loading,
    fetchLogs
  };
}
