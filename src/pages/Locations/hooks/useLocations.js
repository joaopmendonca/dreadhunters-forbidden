import { useState, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import api from '../../../config/api';
import { MESSAGES } from '../constants';

export default function useLocations() {
  const { enqueueSnackbar } = useSnackbar();

  const [locationsList, setLocationsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLocations = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/locations');
      setLocationsList(data);
    } catch {
      enqueueSnackbar(MESSAGES.FETCH_ERROR, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  const handleDelete = async id => {
    if (!window.confirm(MESSAGES.DELETE_CONFIRM)) return;
    try {
      await api.delete(`/locations/${id}`);
      enqueueSnackbar(MESSAGES.DELETE_SUCCESS, { variant: 'success' });
      fetchLocations();
    } catch {
      enqueueSnackbar(MESSAGES.DELETE_ERROR, { variant: 'error' });
    }
  };

  const handleSave = async (fd, id) => {
    try {
      if (id) {
        await api.put(`/locations/${id}`, fd);
        enqueueSnackbar(MESSAGES.SAVE_SUCCESS_UPDATE, { variant: 'success' });
      } else {
        await api.post('/locations', fd);
        enqueueSnackbar(MESSAGES.SAVE_SUCCESS_CREATE, { variant: 'success' });
      }
      fetchLocations();
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || MESSAGES.SAVE_ERROR, { variant: 'error' });
      throw err;
    }
  };

  const handleDeleteIcon = async id => {
    try {
      await api.delete(`/locations/${id}/icon`);
      enqueueSnackbar(MESSAGES.ICON_DELETE_SUCCESS, { variant: 'success' });
      fetchLocations();
    } catch {
      enqueueSnackbar(MESSAGES.ICON_DELETE_ERROR, { variant: 'error' });
    }
  };

  return {
    locationsList,
    loading,
    fetchLocations,
    handleDelete,
    handleSave,
    handleDeleteIcon
  };
}
