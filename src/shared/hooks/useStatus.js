// src/hooks/useStatus.js
import { useState, useEffect } from 'react';
import api from '../../config/api';

/**
 * Hook para buscar e gerenciar status dinâmicos do sistema
 */
export function useStatus() {
  const [status, setStatus] = useState([]);
  const [baseStatus, setBaseStatus] = useState([]);
  const [derivedStatus, setDerivedStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/status');
      setStatus(data);
      setBaseStatus(data.filter(s => s.tipo === 'base'));
      setDerivedStatus(data.filter(s => s.tipo === 'derivado'));
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar status:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Inicializa um objeto de stats com valores padrão (0)
   */
  const initializeStats = () => {
    const stats = {};
    baseStatus.forEach(s => {
      stats[s.nome] = 0;
    });
    return stats;
  };

  /**
   * Converte stats de Map para objeto
   */
  const normalizeStats = (stats) => {
    if (!stats) return {};
    
    // Se for um objeto Map serializado
    if (typeof stats === 'object' && !Array.isArray(stats)) {
      return stats;
    }
    
    // Se for array de [key, value]
    if (Array.isArray(stats)) {
      return Object.fromEntries(stats);
    }
    
    return stats;
  };

  return {
    status,
    baseStatus,
    derivedStatus,
    loading,
    error,
    refetch: fetchStatus,
    initializeStats,
    normalizeStats
  };
}

export default useStatus;
