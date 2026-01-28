// src/pages/Dashboard/components/ServersSection.js

import React from 'react';
import MetricCard from '../../../shared/components/MetricCard';
import { DASHBOARD_SECTIONS } from '../constants';
import styles from '../styles/Dashboard.module.css';

export default function ServersSection({ counts }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{DASHBOARD_SECTIONS.SERVERS}</h2>
      <div className={styles.metricsGrid}>
        <MetricCard label="Total" value={counts.servers} color="#6366f1" icon="🖥️" />
        <MetricCard label="Online" value={counts.serversOnline} color="#10b981" icon="🟢" />
        <MetricCard label="Jogadores" value={counts.totalPlayers} color="#3b82f6" icon="🎮" />
      </div>
    </section>
  );
}
