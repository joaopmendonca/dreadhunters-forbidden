// src/pages/Dashboard/components/ActivitySection.js

import React from 'react';
import ChartCard from '../../../shared/components/ChartCard';
import { formatShortDate } from '../utils';
import { DASHBOARD_SECTIONS, CHART_COLORS } from '../constants';
import styles from '../styles/Dashboard.module.css';

export default function ActivitySection({ days, loginCounts, charCounts, errorCounts, activityCounts }) {
  const lineDataLogins = days.map((d, i) => ({ name: formatShortDate(d), value: loginCounts[i] }));
  const lineDataChars = days.map((d, i) => ({ name: formatShortDate(d), value: charCounts[i] }));
  const lineDataErrors = days.map((d, i) => ({ name: formatShortDate(d), value: errorCounts[i] }));
  const lineDataActivity = days.map((d, i) => ({ name: formatShortDate(d), value: activityCounts[i] }));

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{DASHBOARD_SECTIONS.ACTIVITY}</h2>
      <div className={styles.chartsGrid}>
        <ChartCard
          title="Logins"
          type="line"
          data={lineDataLogins}
          dataKey="value"
          colors={[CHART_COLORS.LOGINS]}
          compactMode
        />
        <ChartCard
          title="Novos Personagens"
          type="line"
          data={lineDataChars}
          dataKey="value"
          colors={[CHART_COLORS.CHARACTERS]}
          compactMode
        />
        <ChartCard
          title="Requisicoes"
          type="bar"
          data={lineDataActivity}
          dataKey="value"
          colors={[CHART_COLORS.ACTIVITY]}
          compactMode
        />
        <ChartCard
          title="Erros (4xx/5xx)"
          type="line"
          data={lineDataErrors}
          dataKey="value"
          colors={[CHART_COLORS.ERRORS]}
          compactMode
        />
      </div>
    </section>
  );
}
