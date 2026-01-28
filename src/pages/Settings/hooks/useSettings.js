import { useState, useEffect, useCallback } from 'react';
import api from '../../../config/api';

export const useSettings = ({ onLogout }) => {
  const [servers, setServers] = useState([]);
  const [config, setConfig] = useState({});
  const [loadingServers, setLoadingServers] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState('');

  // Carrega lista de servidores
  useEffect(() => {
    let mounted = true;

    const loadServers = async () => {
      setLoadingServers(true);
      try {
        const res = await api.get('/admin/servers');
        if (mounted) {
          setServers(res.data || []);
        }
      } catch (err) {
        if (err.response?.status === 401) onLogout();
      } finally {
        if (mounted) setLoadingServers(false);
      }
    };

    loadServers();
    return () => {
      mounted = false;
    };
  }, [onLogout]);

  const loadConfig = useCallback(
    async (slug) => {
      if (!slug) return;
      setLoading(true);
      try {
        const res = await api.get(`/server-config/${slug}`);
        setConfig(res.data || {});
        localStorage.setItem('selectedServerSlug', slug);
      } catch (err) {
        if (err.response?.status === 401) onLogout();
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [onLogout]
  );

  const saveConfig = useCallback(
    async (slug, data) => {
      if (!slug) throw new Error('Slug é obrigatório');
      setSaving(true);
      try {
        await api.put(`/admin/server-config/${slug}`, data);
        setConfig(data);
      } catch (err) {
        if (err.response?.status === 401) onLogout();
        throw err;
      } finally {
        setSaving(false);
      }
    },
    [onLogout]
  );

  return {
    state: {
      servers,
      config,
      loadingServers,
      loading,
      saving,
      selectedSlug,
    },
    functions: {
      loadConfig,
      saveConfig,
      setConfig,
      setSelectedSlug,
    },
  };
};
