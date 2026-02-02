import { useState, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import api from '../../../config/api';
import { MESSAGES } from '../constants';

export default function useLocations() {
  const { enqueueSnackbar } = useSnackbar();

  const [locationsList, setLocationsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [importModalOpen, setImportModalOpen] = useState(false);

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

  const handleImport = async (locationsData) => {
    try {
      let successCount = 0;
      let errorCount = 0;
      
      for (const location of locationsData) {
        try {
          await api.post('/locations', location);
          successCount++;
        } catch (err) {
          errorCount++;
          console.error('Erro ao importar location:', location.name, err);
        }
      }
      
      if (successCount > 0) {
        enqueueSnackbar(`${successCount} local(is) importado(s) com sucesso`, { variant: 'success' });
      }
      if (errorCount > 0) {
        enqueueSnackbar(`${errorCount} local(is) falharam na importação`, { variant: 'error' });
      }
      
      fetchLocations();
      return successCount > 0;
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || MESSAGES.SAVE_ERROR, { variant: 'error' });
      return false;
    }
  };

  const handleExportCSV = () => {
    if (locationsList.length === 0) {
      enqueueSnackbar('Não há locais para exportar', { variant: 'warning' });
      return;
    }

    const csvData = locationsList.map(location => ({
      name: location.name || '',
      description: location.description || ''
    }));

    const Papa = require('papaparse');
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `locais_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    enqueueSnackbar('CSV exportado com sucesso', { variant: 'success' });
  };

  const downloadTemplate = () => {
    const templateData = [
      { name: 'Floresta Sombria', description: 'Uma floresta perigosa cheia de criaturas hostis' },
      { name: 'Vila do Porto', description: 'Um vilarejo comercial próximo ao mar' }
    ];

    const Papa = require('papaparse');
    const csv = Papa.unparse(templateData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'template_locais.csv';
    link.click();
  };

  return {
    locationsList,
    loading,
    fetchLocations,
    handleDelete,
    handleSave,
    handleDeleteIcon,
    handleImport,
    handleExportCSV,
    downloadTemplate,
    importModalOpen,
    setImportModalOpen
  };
}
