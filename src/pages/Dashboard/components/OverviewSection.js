// src/pages/Dashboard/components/OverviewSection.js

import React from 'react';
import MetricCard from '../../../shared/components/MetricCard';
import { DASHBOARD_SECTIONS } from '../constants';
import styles from '../styles/Dashboard.module.css';

export default function OverviewSection({ counts }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{DASHBOARD_SECTIONS.OVERVIEW}</h2>
      <div className={styles.metricsGrid}>
        <MetricCard label="Usuarios" value={counts.users} color="#3b82f6" icon="👥" />
        <MetricCard label="Ativos" value={counts.usersActive} color="#10b981" icon="✅" />
        <MetricCard label="Banidos" value={counts.usersBanned} color="#ef4444" icon="🚫" />
        <MetricCard label="Pendentes" value={counts.usersPending} color="#f59e0b" icon="⏳" />
        <MetricCard label="NPCs" value={counts.characters} color="#8b5cf6" icon="🧙" />
        <MetricCard label="Classes" value={counts.classes} color="#ec4899" icon="⚔️" />
        <MetricCard label="Inimigos" value={counts.enemies} color="#ef4444" icon="👹" />
        <MetricCard label="Locais" value={counts.locations} color="#06b6d4" icon="📍" />
      </div>
    </section>
  );
}
