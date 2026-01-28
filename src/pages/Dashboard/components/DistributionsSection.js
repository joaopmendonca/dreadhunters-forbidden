// src/pages/Dashboard/components/DistributionsSection.js

import React from 'react';
import ChartCard from '../../../shared/components/ChartCard';
import { DASHBOARD_SECTIONS, QUEST_TYPE_COLORS, USER_STATUS_COLORS } from '../constants';
import styles from '../styles/Dashboard.module.css';

export default function DistributionsSection({ itemsByType, itemsByRarity, counts }) {
  const questsData = [
    { name: 'Principal', value: counts.questsMain, color: QUEST_TYPE_COLORS.main },
    { name: 'Secundaria', value: counts.questsSide, color: QUEST_TYPE_COLORS.side },
    { name: 'Diaria', value: counts.questsDaily, color: QUEST_TYPE_COLORS.daily },
    { name: 'Evento', value: counts.questsEvent, color: QUEST_TYPE_COLORS.event }
  ];

  const usersStatusData = [
    { name: 'Ativos', value: counts.usersActive, color: USER_STATUS_COLORS.active },
    { name: 'Banidos', value: counts.usersBanned, color: USER_STATUS_COLORS.banned },
    { name: 'Pendentes', value: counts.usersPending, color: USER_STATUS_COLORS.pending }
  ];

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{DASHBOARD_SECTIONS.DISTRIBUTIONS}</h2>
      <div className={styles.chartsGrid}>
        <ChartCard
          title="Itens por Tipo"
          type="pie"
          data={itemsByType}
          dataKey="value"
          colors={itemsByType.map(i => i.color)}
        />
        <ChartCard
          title="Itens por Raridade"
          type="pie"
          data={itemsByRarity}
          dataKey="value"
          colors={itemsByRarity.map(i => i.color)}
        />
        <ChartCard
          title="Quests por Tipo"
          type="pie"
          data={questsData}
          dataKey="value"
          colors={questsData.map(q => q.color)}
        />
        <ChartCard
          title="Status dos Usuarios"
          type="pie"
          data={usersStatusData}
          dataKey="value"
          colors={usersStatusData.map(u => u.color)}
        />
      </div>
    </section>
  );
}
