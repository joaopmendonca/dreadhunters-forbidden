// src/pages/Characters/hooks/useCharacters.js

import { useState, useCallback, useEffect, useContext } from 'react';
import { useSnackbar } from 'notistack';
import api from '../../../config/api';
import { AuthContext } from '../../../shared/contexts/AuthContext';
import {
  exportCharactersToCSV,
  downloadCSVTemplate,
  filterCharacters,
  mapCharactersWithClass
} from '../utils';
import { ITEMS_PER_PAGE } from '../constants';

export function useCharacters() {
  const { logout } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();

  const [characters, setCharacters] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterClass, setFilterClass] = useState('');
  const [searchName, setSearchName] = useState('');
  const [page, setPage] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCharacter, setEditing] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);

    let classesData = [];
    try {
      const res = await api.get('/classes');
      classesData = res.data;
      setClasses(classesData);
    } catch {
      enqueueSnackbar('Falha ao carregar classes.', { variant: 'error' });
    }

    try {
      const res = await api.get('/characters');
      setCharacters(mapCharactersWithClass(res.data, classesData));
    } catch (err) {
      if (err.response?.status === 401) logout();
      else enqueueSnackbar('Falha ao carregar NPCs.', { variant: 'error' });
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

  const handleEdit = (ch) => {
    setEditing(ch);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Confirma exclusão do NPC?')) return;
    try {
      await api.delete(`/characters/${id}`);
      enqueueSnackbar('NPC removido.', { variant: 'info' });
      setPage(0);
      fetchData();
    } catch (err) {
      if (err.response?.status === 401) logout();
      else enqueueSnackbar('Erro ao remover NPC.', { variant: 'error' });
    }
  };

  const handleSave = async (data) => {
    let payload;
    if (data instanceof FormData) {
      payload = data;
      payload.set('class', data.get('classId'));
      payload.delete('classId');
    } else {
      payload = { ...data, class: data.classId };
    }

    try {
      if (data._id) {
        await api.put(`/characters/${data._id}`, payload, {
          headers:
            data instanceof FormData
              ? { 'Content-Type': 'multipart/form-data' }
              : {}
        });
        enqueueSnackbar('NPC atualizado com sucesso.', { variant: 'success' });
      } else {
        await api.post('/characters', payload, {
          headers:
            data instanceof FormData
              ? { 'Content-Type': 'multipart/form-data' }
              : {}
        });
        enqueueSnackbar('NPC criado com sucesso.', { variant: 'success' });
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      if (err.response?.status === 401) logout();
      else {
        enqueueSnackbar(
          err.response?.data?.message || 'Erro ao salvar NPC.',
          { variant: 'error' }
        );
        throw err;
      }
    }
  };

  const handleImport = async (npcs) => {
    let created = 0;
    let errors = 0;

    for (const npc of npcs) {
      try {
        const classObj = classes.find(c => c.name.toLowerCase() === npc.class?.toLowerCase());
        if (!classObj) {
          console.error(`Classe "${npc.class}" não encontrada para NPC "${npc.name}"`);
          errors++;
          continue;
        }

        const payload = {
          name: npc.name,
          description: npc.description || '',
          class: classObj._id,
          gender: npc.gender || 'male',
          hp: npc.hp || 100,
          mp: npc.mp || 50
        };

        await api.post('/characters', payload);
        created++;
      } catch (error) {
        console.error(`Erro ao importar NPC "${npc.name}":`, error);
        errors++;
      }
    }

    if (created > 0) {
      enqueueSnackbar(`${created} NPC(s) importado(s) com sucesso!`, { variant: 'success' });
    }
    if (errors > 0) {
      enqueueSnackbar(`${errors} erro(s) ao importar. Verifique o console.`, { variant: 'warning' });
    }
  };

  const handleDownloadTemplate = () => {
    downloadCSVTemplate();
  };

  const handleExportCSV = () => {
    const result = exportCharactersToCSV(characters);
    if (result === null) {
      enqueueSnackbar('Nenhum NPC para exportar', { variant: 'warning' });
    } else {
      enqueueSnackbar('Exportado com sucesso!', { variant: 'success' });
    }
  };

  const handleSearch = (value) => {
    setSearchName(value);
    setPage(0);
  };

  const handleFilterChange = (classId) => {
    setFilterClass(classId);
    setPage(0);
  };

  const handleIconDeleted = async (id) => {
    try {
      await api.delete(`/characters/${id}/icon`);
      fetchData();
    } catch (err) {
      enqueueSnackbar('Erro ao remover ícone', { variant: 'error' });
    }
  };

  // Filtros e paginação
  const filtered = filterCharacters(characters, searchName, filterClass);
  const pageCount = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const pageItems = filtered.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  const totalCount = characters.length;

  return {
    characters,
    classes,
    loading,
    page,
    setPage,
    searchName,
    filterClass,
    modalOpen,
    setModalOpen,
    editingCharacter,
    handleNew,
    handleEdit,
    handleDelete,
    handleSave,
    handleImport,
    handleDownloadTemplate,
    handleExportCSV,
    handleSearch,
    handleFilterChange,
    handleIconDeleted,
    fetchData,
    filtered,
    pageItems,
    pageCount,
    totalCount,
  };
}
