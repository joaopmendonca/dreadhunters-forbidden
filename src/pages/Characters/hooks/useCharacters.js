// src/pages/Characters/hooks/useCharacters.js

import { useState, useCallback, useEffect, useContext, useRef } from 'react';
import { useSnackbar } from 'notistack';
import api from '../../../config/api';
import { AuthContext } from '../../../shared/contexts/AuthContext';
import {
  parseCSV,
  exportCharactersToCSV,
  downloadCSVTemplate,
  filterCharacters,
  mapCharactersWithClass
} from '../utils';
import { ITEMS_PER_PAGE, DEFAULT_GENDER } from '../constants';

export function useCharacters() {
  const { logout } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const fileInputRef = useRef(null);

  const [characters, setCharacters] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

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

  const handleCSVUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      enqueueSnackbar('Selecione um arquivo CSV', { variant: 'error' });
      return;
    }

    if (classes.length === 0) {
      enqueueSnackbar('Carregue as classes primeiro', { variant: 'error' });
      return;
    }

    setUploading(true);
    try {
      const text = await file.text();
      const npcData = parseCSV(text);

      let created = 0;
      let errors = 0;

      for (const npc of npcData) {
        try {
          const classObj = classes.find(c => c.name.toLowerCase() === npc.class?.toLowerCase());
          const payload = {
            name: npc.name,
            description: npc.description || '',
            class: classObj?._id || classes[0]?._id,
            level: parseInt(npc.level, 10) || 1,
            gender: npc.gender || DEFAULT_GENDER
          };
          await api.post('/characters', payload);
          created++;
        } catch {
          errors++;
        }
      }

      enqueueSnackbar(`Importação: ${created} criados, ${errors} erros`, 
        { variant: created > 0 ? 'success' : 'warning' });
      fetchData();
    } catch {
      enqueueSnackbar('Erro ao processar CSV', { variant: 'error' });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
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
    uploading,
    page,
    setPage,
    searchName,
    filterClass,
    modalOpen,
    setModalOpen,
    editingCharacter,
    fileInputRef,
    handleNew,
    handleEdit,
    handleDelete,
    handleSave,
    handleCSVUpload,
    handleDownloadTemplate,
    handleExportCSV,
    handleSearch,
    handleFilterChange,
    handleIconDeleted,
    filtered,
    pageItems,
    pageCount,
    totalCount,
  };
}
