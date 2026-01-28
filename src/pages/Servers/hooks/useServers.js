import { useState, useEffect, useCallback } from 'react';
import api from '../../../config/api';

export const useServers = ({ onLogout }) => {
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchServers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/servers');
      setServers(res.data);
    } catch (err) {
      if (err.response?.status === 401) onLogout();
      throw err;
    } finally {
      setLoading(false);
    }
  }, [onLogout]);

  useEffect(() => {
    fetchServers();
  }, [fetchServers]);

  const handleDeleteServer = async (slug) => {
    try {
      await api.delete(`/admin/servers/${slug}`);
      await fetchServers();
    } catch (err) {
      if (err.response?.status === 401) onLogout();
      throw err;
    }
  };

  const handleSaveServer = async (data) => {
    try {
      if (data._id) {
        await api.put(`/admin/servers/${data.slug}`, data);
      } else {
        await api.post('/admin/servers', data);
      }
      await fetchServers();
    } catch (err) {
      if (err.response?.status === 401) onLogout();
      throw err;
    }
  };

  return {
    state: { servers, loading },
    functions: { fetchServers, handleDeleteServer, handleSaveServer },
  };
};
