// src/pages/Dashboard/hooks/useDashboardData.js

import { useState, useCallback, useEffect } from 'react';
import api from '../../../config/api';
import { buildLast7Days, countByField, sumByField } from '../utils';
import {
  USER_STATUS,
  SKILL_TYPES,
  QUEST_TYPES,
  SERVER_STATUS,
  ITEM_TYPE_COLORS,
  ITEM_RARITY_COLORS,
  QUEST_TYPE_COLORS,
  USER_STATUS_COLORS,
} from '../constants';

export function useDashboardData() {
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    users: 0, usersActive: 0, usersBanned: 0, usersPending: 0,
    characters: 0,
    classes: 0,
    items: 0,
    enemies: 0,
    skills: 0, skillsActive: 0, skillsPassive: 0,
    quests: 0, questsMain: 0, questsSide: 0, questsDaily: 0, questsEvent: 0,
    locations: 0,
    afflictions: 0,
    currencies: 0,
    servers: 0, serversOnline: 0, totalPlayers: 0
  });

  const [itemsByType, setItemsByType] = useState([]);
  const [itemsByRarity, setItemsByRarity] = useState([]);
  const [servers, setServers] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  
  const [days, setDays] = useState(buildLast7Days);
  const [loginShiftMatrix, setLoginShiftMatrix] = useState(() => buildEmptyShiftMatrix());
  const [loginShiftLabels] = useState(() => SHIFT_LABELS);
  const [charCounts, setCharCounts] = useState(Array(7).fill(0));
  const [errorCounts, setErrorCounts] = useState(Array(7).fill(0));
  const [activityCounts, setActivityCounts] = useState(Array(7).fill(0));

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      // Busca todos os dados em uma única requisição
      const response = await api.get('/dashboard');
      const {
        users,
        characters,
        classes: classesData,
        items,
        enemies,
        skills,
        quests,
        locations,
        afflictions,
        currencies,
        servers,
        logs
      } = response.data;

      // Contadores de usuarios
      const usersActive = countByField(users, 'status', USER_STATUS.ACTIVE);
      const usersBanned = countByField(users, 'status', USER_STATUS.BANNED);
      const usersPending = countByField(users, 'status', USER_STATUS.PENDING);

      // Contadores de skills
      const skillsActive = countByField(skills, 'type', SKILL_TYPES.ACTIVE);
      const skillsPassive = countByField(skills, 'type', SKILL_TYPES.PASSIVE);

      // Contadores de quests
      const questsMain = countByField(quests, 'type', QUEST_TYPES.MAIN);
      const questsSide = countByField(quests, 'type', QUEST_TYPES.SIDE);
      const questsDaily = countByField(quests, 'type', QUEST_TYPES.DAILY);
      const questsEvent = countByField(quests, 'type', QUEST_TYPES.EVENT);

      // Contadores de servidores
      const serversOnline = servers.filter(s => 
        s.status === SERVER_STATUS.ONLINE || s.status === SERVER_STATUS.FULL
      ).length;
      const totalPlayers = sumByField(servers, 'currentPlayers');

      // Itens por tipo e raridade
      const typeMap = { consumable: 0, equipment: 0, material: 0, key: 0, quest: 0 };
      const rarityMap = { common: 0, uncommon: 0, rare: 0, epic: 0, legendary: 0 };
      items.forEach(item => {
        if (typeMap[item.type] !== undefined) typeMap[item.type]++;
        if (rarityMap[item.rarity] !== undefined) rarityMap[item.rarity]++;
      });

      setItemsByType([
        { name: 'Consumivel', value: typeMap.consumable, color: ITEM_TYPE_COLORS.consumable },
        { name: 'Equipamento', value: typeMap.equipment, color: ITEM_TYPE_COLORS.equipment },
        { name: 'Material', value: typeMap.material, color: ITEM_TYPE_COLORS.material },
        { name: 'Chave', value: typeMap.key, color: ITEM_TYPE_COLORS.key },
        { name: 'Quest', value: typeMap.quest, color: ITEM_TYPE_COLORS.quest }
      ]);

      setItemsByRarity([
        { name: 'Comum', value: rarityMap.common, color: ITEM_RARITY_COLORS.common },
        { name: 'Incomum', value: rarityMap.uncommon, color: ITEM_RARITY_COLORS.uncommon },
        { name: 'Raro', value: rarityMap.rare, color: ITEM_RARITY_COLORS.rare },
        { name: 'Epico', value: rarityMap.epic, color: ITEM_RARITY_COLORS.epic },
        { name: 'Lendario', value: rarityMap.legendary, color: ITEM_RARITY_COLORS.legendary }
      ]);
      setServers(servers);

      // Usuarios recentes
      const sortedUsers = [...users]
        .sort((a, b) => getUserAccessTime(b) - getUserAccessTime(a))
        .slice(0, 5);
      setRecentUsers(sortedUsers);

      // Processar logs
      const d7 = buildLast7Days();
      const loginMatrix = buildEmptyShiftMatrix();
      const chars = Array(7).fill(0);
      const errors = Array(7).fill(0);
      const activity = Array(7).fill(0);

      logs.forEach(l => {
        const metadata = l.metadata || {};
        const timestampValue = l.timestamp || l.createdAt || metadata.timestamp || metadata.createdAt;
        const date = getLogDateKey(timestampValue);
        const idx = d7.indexOf(date);
        if (idx === -1) return;

        const eventDate = new Date(timestampValue);
        if (Number.isNaN(eventDate.getTime())) return;

        const method = String(l.method || metadata.method || '').toUpperCase();
        const route = String(l.route || metadata.route || l.path || metadata.path || l.url || metadata.url || '').toLowerCase();
        const action = String(l.action || metadata.action || '').toUpperCase();
        const category = String(l.category || metadata.category || '').toUpperCase();
        const statusCode = l.statusCode || metadata.statusCode || 0;

        activity[idx]++;

        const isLoginEvent =
          (method === 'POST' && route.includes('/auth/login')) ||
          action === 'LOGIN' ||
          (category === 'AUTH' && (route.includes('/login') || route.includes('/auth')));

        if (isLoginEvent) {
          const shiftIdx = getShiftIndex(eventDate.getHours());
          loginMatrix[shiftIdx][idx]++;
        }
        if (method === 'POST' && (route.includes('/characters') || action === 'CREATE_CHARACTER')) {
          chars[idx]++;
        }
        if (statusCode >= 400) {
          errors[idx]++;
        }
      });

      setDays(d7);
      setLoginShiftMatrix(loginMatrix);
      setCharCounts(chars);
      setErrorCounts(errors);
      setActivityCounts(activity);

      setCounts({
        users: users.length,
        usersActive,
        usersBanned,
        usersPending,
        characters: characters.length,
        classes: classesData.length,
        items: items.length,
        enemies: enemies.length,
        skills: skills.length,
        skillsActive,
        skillsPassive,
        quests: quests.length,
        questsMain,
        questsSide,
        questsDaily,
        questsEvent,
        locations: locations.length,
        afflictions: afflictions.length,
        currencies: currencies.length,
        servers: servers.length,
        serversOnline,
        totalPlayers
      });

    } catch (err) {
      console.error('Erro ao buscar dados:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return {
    loading,
    counts,
    itemsByType,
    itemsByRarity,
    servers,
    recentUsers,
    days,
    loginShiftMatrix,
    loginShiftLabels,
    charCounts,
    errorCounts,
    activityCounts,
  };
}

function getLogDateKey(value) {
  if (!value) return null;

  const date = new Date(value);
  if (!Number.isNaN(date.getTime())) {
    return date.toISOString().slice(0, 10);
  }

  if (typeof value === 'string' && value.length >= 10) {
    return value.slice(0, 10);
  }

  return null;
}

const SHIFT_LABELS = [
  'Madrugada',
  'Manhã',
  'Tarde',
  'Noite',
];

function buildEmptyShiftMatrix() {
  return SHIFT_LABELS.map(() => Array(7).fill(0));
}

function getShiftIndex(hour) {
  if (hour < 6) return 0;
  if (hour < 12) return 1;
  if (hour < 18) return 2;
  return 3;
}

function getUserAccessTime(user) {
  const value = user?.lastAccess || user?.lastLoginAt || user?.updatedAt || user?.createdAt;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}
