import { useState, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import api from '../../../config/api';
import { MESSAGES } from '../constants';

export default function useQuests() {
  const { enqueueSnackbar } = useSnackbar();

  const [questsList, setQuestsList] = useState([]);
  const [itemsList, setItemsList] = useState([]);
  const [enemiesList, setEnemiesList] = useState([]);
  const [npcsList, setNpcsList] = useState([]);
  const [locationsList, setLocationsList] = useState([]);
  const [currenciesList, setCurrenciesList] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [importModalOpen, setImportModalOpen] = useState(false);

  const fetchQuests = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/quests');
      setQuestsList(data);
    } catch {
      enqueueSnackbar(MESSAGES.FETCH_ERROR, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  const fetchMeta = useCallback(async () => {
    setLoadingMeta(true);
    try {
      const [itRes, crRes, enRes, chRes, loRes] = await Promise.allSettled([
        api.get('/items'),
        api.get('/currency'),
        api.get('/enemies'),
        api.get('/characters'),
        api.get('/locations'),
      ]);

      if (itRes.status === 'fulfilled') setItemsList(itRes.value.data);
      if (crRes.status === 'fulfilled') setCurrenciesList(crRes.value.data);
      if (enRes.status === 'fulfilled') setEnemiesList(enRes.value.data);
      if (chRes.status === 'fulfilled') setNpcsList(chRes.value.data.filter(c => c.type === 'npc'));
      if (loRes.status === 'fulfilled') setLocationsList(loRes.value.data);
    } catch {
      enqueueSnackbar(MESSAGES.FETCH_META_ERROR, { variant: 'error' });
    } finally {
      setLoadingMeta(false);
    }
  }, [enqueueSnackbar]);

  const handleDelete = async id => {
    if (!window.confirm(MESSAGES.DELETE_CONFIRM)) return;
    try {
      await api.delete(`/quests/${id}`);
      enqueueSnackbar(MESSAGES.DELETE_SUCCESS, { variant: 'success' });
      fetchQuests();
    } catch {
      enqueueSnackbar(MESSAGES.DELETE_ERROR, { variant: 'error' });
    }
  };

  const handleSave = async (fd, id) => {
    try {
      if (id) {
        await api.put(`/quests/${id}`, fd);
        enqueueSnackbar(MESSAGES.SAVE_SUCCESS_UPDATE, { variant: 'success' });
      } else {
        await api.post('/quests', fd);
        enqueueSnackbar(MESSAGES.SAVE_SUCCESS_CREATE, { variant: 'success' });
      }
      fetchQuests();
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || MESSAGES.SAVE_ERROR, { variant: 'error' });
      throw err;
    }
  };

  const handleDeleteIcon = async id => {
    try {
      await api.delete(`/quests/${id}/icon`);
      enqueueSnackbar(MESSAGES.ICON_DELETE_SUCCESS, { variant: 'success' });
      fetchQuests();
    } catch {
      enqueueSnackbar(MESSAGES.ICON_DELETE_ERROR, { variant: 'error' });
    }
  };

  const handleImport = async (questsData) => {
    try {
      let successCount = 0;
      let errorCount = 0;
      
      for (const quest of questsData) {
        try {
          await api.post('/quests', quest);
          successCount++;
        } catch (err) {
          errorCount++;
          console.error('Erro ao importar quest:', quest.title, err);
        }
      }
      
      if (successCount > 0) {
        enqueueSnackbar(`${successCount} quest(s) importada(s) com sucesso`, { variant: 'success' });
      }
      if (errorCount > 0) {
        enqueueSnackbar(`${errorCount} quest(s) falharam na importação`, { variant: 'error' });
      }
      
      await fetchQuests();
      return successCount > 0;
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || MESSAGES.SAVE_ERROR, { variant: 'error' });
      return false;
    }
  };

  const handleExportCSV = () => {
    if (questsList.length === 0) {
      enqueueSnackbar('Nenhuma quest para exportar', { variant: 'warning' });
      return;
    }

    const lines = ['title,type,description,levelRequirement'];
    for (const quest of questsList) {
      lines.push([
        `"${(quest.title || '').replace(/"/g, '""')}"`,
        quest.type || 'side',
        `"${(quest.description || '').replace(/"/g, '""')}"`,
        quest.levelRequirement || 1
      ].join(','));
    }

    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'quests-export.csv';
    link.click();
    enqueueSnackbar('Exportado com sucesso!', { variant: 'success' });
  };

  const downloadTemplate = () => {
    const csv = `title,type,description,levelRequirement
"A Primeira Missão","main","Complete esta missão tutorial","1"
"Coletar Ervas","side","Colete 10 ervas medicinais","5"`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'template-quests.csv';
    link.click();
  };

  return {
    questsList,
    itemsList,
    enemiesList,
    npcsList,
    locationsList,
    currenciesList,
    loading,
    loadingMeta,
    fetchQuests,
    fetchMeta,
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
