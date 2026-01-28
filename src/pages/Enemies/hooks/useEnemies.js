import { useCallback, useState } from 'react';
import { useSnackbar } from 'notistack';
import api from '../../../config/api';
import { MESSAGES } from '../constants';

export default function useEnemies() {
  const [enemiesList, setEnemiesList] = useState([]);
  const [itemsList, setItemsList] = useState([]);
  const [currenciesList, setCurrenciesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMeta, setLoadingMeta] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  const fetchEnemies = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/enemies');
      setEnemiesList(data);
    } catch (err) {
      enqueueSnackbar(MESSAGES.FETCH_ERROR, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  const fetchMeta = useCallback(async () => {
    setLoadingMeta(true);
    try {
      const [itemsRes, currenciesRes] = await Promise.all([
        api.get('/items'),
        api.get('/currency')
      ]);
      setItemsList(itemsRes.data);
      setCurrenciesList(currenciesRes.data);
    } catch (err) {
      enqueueSnackbar(MESSAGES.FETCH_META_ERROR, { variant: 'error' });
    } finally {
      setLoadingMeta(false);
    }
  }, [enqueueSnackbar]);

  const handleDelete = async (id) => {
    if (!window.confirm(MESSAGES.DELETE_CONFIRM)) return;
    try {
      await api.delete(`/enemies/${id}`);
      enqueueSnackbar(MESSAGES.DELETE_SUCCESS, { variant: 'success' });
      fetchEnemies();
    } catch (err) {
      enqueueSnackbar(
        err.response?.data?.message || MESSAGES.DELETE_ERROR,
        { variant: 'error' }
      );
    }
  };

  const handleSave = async (formData, id) => {
    try {
      if (id) {
        await api.put(`/enemies/${id}`, formData);
        enqueueSnackbar(MESSAGES.SAVE_SUCCESS_UPDATE, { variant: 'success' });
      } else {
        await api.post('/enemies', formData);
        enqueueSnackbar(MESSAGES.SAVE_SUCCESS_CREATE, { variant: 'success' });
      }
      fetchEnemies();
    } catch (err) {
      enqueueSnackbar(
        err.response?.data?.message || MESSAGES.SAVE_ERROR,
        { variant: 'error' }
      );
      throw err;
    }
  };

  const handleDeleteIcon = async (id) => {
    try {
      await api.delete(`/enemies/${id}/icon`);
      enqueueSnackbar(MESSAGES.ICON_DELETE_SUCCESS, { variant: 'success' });
      fetchEnemies();
    } catch (err) {
      enqueueSnackbar(MESSAGES.ICON_DELETE_ERROR, { variant: 'error' });
      throw err;
    }
  };

  return {
    enemiesList,
    itemsList,
    currenciesList,
    loading,
    loadingMeta,
    fetchEnemies,
    fetchMeta,
    handleDelete,
    handleSave,
    handleDeleteIcon
  };
}
