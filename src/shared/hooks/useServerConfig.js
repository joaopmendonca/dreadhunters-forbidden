// src/shared/hooks/useServerConfig.js
import { useEffect, useState } from 'react';
import api from '../../config/api';

/**
 * Carrega a configuração GLOBAL do jogo (regras de gameplay: pontos, limites, etc.).
 * Config deixou de ser por servidor — ver docs/prd-migracao-equipes.md [R12].
 * Nome mantido por compatibilidade com as páginas que já importam este hook.
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
    let mounted = true;
    const loadConfig = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get('/game-config');
        if (mounted) setConfig((prev) => ({ ...prev, ...res.data }));
      } catch (err) {
        console.error('Erro ao carregar config global:', err);
        if (mounted) setError(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadConfig();
    return () => { mounted = false; };
  }, []);

  return { config, loading, error };
}
