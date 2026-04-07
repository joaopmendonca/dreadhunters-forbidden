import { useCallback, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import api from '../../../config/api';
import { EMPTY_FORM } from '../constants';

export function useQuestActionTypes() {
  const { enqueueSnackbar } = useSnackbar();

  const [actionTypes, setActionTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const fetchActionTypes = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/quest-action-types');
      setActionTypes(data);
    } catch {
      enqueueSnackbar('Erro ao buscar tipos de ação', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    fetchActionTypes();
  }, [fetchActionTypes]);

  const handleNew = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Confirma exclusão deste tipo de ação?')) return;
    try {
      await api.delete(`/quest-action-types/${id}`);
      enqueueSnackbar('Tipo de ação excluído!', { variant: 'success' });
      fetchActionTypes();
    } catch {
      enqueueSnackbar('Erro ao excluir tipo de ação', { variant: 'error' });
    }
  };

  const handleSave = async (formData, id) => {
    try {
      if (id) {
        await api.put(`/quest-action-types/${id}`, formData);
        enqueueSnackbar('Tipo de ação atualizado!', { variant: 'success' });
      } else {
        await api.post('/quest-action-types', formData);
        enqueueSnackbar('Tipo de ação criado!', { variant: 'success' });
      }
      fetchActionTypes();
      setModalOpen(false);
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || 'Erro ao salvar', { variant: 'error' });
      throw err;
    }
  };

  return {
    actionTypes,
    loading,
    modalOpen,
    setModalOpen,
    editingItem,
    handleNew,
    handleEdit,
    handleDelete,
    handleSave
  };
}
