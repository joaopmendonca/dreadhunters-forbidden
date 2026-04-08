// src/hooks/useServerConfig.js
import { useEffect, useState } from 'react';
import api from '../../config/api';

/**
 * Hook para carregar as configurações do servidor selecionado
 * Retorna as regras de gameplay (pontos, limites, etc.)
 */
export default function useServerConfig() {
  const [config, setConfig] = useState({
    initialStatPoints: 6,
    baselinePerStat: 1,
    statPointsPerLevel: 1,
    maxStatValue: 24,
    minStatValue: 1,
    maxLevel: 99,
    maxStatPointsPerClass: 20,
    enemyInitialStatPoints: 6,
    enemyStatPointsPerLevel: 1,
    enemyTypeMultiplierNormal: 1,
    enemyTypeMultiplierElite: 1.67,
    enemyTypeMultiplierBoss: 3.33
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadConfig = async () => {
      setLoading(true);
      setError(null);
      try {
        // TODO: Determinar qual servidor usar (pode vir de localStorage, context, etc)
        // Por enquanto, tentamos carregar de um servidor padrão ou usar valores default
        const serverSlug = localStorage.getItem('selectedServerSlug');
        
        if (serverSlug) {
          const res = await api.get(`/server-config/${serverSlug}`);
          setConfig({
            initialStatPoints: res.data.initialStatPoints ?? 6,
            baselinePerStat: res.data.baselinePerStat ?? 1,
            statPointsPerLevel: res.data.statPointsPerLevel ?? 1,
            maxStatValue: res.data.maxStatValue ?? 24,
            minStatValue: res.data.minStatValue ?? 1,
            maxLevel: res.data.maxLevel ?? 99,
            maxStatPointsPerClass: res.data.maxStatPointsPerClass ?? 20,
            enemyInitialStatPoints: res.data.enemyInitialStatPoints ?? 6,
            enemyStatPointsPerLevel: res.data.enemyStatPointsPerLevel ?? 1,
            enemyTypeMultiplierNormal: res.data.enemyTypeMultiplierNormal ?? 1,
            enemyTypeMultiplierElite: res.data.enemyTypeMultiplierElite ?? 1.67,
            enemyTypeMultiplierBoss: res.data.enemyTypeMultiplierBoss ?? 3.33
          });
        }
      } catch (err) {
        console.error('Erro ao carregar config do servidor:', err);
        setError(err);
        // Manter valores padrão em caso de erro
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  return { config, loading, error };
}
