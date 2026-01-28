// src/pages/Users/hooks/useUsers.js

import { useState, useCallback, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import api from '../../../config/api';
import { filterUsers, countUsersByStatus, exportUsersToCSV } from '../utils';
import { ITEMS_PER_PAGE, USER_STATUS } from '../constants';

export function useUsers() {
  const { enqueueSnackbar } = useSnackbar();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [searchName, setSearchName] = useState('');
  const [filterStatus, setFilterStatus] = useState(USER_STATUS.ALL);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) {
      enqueueSnackbar('Erro ao carregar usuários.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Confirma exclusão do usuário?')) return;
    try {
      await api.delete(`/users/${id}`);
      enqueueSnackbar('Usuário removido.', { variant: 'info' });
      setPage(0);
      fetchUsers();
    } catch {
      enqueueSnackbar('Erro ao remover usuário.', { variant: 'error' });
    }
  };

  const handleExportCSV = () => {
    const result = exportUsersToCSV(users);
    if (result === null) {
      enqueueSnackbar('Nenhum usuário para exportar', { variant: 'warning' });
    } else {
      enqueueSnackbar('Exportado com sucesso!', { variant: 'success' });
    }
  };

  const handleSearch = (value) => {
    setSearchName(value);
    setPage(0);
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    setPage(0);
  };

  // Filtros
  const filtered = filterUsers(users, searchName, filterStatus);
  const pageCount = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const pageItems = filtered.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  // Contadores
  const totalCount = users.length;
  const activeCount = countUsersByStatus(users, USER_STATUS.ACTIVE);
  const bannedCount = countUsersByStatus(users, USER_STATUS.BANNED);
  const pendingCount = countUsersByStatus(users, USER_STATUS.PENDING);

  return {
    users,
    loading,
    page,
    setPage,
    searchName,
    filterStatus,
    handleSearch,
    handleFilterChange,
    handleDelete,
    handleExportCSV,
    filtered,
    pageItems,
    pageCount,
    totalCount,
    activeCount,
    bannedCount,
    pendingCount,
  };
}
