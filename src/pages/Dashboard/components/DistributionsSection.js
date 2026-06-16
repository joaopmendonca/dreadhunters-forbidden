// src/pages/Dashboard/components/DistributionsSection.js

import React from 'react';
import ChartCard from '../../../shared/components/ChartCard';
import { DASHBOARD_SECTIONS, QUEST_TYPE_COLORS, USER_STATUS_COLORS } from '../constants';
import styles from '../styles/Dashboard.module.css';

export default function DistributionsSection({ itemsByType, itemsByRarity, counts }) {
  const questsData = [
    { name: 'Principal', value: counts.questsMain, color: QUEST_TYPE_COLORS.main },
    { name: 'Secundária', value: counts.questsSide, color: QUEST_TYPE_COLORS.side },
    { name: 'Diária', value: counts.questsDaily, color: QUEST_TYPE_COLORS.daily },
    { name: 'Evento', value: counts.questsEvent, color: QUEST_TYPE_COLORS.event }
  ];

  const usersStatusData = [
    { name: 'Ativos', value: counts.usersActive, color: USER_STATUS_COLORS.active },
    { name: 'Pendentes', value: counts.usersPending, color: USER_STATUS_COLORS.pending },
    { name: 'Banidos', value: counts.usersBanned, color: USER_STATUS_COLORS.banned }
  ];

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{DASHBOARD_SECTIONS.DISTRIBUTIONS}</h2>
      <div className={styles.chartsGrid}>
        <ChartCard
          title="Itens por tipo"
          type="pie"
          data={itemsByType}
          dataKey="value"
          colors={itemsByType.map(i => i.color)}
          centerLabel="ITENS"
        />
        <ChartCard
          title="Itens por raridade"
          type="pie"
          data={itemsByRarity}
          dataKey="value"
          colors={itemsByRarity.map(i => i.color)}
          centerLabel="RARIDADE"
        />
        <ChartCard
          title="Quests por tipo"
          type="pie"
          data={questsData}
          dataKey="value"
          colors={questsData.map(q => q.color)}
          centerLabel="QUESTS"
        />
        <ChartCard
          title="Status dos usuários"
          type="pie"
          data={usersStatusData}
          dataKey="value"
          colors={usersStatusData.map(u => u.color)}
          centerLabel="USUÁRIOS"
        />
      </div>
    </section>
  );
}
