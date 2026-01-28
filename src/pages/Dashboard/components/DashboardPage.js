// src/pages/Dashboard/components/DashboardPage.js

import React from 'react';
import BaseLayout from '../../../shared/components/BaseLayout';
import PageHeader from '../../../shared/components/PageHeader';
import LoadingState from './LoadingState';
import OverviewSection from './OverviewSection';
import ActivitySection from './ActivitySection';
import GameContentSection from './GameContentSection';
import DistributionsSection from './DistributionsSection';
import RecentUsersSection from './RecentUsersSection';
import ServersSection from './ServersSection';
import { useDashboardData } from '../hooks/useDashboardData';

export default function DashboardPage() {
  const {
    loading,
    counts,
    itemsByType,
    itemsByRarity,
    recentUsers,
    days,
    loginCounts,
    charCounts,
    errorCounts,
    activityCounts,
  } = useDashboardData();

  if (loading) {
    return (
      <BaseLayout title="Dashboard">
        <LoadingState />
      </BaseLayout>
    );
  }

  return (
    <BaseLayout title="Dashboard">
      <PageHeader
        statsCounters={[
          { icon: '👥', value: counts.users, label: 'Usuários', variant: 'counterBlue' },
          { icon: '🧙', value: counts.characters, label: 'NPCs', variant: 'counterPurple' },
          { icon: '🎒', value: counts.items, label: 'Itens', variant: 'counterGreen' },
          { icon: '👹', value: counts.enemies, label: 'Inimigos', variant: 'counterRed' },
          { icon: '🖥️', value: `${counts.serversOnline}/${counts.servers}`, label: 'Servidores', variant: 'counterCyan' },
          { icon: '🎮', value: counts.totalPlayers, label: 'Online', variant: 'counterActive' }
        ]}
      />

      <OverviewSection counts={counts} />
      
      <ActivitySection
        days={days}
        loginCounts={loginCounts}
        charCounts={charCounts}
        errorCounts={errorCounts}
        activityCounts={activityCounts}
      />

      <GameContentSection counts={counts} />

      <DistributionsSection
        itemsByType={itemsByType}
        itemsByRarity={itemsByRarity}
        counts={counts}
      />

      <RecentUsersSection recentUsers={recentUsers} />

      <ServersSection counts={counts} />
    </BaseLayout>
  );
}
