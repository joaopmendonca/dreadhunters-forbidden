// src/pages/ForbiddenBook/hooks/useForbiddenBook.js

import { useState, useEffect, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import api from '../../../config/api';
import { CHAPTERS, CHAPTER_CONFIG, CHAPTER_ORDER } from '../constants';

export default function useForbiddenBook() {
  const { enqueueSnackbar } = useSnackbar();
  
  const [currentChapter, setCurrentChapter] = useState(CHAPTERS.COVER);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingChapter, setLoadingChapter] = useState(null);
  
  // Estado de servidores
  const [servers, setServers] = useState([]);
  const [selectedServer, setSelectedServer] = useState('');
  const [loadingServers, setLoadingServers] = useState(true);

  // Busca lista de servidores
  const fetchServers = useCallback(async () => {
    setLoadingServers(true);
    try {
      const { data: serverList } = await api.get('/admin/servers');
      setServers(serverList);
      // Auto-seleciona o primeiro servidor se houver apenas um
      if (serverList.length === 1) {
        setSelectedServer(serverList[0].slug);
      }
    } catch (err) {
      console.error('Erro ao buscar servidores:', err);
      enqueueSnackbar('Erro ao carregar lista de servidores', { variant: 'error' });
    } finally {
      setLoadingServers(false);
    }
  }, [enqueueSnackbar]);

  // Busca todos os dados do backend para o servidor selecionado
  const fetchAllData = useCallback(async () => {
    if (!selectedServer) {
      setData({});
      return;
    }

    setLoading(true);
    
    try {
      const endpoints = CHAPTER_ORDER
        .filter(ch => CHAPTER_CONFIG[ch].endpoint)
        .map(ch => ({
          chapter: ch,
          endpoint: CHAPTER_CONFIG[ch].endpoint,
        }));

      const results = await Promise.allSettled(
        endpoints.map(({ endpoint }) => api.get(endpoint))
      );

      const newData = {};
      results.forEach((result, index) => {
        const { chapter } = endpoints[index];
        if (result.status === 'fulfilled') {
          newData[chapter] = result.value.data;
        } else {
          console.error(`Erro ao buscar ${chapter}:`, result.reason);
          newData[chapter] = [];
        }
      });

      setData(newData);
    } catch (err) {
      console.error('Erro ao carregar dados do grimório:', err);
      enqueueSnackbar('Erro ao carregar o Forbidden Book', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar, selectedServer]);

  // Busca dados de um capítulo específico (refresh)
  const refreshChapter = useCallback(async (chapter) => {
    const config = CHAPTER_CONFIG[chapter];
    if (!config?.endpoint) return;

    setLoadingChapter(chapter);
    try {
      const { data: result } = await api.get(config.endpoint);
      setData(prev => ({ ...prev, [chapter]: result }));
    } catch (err) {
      console.error(`Erro ao atualizar ${chapter}:`, err);
      enqueueSnackbar(`Erro ao atualizar ${config.title}`, { variant: 'error' });
    } finally {
      setLoadingChapter(null);
    }
  }, [enqueueSnackbar]);

  // Navegação entre capítulos
  const goToChapter = useCallback((chapter) => {
    setCurrentChapter(chapter);
  }, []);

  const nextChapter = useCallback(() => {
    const currentIndex = CHAPTER_ORDER.indexOf(currentChapter);
    if (currentIndex < CHAPTER_ORDER.length - 1) {
      setCurrentChapter(CHAPTER_ORDER[currentIndex + 1]);
    }
  }, [currentChapter]);

  const prevChapter = useCallback(() => {
    const currentIndex = CHAPTER_ORDER.indexOf(currentChapter);
    if (currentIndex > 0) {
      setCurrentChapter(CHAPTER_ORDER[currentIndex - 1]);
    }
  }, [currentChapter]);

  // Busca inicial - apenas servidores
  useEffect(() => {
    fetchServers();
  }, [fetchServers]);

  // Recarrega dados quando servidor muda
  useEffect(() => {
    if (selectedServer) {
      fetchAllData();
    }
  }, [selectedServer, fetchAllData]);

  // Handler para mudança de servidor
  const handleServerChange = useCallback((slug) => {
    setSelectedServer(slug);
    // Limpa dados ao trocar de servidor
    setData({});
  }, []);

  // Estatísticas gerais
  const getStats = useCallback(() => {
    return {
      classes: data[CHAPTERS.CLASSES]?.length || 0,
      skills: data[CHAPTERS.SKILLS]?.length || 0,
      attributes: data[CHAPTERS.ATTRIBUTES]?.length || 0,
      afflictions: data[CHAPTERS.AFFLICTIONS]?.length || 0,
      damageTypes: data[CHAPTERS.DAMAGE_TYPES]?.length || 0,
      items: data[CHAPTERS.ITEMS]?.length || 0,
      enemies: data[CHAPTERS.ENEMIES]?.length || 0,
      quests: data[CHAPTERS.QUESTS]?.length || 0,
      locations: data[CHAPTERS.LOCATIONS]?.length || 0,
      roles: data[CHAPTERS.ROLES]?.length || 0,
    };
  }, [data]);

  return {
    currentChapter,
    data,
    loading: loading || loadingServers,
    loadingChapter,
    goToChapter,
    nextChapter,
    prevChapter,
    refreshChapter,
    getStats,
    chapterConfig: CHAPTER_CONFIG[currentChapter],
    chapterData: data[currentChapter] || [],
    isFirstChapter: currentChapter === CHAPTER_ORDER[0],
    isLastChapter: currentChapter === CHAPTER_ORDER[CHAPTER_ORDER.length - 1],
    // Server props
    servers,
    selectedServer,
    onServerChange: handleServerChange,
    loadingServers,
  };
}
