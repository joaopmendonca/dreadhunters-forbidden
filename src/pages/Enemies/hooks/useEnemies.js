import { useCallback, useState } from 'react';
import { useSnackbar } from 'notistack';
import Papa from 'papaparse';
import api from '../../../config/api';
import { MESSAGES } from '../constants';
import { useStatus } from '../../../shared/hooks/useStatus';

export default function useEnemies() {
  const [enemiesList, setEnemiesList] = useState([]);
  const [itemsList, setItemsList] = useState([]);
  const [currenciesList, setCurrenciesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMeta, setLoadingMeta] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const { baseStatus } = useStatus();

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

  // Import de inimigos via CSV
  const handleImportEnemies = async (enemies) => {
    let created = 0;
    let errors = 0;

    for (const enemy of enemies) {
      try {
        await api.post('/enemies', enemy);
        created++;
      } catch (error) {
        console.error('Error importing enemy:', enemy, error);
        errors++;
      }
    }

    const message = `Importação concluída: ${created} inimigo(s) criado(s), ${errors} erro(s).`;
    enqueueSnackbar(message, { variant: created > 0 ? 'success' : 'warning' });
    fetchEnemies();
  };

  // Export CSV
  const handleExportCSV = () => {
    if (enemiesList.length === 0) {
      enqueueSnackbar('Não há inimigos para exportar.', { variant: 'warning' });
      return;
    }

    if (!baseStatus || baseStatus.length === 0) {
      enqueueSnackbar('Aguarde o carregamento dos atributos do sistema.', { variant: 'warning' });
      return;
    }

    const basicHeaders = ['name', 'description', 'type', 'level', 'xpReward'];
    const statHeaders = baseStatus.map(s => s.nome);
    const headers = [...basicHeaders, ...statHeaders];

    const rows = enemiesList.map(enemy => {
      const row = {
        name: enemy.name || '',
        description: enemy.description || '',
        type: enemy.type || 'normal',
        level: enemy.level || 1,
        xpReward: enemy.xpReward || 0
      };

      // Stats dinâmicos (podem ser Map ou Object)
      const statsObj = enemy.stats instanceof Map 
        ? Object.fromEntries(enemy.stats) 
        : (enemy.stats || {});
      
      baseStatus.forEach(status => {
        row[status.nome] = statsObj[status.nome] || 0;
      });

      return row;
    });

    const csv = Papa.unparse({ fields: headers, data: rows });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `enemies_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    enqueueSnackbar('Inimigos exportados com sucesso!', { variant: 'success' });
  };

  // Download template
  const handleDownloadTemplate = () => {
    if (!baseStatus || baseStatus.length === 0) {
      enqueueSnackbar('Aguarde o carregamento dos atributos do sistema.', { variant: 'warning' });
      return;
    }

    const basicHeaders = ['name', 'description', 'type', 'level', 'xpReward'];
    const statHeaders = baseStatus.map(s => s.nome);
    const headers = [...basicHeaders, ...statHeaders];

    const example = {
      name: 'Goblin',
      description: 'Um pequeno goblin verde',
      type: 'normal',
      level: 1,
      xpReward: 10
    };

    baseStatus.forEach(status => {
      example[status.nome] = 5;
    });

    const csv = Papa.unparse({ fields: headers, data: [example] });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'enemies_template.csv';
    link.click();

    enqueueSnackbar('Template baixado com sucesso!', { variant: 'success' });
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
    handleDeleteIcon,
    handleImportEnemies,
    handleExportCSV,
    handleDownloadTemplate
  };
}
