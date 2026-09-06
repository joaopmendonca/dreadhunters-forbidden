// src/pages/PlayableCharacters/hooks/usePlayableCharacters.js

import { useCallback, useContext, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import api from '../../../config/api';
import { AuthContext } from '../../../shared/contexts/AuthContext';
import { MESSAGES, ITEMS_PER_PAGE } from '../constants';
import { mapWithClass, filterTemplates } from '../utils';

export function usePlayableCharacters() {
  const { logout } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();

  const [templates, setTemplates] = useState([]);
  const [classes, setClasses] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [page, setPage] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    let classesData = [];
    try {
      const res = await api.get('/classes');
      classesData = res.data || [];
      setClasses(classesData);
    } catch {
      enqueueSnackbar('Falha ao carregar classes.', { variant: 'error' });
    }
    try {
      const res = await api.get('/items');
      setItems(res.data || []);
    } catch {
      enqueueSnackbar('Falha ao carregar itens.', { variant: 'error' });
    }
    try {
      const res = await api.get('/character-templates');
      setTemplates(mapWithClass(res.data || [], classesData));
    } catch (err) {
      if (err.response?.status === 401) logout();
      else enqueueSnackbar(MESSAGES.FETCH_ERROR, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [logout, enqueueSnackbar]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleNew = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleEdit = (tpl) => {
    setEditing(tpl);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm(MESSAGES.DELETE_CONFIRM)) return;
    try {
      await api.delete(`/character-templates/${id}`);
      enqueueSnackbar(MESSAGES.DELETE_SUCCESS, { variant: 'info' });
      setPage(0);
      fetchData();
    } catch (err) {
      if (err.response?.status === 401) logout();
      else enqueueSnackbar(err.response?.data?.message || MESSAGES.DELETE_ERROR, { variant: 'error' });
    }
  };

  const handleSave = async (payload, id) => {
    const isForm = payload instanceof FormData;
    try {
      if (id) {
        await api.put(`/character-templates/${id}`, payload, isForm ? { headers: { 'Content-Type': 'multipart/form-data' } } : {});
        enqueueSnackbar(MESSAGES.SAVE_SUCCESS_UPDATE, { variant: 'success' });
      } else {
        await api.post('/character-templates', payload, isForm ? { headers: { 'Content-Type': 'multipart/form-data' } } : {});
        enqueueSnackbar(MESSAGES.SAVE_SUCCESS_CREATE, { variant: 'success' });
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      if (err.response?.status === 401) logout();
      else {
        enqueueSnackbar(err.response?.data?.message || MESSAGES.SAVE_ERROR, { variant: 'error' });
        throw err;
      }
    }
  };

  // Import CSV — client-side, um POST por linha (padrão dos Inimigos/NPCs).
  const handleImport = async (rows) => {
    let created = 0;
    let errors = 0;
    for (const row of rows) {
      try {
        let classId = null;
        if (row.class && row.class.trim()) {
          const cls = classes.find((c) => c.name.toLowerCase() === row.class.toLowerCase());
          if (cls) classId = cls._id;
        }
        if (!classId) { errors++; console.error('Import: classe obrigatória e não encontrada', row); continue; }
        const payload = {
          name: row.name?.trim(),
          description: row.description?.trim() || '',
          class: classId,
          baseLevel: parseInt(row.baseLevel, 10) || 1,
          gender: row.gender?.trim() || 'male',
          unlockRule: { type: row.unlockType?.trim() || 'starter' },
        };
        await api.post('/character-templates', payload);
        created++;
      } catch (e) {
        console.error('Erro ao importar personagem jogável:', row, e);
        errors++;
      }
    }
    if (created > 0) enqueueSnackbar(`${created} personagem(ns) importado(s).`, { variant: 'success' });
    if (errors > 0) enqueueSnackbar(`${errors} erro(s) na importação. Veja o console.`, { variant: 'warning' });
    fetchData();
  };

  const filtered = filterTemplates(templates, search, classFilter);
  const pageCount = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const pageItems = filtered.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  return {
    templates,
    classes,
    items,
    loading,
    search,
    setSearch: (v) => { setSearch(v); setPage(0); },
    classFilter,
    setClassFilter: (v) => { setClassFilter(v); setPage(0); },
    page,
    setPage,
    pageCount,
    pageItems,
    filtered,
    totalCount: templates.length,
    modalOpen,
    setModalOpen,
    editing,
    handleNew,
    handleEdit,
    handleDelete,
    handleSave,
    handleImport,
    fetchData,
  };
}
