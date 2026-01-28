import { useCallback, useState } from 'react';
import { useSnackbar } from 'notistack';
import api from '../../../config/api';
import { MESSAGES } from '../constants';

export default function useItems() {
  const [itemsList, setItemsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/items');
      setItemsList(data);
    } catch (err) {
      enqueueSnackbar(MESSAGES.FETCH_ERROR, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  const handleDelete = async (id) => {
    if (!window.confirm(MESSAGES.DELETE_CONFIRM)) return;
    try {
      await api.delete(`/items/${id}`);
      enqueueSnackbar(MESSAGES.DELETE_SUCCESS, { variant: 'success' });
      fetchItems();
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
        await api.put(`/items/${id}`, formData);
        enqueueSnackbar(MESSAGES.SAVE_SUCCESS_UPDATE, { variant: 'success' });
      } else {
        await api.post('/items', formData);
        enqueueSnackbar(MESSAGES.SAVE_SUCCESS_CREATE, { variant: 'success' });
      }
      fetchItems();
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
      await api.delete(`/items/${id}/icon`);
      enqueueSnackbar(MESSAGES.ICON_DELETE_SUCCESS, { variant: 'success' });
      fetchItems();
    } catch (err) {
      enqueueSnackbar(MESSAGES.ICON_DELETE_ERROR, { variant: 'error' });
      throw err;
    }
  };

  return {
    itemsList,
    loading,
    fetchItems,
    handleDelete,
    handleSave,
    handleDeleteIcon
  };
}
