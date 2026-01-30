import { useCallback, useState } from 'react';
import { useSnackbar } from 'notistack';
import api from '../../../config/api';
import { MESSAGES } from '../constants';

export default function useCurrency() {
  const [currencyList, setCurrencyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  const fetchCurrencies = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/currency');
      setCurrencyList(data);
    } catch (err) {
      enqueueSnackbar(MESSAGES.FETCH_ERROR, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  const handleDelete = async (id) => {
    if (!window.confirm(MESSAGES.DELETE_CONFIRM)) return;
    try {
      await api.delete(`/currency/${id}`);
      enqueueSnackbar(MESSAGES.DELETE_SUCCESS, { variant: 'success' });
      fetchCurrencies();
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
        await api.put(`/currency/${id}`, formData);
        enqueueSnackbar(MESSAGES.SAVE_SUCCESS_UPDATE, { variant: 'success' });
      } else {
        await api.post('/currency', formData);
        enqueueSnackbar(MESSAGES.SAVE_SUCCESS_CREATE, { variant: 'success' });
      }
      fetchCurrencies();
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
      await api.delete(`/currency/${id}/icon`);
      enqueueSnackbar(MESSAGES.ICON_DELETE_SUCCESS, { variant: 'success' });
      fetchCurrencies();
    } catch (err) {
      enqueueSnackbar(MESSAGES.ICON_DELETE_ERROR, { variant: 'error' });
      throw err;
    }
  };

  // Importação em lote
  const handleImportCurrencies = async (currencies) => {
    try {
      let created = 0;
      let errors = 0;
      
      for (const currency of currencies) {
        try {
          await api.post('/currency', currency);
          created++;
        } catch (err) {
          errors++;
          console.error(`Erro ao importar ${currency.name}:`, err);
        }
      }
      
      enqueueSnackbar(
        `Importação concluída: ${created} criadas, ${errors} erros`,
        { variant: errors > 0 ? 'warning' : 'success' }
      );
      
      return { success: created, errors };
    } catch (err) {
      enqueueSnackbar('Erro na importação', { variant: 'error' });
      throw err;
    }
  };

  // Exportação para CSV
  const handleExportCSV = () => {
    if (currencyList.length === 0) {
      enqueueSnackbar('Nenhuma moeda para exportar', { variant: 'warning' });
      return;
    }

    const headers = ['name', 'symbol', 'slug', 'description'];
    const csvContent = [
      headers.join(','),
      ...currencyList.map(currency => 
        headers.map(h => {
          const value = currency[h] || '';
          return `"${String(value).replace(/"/g, '""')}"`;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'moedas-export.csv';
    link.click();
    
    enqueueSnackbar('CSV exportado com sucesso', { variant: 'success' });
  };

  // Download do template
  const handleDownloadTemplate = () => {
    const headers = ['name', 'symbol', 'slug', 'description'];
    const example = ['Ouro', 'G', 'gold', 'Moeda principal do jogo'];
    const csvContent = [headers.join(','), example.join(',')].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'moedas-template.csv';
    link.click();
    
    enqueueSnackbar('Template baixado com sucesso', { variant: 'success' });
  };

  return {
    currencyList,
    loading,
    fetchCurrencies,
    handleDelete,
    handleSave,
    handleDeleteIcon,
    handleImportCurrencies,
    handleExportCSV,
    handleDownloadTemplate
  };
}
