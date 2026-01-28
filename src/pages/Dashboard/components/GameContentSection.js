// src/pages/Dashboard/components/GameContentSection.js

import React from 'react';
import MetricCard from '../../../shared/components/MetricCard';
import { DASHBOARD_SECTIONS } from '../constants';
import styles from '../styles/Dashboard.module.css';

export default function GameContentSection({ counts }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{DASHBOARD_SECTIONS.GAME_CONTENT}</h2>
      <div className={styles.metricsGrid}>
        <MetricCard label="Itens" value={counts.items} color="#f59e0b" icon="🎒" />
        <MetricCard label="Skills" value={counts.skills} color="#8b5cf6" icon="✨" />
        <MetricCard label="Ativas" value={counts.skillsActive} color="#3b82f6" icon="⚡" />
        <MetricCard label="Passivas" value={counts.skillsPassive} color="#06b6d4" icon="🛡️" />
        <MetricCard label="Quests" value={counts.quests} color="#ef4444" icon="📜" />
        <MetricCard label="Aflicoes" value={counts.afflictions} color="#a855f7" icon="💀" />
        <MetricCard label="Moedas" value={counts.currencies} color="#f59e0b" icon="💰" />
        <MetricCard label="Locais" value={counts.locations} color="#06b6d4" icon="🗺️" />
      </div>
    </section>
  );
}
