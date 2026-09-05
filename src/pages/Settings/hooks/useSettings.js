import { useState, useEffect, useCallback } from 'react';
import api from '../../../config/api';
import { CONFIG_DEFAULTS } from '../constants';

// Config agora é ÚNICA e GLOBAL — não há mais seleção de servidor.
// Ver docs/prd-migracao-equipes.md [R12].
export const useSettings = ({ onLogout }) => {
  const [config, setConfig] = useState(CONFIG_DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadConfig = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/game-config');
      setConfig({ ...CONFIG_DEFAULTS, ...res.data });
    } catch (err) {
      if (err.response?.status === 401) onLogout();
      throw err;
    } finally {
      setLoading(false);
    }
  }, [onLogout]);

  useEffect(() => {
    loadConfig().catch(() => {});
  }, [loadConfig]);

  const saveConfig = useCallback(
    async (data) => {
      setSaving(true);
      try {
        const { _id, kind, key, server, __v, createdAt, updatedAt, stats, ...cleanData } = data;
        await api.put('/admin/game-config', cleanData);
        await loadConfig();
      } catch (err) {
        if (err.response?.status === 401) onLogout();
        throw err;
      } finally {
        setSaving(false);
      }
    },
    [onLogout, loadConfig]
  );

  return {
    state: {
      config,
      loading,
      saving,
    },
    functions: {
      loadConfig,
      saveConfig,
      setConfig,
    },
  };
};
