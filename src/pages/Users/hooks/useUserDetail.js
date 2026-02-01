// src/pages/Users/hooks/useUserDetail.js

import { useState, useCallback, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import api from '../../../config/api';

export function useUserDetail(userId) {
  const { enqueueSnackbar } = useSnackbar();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [servers, setServers] = useState([]);
  const [serverCache, setServerCache] = useState({});

  // Role editor state
  const [roles, setRoles] = useState([]);
  const [savingRoles, setSavingRoles] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  // Character modal state
  const [charModalOpen, setCharModalOpen] = useState(false);
  const [editingChar, setEditingChar] = useState(null);

  // Delete confirmation state
  const [deleteCharId, setDeleteCharId] = useState(null);

  // Fetch user data
  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/users/${userId}`);
      setUser(res.data);
      setRoles(res.data.roles || []);
    } catch (err) {
      enqueueSnackbar('Erro ao carregar usuário.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [userId, enqueueSnackbar]);

  // Fetch classes for character modal
  const fetchClasses = useCallback(async () => {
    try {
      const res = await api.get('/classes');
      setClasses(res.data || []);
    } catch {
      // ignore
    }
  }, []);

  // Fetch servers for character modal
  const fetchServers = useCallback(async () => {
    try {
      const res = await api.get('/servers');
      setServers(res.data || []);
    } catch {
      // ignore
    }
  }, []);

  // Fetch server name by ID
  const fetchServerName = useCallback(async (serverId) => {
    if (!serverId) return null;
    if (serverCache[serverId]) return serverCache[serverId];

    try {
      const res = await api.get(`/servers/${serverId}`);
      const name = res.data?.name || res.data?.slug || serverId;
      setServerCache(prev => ({ ...prev, [serverId]: name }));
      return name;
    } catch {
      return serverId;
    }
  }, [serverCache]);

  useEffect(() => {
    if (userId) {
      fetchUser();
      fetchClasses();
      fetchServers();
    }
  }, [userId, fetchUser, fetchClasses, fetchServers]);

  // Role management
  const handleToggleAdmin = () => {
    setIsRoleModalOpen(true);
  };

  const confirmToggleAdmin = async () => {
    setSavingRoles(true);
    const isAdmin = roles.includes('admin');
    const newRoles = isAdmin
      ? roles.filter(r => r !== 'admin')
      : [...roles, 'admin'];

    try {
      await api.patch(`/admin/users/${userId}/roles`, { roles: newRoles });
      setRoles(newRoles);
      setUser(prev => ({ ...prev, roles: newRoles }));
      enqueueSnackbar(`Admin ${isAdmin ? 'removido' : 'concedido'} com sucesso.`, { variant: 'success' });
    } catch {
      enqueueSnackbar('Erro ao atualizar roles.', { variant: 'error' });
    } finally {
      setSavingRoles(false);
      setIsRoleModalOpen(false);
    }
  };

  // Character management
  const handleEditCharacter = (char) => {
    setEditingChar(char);
    setCharModalOpen(true);
  };

  const handleSaveCharacter = async (payload) => {
    const isFormData = payload instanceof FormData;
    const id = isFormData ? payload.get('_id') : payload._id;

    if (id) {
      await api.put(`/characters/${id}`, payload, {
        headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
      });
    }
    
    setCharModalOpen(false);
    setEditingChar(null);
    fetchUser();
  };

  const handleDeleteCharacterIcon = async (charId) => {
    await api.delete(`/characters/${charId}/icon`);
    fetchUser();
  };

  const handleDeleteCharacter = async () => {
    if (!deleteCharId) return;
    
    try {
      await api.delete(`/characters/${deleteCharId}`);
      enqueueSnackbar('Personagem excluído com sucesso.', { variant: 'success' });
      setDeleteCharId(null);
      fetchUser();
    } catch {
      enqueueSnackbar('Erro ao excluir personagem.', { variant: 'error' });
    }
  };

  const closeCharModal = () => {
    setCharModalOpen(false);
    setEditingChar(null);
  };

  return {
    // User data
    user,
    loading,
    
    // Classes and servers
    classes,
    servers,
    fetchServerName,
    
    // Role management
    roles,
    savingRoles,
    isRoleModalOpen,
    setIsRoleModalOpen,
    handleToggleAdmin,
    confirmToggleAdmin,
    
    // Character management
    charModalOpen,
    editingChar,
    deleteCharId,
    setDeleteCharId,
    handleEditCharacter,
    handleSaveCharacter,
    handleDeleteCharacterIcon,
    handleDeleteCharacter,
    closeCharModal,
  };
}
