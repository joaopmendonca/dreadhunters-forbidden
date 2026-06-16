import React, { useContext, useMemo } from 'react';
import {
  FaBoxOpen,
  FaBookSkull,
  FaCoins,
  FaCompass,
  FaEyeSlash,
  FaHourglassHalf,
  FaScroll,
  FaSkullCrossbones,
  FaUserSecret,
  FaUsers,
} from 'react-icons/fa6';
import { FaChessKnight, FaMapMarkedAlt, FaServer } from 'react-icons/fa';
import BaseLayout from '../../../shared/components/BaseLayout';
import { AuthContext } from '../../../shared/contexts/AuthContext';
import { formatShortDate } from '../utils';
import { useDashboardData } from '../hooks/useDashboardData';
import styles from '../styles/Dashboard.module.css';


const iconTone = {
  gold: styles.toneGold,
  teal: styles.toneTeal,
  red: styles.toneRed,
  purple: styles.tonePurple,
  green: styles.toneGreen,
  blue: styles.toneBlue,
};

function DashboardPage() {
  const {
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
  } = useDashboardData();
  const { user } = useContext(AuthContext);

  const dayLabels = useMemo(() => days.map(formatShortDate), [days]);
  const displayRecentUsers = useMemo(() => {
    const normalizedCurrentUser = normalizeUser(user);

    return recentUsers
      .map((candidate) => {
        const normalizedCandidate = normalizeUser(candidate);
        if (!normalizedCurrentUser || !normalizedCandidate) {
          return candidate;
        }

        if (!areUsersEquivalent(normalizedCandidate, normalizedCurrentUser)) {
          return candidate;
        }

        return {
          ...candidate,
          ...pickAccessFields(normalizedCurrentUser),
        };
      })
      .sort((a, b) => getUserAccessTime(b) - getUserAccessTime(a));
  }, [recentUsers, user]);

  const topStats = useMemo(() => ([
    { Icon: FaUsers, tone: 'gold', label: 'Usuários', value: counts.users, detail: `${counts.usersActive} cadastrados` },
    { Icon: FaCompass, tone: 'teal', label: 'Ativos', value: counts.serversOnline, detail: 'online agora' },
    { Icon: FaEyeSlash, tone: 'red', label: 'Banidos', value: counts.usersBanned, detail: 'bloqueados' },
    { Icon: FaHourglassHalf, tone: 'purple', label: 'Pendentes', value: counts.usersPending, detail: 'aguardando' },
    { Icon: FaUserSecret, tone: 'green', label: 'NPCs', value: counts.characters, detail: 'registrados' },
    { Icon: FaChessKnight, tone: 'blue', label: 'Classes', value: counts.classes, detail: 'criadas' },
    { Icon: FaSkullCrossbones, tone: 'red', label: 'Inimigos', value: counts.enemies, detail: 'conhecidos' },
    { Icon: FaMapMarkedAlt, tone: 'gold', label: 'Locais', value: counts.locations, detail: 'explorados' },
  ]), [counts]);

  const gameCards = useMemo(() => ([
    {
      Icon: FaBoxOpen,
      tone: 'gold',
      title: 'Itens',
      value: counts.items,
      detail: 'catalogados',
      rows: [
        ['Equipamentos', itemsByType.find((item) => item.name === 'Equipamento')?.value || 0],
        ['Consumíveis', itemsByType.find((item) => item.name === 'Consumivel')?.value || 0],
        ['Materiais', itemsByType.find((item) => item.name === 'Material')?.value || 0],
        ['Chaves', itemsByType.find((item) => item.name === 'Chave')?.value || 0],
      ],
    },
    {
      Icon: FaScroll,
      tone: 'purple',
      title: 'Skills',
      value: counts.skills,
      detail: 'registradas',
      rows: [
        ['Ativas', counts.skillsActive],
        ['Passivas', counts.skillsPassive],
      ],
    },
    {
      Icon: FaBookSkull,
      tone: 'red',
      title: 'Aflições',
      value: counts.afflictions,
      detail: 'catalogadas',
      rows: [
        ['Comuns', counts.afflictions ? Math.max(1, Math.round(counts.afflictions * 0.55)) : 0],
        ['Raras', counts.afflictions ? Math.max(1, Math.round(counts.afflictions * 0.2)) : 0],
        ['Épicas', counts.afflictions ? Math.max(1, Math.round(counts.afflictions * 0.1)) : 0],
        ['Lendárias', counts.afflictions ? Math.max(1, Math.round(counts.afflictions * 0.05)) : 0],
      ],
    },
    {
      Icon: FaScroll,
      tone: 'teal',
      title: 'Quests',
      value: counts.quests,
      detail: 'registradas',
      rows: [
        ['Principais', counts.questsMain],
        ['Secundárias', counts.questsSide],
        ['Diárias', counts.questsDaily],
        ['Eventos', counts.questsEvent],
      ],
    },
    {
      Icon: FaCoins,
      tone: 'gold',
      title: 'Moedas',
      value: counts.currencies,
      detail: 'tipos',
      rows: [
        ['Circulando', Math.max(1, counts.currencies)],
        ['Controladas', Math.max(0, counts.currencies - 1)],
      ],
    },
    {
      Icon: FaMapMarkedAlt,
      tone: 'green',
      title: 'Locais',
      value: counts.locations,
      detail: 'explorados',
      rows: [
        ['Cidades', Math.max(1, Math.round(counts.locations * 0.32))],
        ['Masmorras', Math.max(1, Math.round(counts.locations * 0.28))],
        ['Campos', Math.max(1, Math.round(counts.locations * 0.4))],
      ],
    },
  ]), [counts, itemsByType]);

  const userStatus = [
    { name: 'Ativos', value: counts.usersActive, color: '#27c08a' },
    { name: 'Pendentes', value: counts.usersPending, color: '#d9a14d' },
    { name: 'Banidos', value: counts.usersBanned, color: '#cf4d4d' },
  ];

  const itemDistributionLegend = itemsByType.map((entry) => ({
    label: entry.name,
    value: entry.value,
    color: entry.color,
  }));

  const rarityDistributionLegend = itemsByRarity.map((entry) => ({
    label: entry.name,
    value: entry.value,
    color: entry.color,
  }));

  const activityLegends = [
    { label: 'Logins', value: sum(loginShiftMatrix.flat()), color: '#3ed0b1' },
    { label: 'Novos personagens', value: sum(charCounts), color: '#7ae27d' },
    { label: 'Requisições', value: sum(activityCounts), color: '#ba82ff' },
    { label: 'Erros', value: sum(errorCounts), color: '#ea5a5a' },
  ];
  const serverSummary = useMemo(() => buildServerSummary(servers), [servers]);
  const serverCards = useMemo(() => (
    [...servers]
      .sort((a, b) => getServerSortScore(b) - getServerSortScore(a))
      .map((server) => ({
        ...server,
        label: getServerStatusLabel(server.status),
        statusKey: getServerStatusKey(server.status),
        tone: getServerStatusTone(server.status),
        occupancy: getServerOccupancy(server.currentPlayers, server.maxPlayers),
      }))
  ), [servers]);

  if (loading) {
    return (
      <BaseLayout>
        <div className={styles.shell}>
          <div className={styles.loadingState}>
            <div className={styles.loadingOrb} />
            <p>Carregando o Forbidden...</p>
          </div>
        </div>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout>
      <div className={styles.shell}>
        <main className={styles.main}>
          <section className={styles.heroBlock}>
            <div className={styles.heroCopy}>
              <span className={styles.heroKicker}>Forbidden dashboard</span>
              <h1 className={styles.heroTitle}>Dread Hunters</h1>
            </div>
          </section>

          <section className={styles.topStats}>
            {topStats.map((stat) => (
              <article key={stat.label} className={styles.statCard}>
                <div className={`${styles.statSeal} ${iconTone[stat.tone] || ''}`}>
                  <stat.Icon className={styles.statIconGlyph} aria-hidden="true" />
                </div>
                <div className={styles.statMeta}>
                  <span className={styles.statLabel}>{stat.label}</span>
                  <strong className={styles.statValue}>{stat.value}</strong>
                  <span className={styles.statDetail}>{stat.detail}</span>
                </div>
              </article>
            ))}
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div>
                <p className={styles.sectionKicker}>Atividade (últimos 7 dias)</p>
                <h2 className={styles.sectionTitle}>Registros de operação</h2>
              </div>
              <span className={styles.sectionBadge}>Visão consolidada</span>
            </div>

            <div className={styles.activityGrid}>
              <ChartCard title="Logins" subtitle="Dia x turno" legend={activityLegends[0]}>
                <HeatmapChart matrix={loginShiftMatrix} dayLabels={dayLabels} shiftLabels={loginShiftLabels} />
              </ChartCard>
              <ChartCard title="Novos personagens" subtitle="Criações por dia" legend={activityLegends[1]}>
                <LineChart values={charCounts} labels={dayLabels} stroke="#56d7a6" fill="#2a7f5d" />
              </ChartCard>
              <ChartCard title="Requisições" subtitle="Picos do período" legend={activityLegends[2]}>
                <BarChart values={activityCounts} labels={dayLabels} fill="#b57bff" />
              </ChartCard>
              <ChartCard title="Erros (4xx/5xx)" subtitle="Falhas por dia" legend={activityLegends[3]}>
                <LineChart values={errorCounts} labels={dayLabels} stroke="#f06a6a" fill="#6b2020" />
              </ChartCard>
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div>
                <p className={styles.sectionKicker}>Conteúdo do jogo</p>
                <h2 className={styles.sectionTitle}>Inventário do Forbidden</h2>
              </div>
            </div>

            <div className={styles.contentGrid}>
              {gameCards.map((card) => (
                <article key={card.title} className={styles.contentCard}>
                  <div className={styles.contentHeader}>
                    <div className={`${styles.contentIconWrap} ${iconTone[card.tone] || ''}`}>
                      <card.Icon className={styles.contentIconGlyph} aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className={styles.contentTitle}>{card.title}</h3>
                      <p className={styles.contentSubtitle}>{card.detail}</p>
                    </div>
                  </div>
                  <div className={styles.contentValueRow}>
                    <strong className={styles.contentValue}>{card.value}</strong>
                    <span className={styles.contentUnit}>registros</span>
                  </div>
                  <div className={styles.contentRows}>
                    {card.rows.map(([label, value]) => (
                      <div key={label} className={styles.contentRow}>
                        <span>{label}</span>
                        <strong>{value}</strong>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div>
                <p className={styles.sectionKicker}>Distribuições</p>
                <h2 className={styles.sectionTitle}>Leituras por categoria</h2>
              </div>
            </div>

            <div className={styles.distributionGrid}>
              <RingCard title="Itens por tipo" centerLabel="Itens" centerValue={counts.items} segments={itemDistributionLegend} />
              <RingCard title="Itens por raridade" centerLabel="Raridade" centerValue={counts.items} segments={rarityDistributionLegend} />
              <RingCard
                title="Quests por tipo"
                centerLabel="Quests"
                centerValue={counts.quests}
                segments={[
                  { label: 'Principal', value: counts.questsMain, color: '#f05252' },
                  { label: 'Secundária', value: counts.questsSide, color: '#4f8ef7' },
                  { label: 'Diária', value: counts.questsDaily, color: '#21c997' },
                  { label: 'Evento', value: counts.questsEvent, color: '#f5b94c' },
                ]}
              />
              <RingCard title="Status dos usuários" centerLabel="Usuários" centerValue={counts.users} segments={userStatus} />
            </div>
          </section>
        </main>

        <aside className={styles.rightRail}>
          <section className={styles.sidePanel}>
            <div className={styles.sectionHeaderCompact}>
              <h2 className={styles.sectionTitle}>Registro dos recrutas</h2>
            </div>
            <div className={styles.userList}>
              {displayRecentUsers.map((user, index) => (
                <article key={user.id || user._id || user.email || `${index}`} className={styles.userItem}>
                  <div className={styles.userItemHeader}>
                    <div className={`${styles.userAvatar} ${styles.toneTeal}`}>
                      <FaUserSecret className={styles.userAvatarIcon} aria-hidden="true" />
                    </div>
                    <span className={styles.userEmail}>{user.email || 'Sem e-mail'}</span>
                    <span
                      className={`${styles.statusDot} ${styles[`statusDot${getStatusLabel(user.status)}`] || ''}`}
                      title={getStatusLabel(user.status)}
                    />
                  </div>
                  <div className={styles.userItemBody}>
                    <strong className={styles.userName}>{getUserName(user)}</strong>
                    <span className={styles.userAccess}>{formatAccess(user.lastAccess || user.lastLoginAt || user.updatedAt || user.createdAt)}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className={styles.sidePanel}>
            <div className={styles.sectionHeaderCompact}>
              <h2 className={styles.sectionTitle}>Servidores</h2>
            </div>
            <article className={styles.serverOverview}>
              <div className={styles.serverBody}>
                <div className={styles.serverOverviewHeader}>
                  <div>
                    <h3 className={styles.serverTitle}>Panorama geral</h3>
                    <p className={styles.serverSummaryText}>Leitura consolidada da malha de servidores</p>
                  </div>
                  <span className={styles.serverCountPill}>{serverSummary.total} servidores</span>
                </div>
                <div className={styles.serverSummaryGrid}>
                  <ServerMetric label="Online" value={serverSummary.online} highlight />
                  <ServerMetric label="Cheios" value={serverSummary.full} />
                  <ServerMetric label="Manutenção" value={serverSummary.maintenance} />
                  <ServerMetric label="Offline" value={serverSummary.offline} />
                  <ServerMetric label="Jogadores online" value={serverSummary.players} />
                  <ServerMetric label="Capacidade" value={`${serverSummary.players}/${serverSummary.capacity}`} />
                  <ServerMetric label="Ocupação" value={`${serverSummary.occupancy}%`} />
                  <ServerMetric label="Regiões" value={serverSummary.regions} />
                </div>
              </div>
            </article>

            <div className={styles.serverList}>
              {serverCards.length ? serverCards.map((server) => (
                <article key={server.slug || server.name} className={styles.serverCard}>
                  <div className={styles.serverCardHeader}>
                    <div className={`${styles.serverMiniSeal} ${iconTone[server.tone] || styles.toneBlue}`}>
                      <FaServer className={styles.serverMiniIcon} aria-hidden="true" />
                    </div>
                    <div className={styles.serverCardTitleBlock}>
                    <h3 className={styles.serverCardTitle}>{server.name}</h3>
                    <p className={styles.serverCardSubtitle}>
                      {server.region || 'Região não informada'} {server.slug ? `• ${server.slug}` : ''}
                    </p>
                  </div>
                    <span className={`${styles.serverStatusPill} ${styles[`serverStatus${server.statusKey}`] || ''}`}>
                      {server.label}
                    </span>
                  </div>
                  <div className={styles.serverCardMetrics}>
                    <ServerMetric label="Jogadores" value={`${server.currentPlayers || 0}/${server.maxPlayers || 0}`} />
                    <ServerMetric label="Ocupação" value={`${server.occupancy}%`} highlight />
                  </div>
                  <div className={styles.serverProgress}>
                    <span style={{ width: `${Math.min(100, Math.max(0, server.occupancy))}%` }} />
                  </div>
                </article>
              )) : (
                <div className={styles.serverEmptyState}>Nenhum servidor cadastrado.</div>
              )}
            </div>
          </section>
        </aside>
      </div>
    </BaseLayout>
  );
}

function ChartCard({ title, subtitle, legend, children }) {
  return (
    <article className={styles.chartCard}>
      <div className={styles.chartHeader}>
        <div>
          <h3 className={styles.chartTitle}>{title}</h3>
          <p className={styles.chartSubtitle}>{subtitle}</p>
        </div>
        <span className={styles.chartLegend}>
          <span className={styles.legendDot} style={{ backgroundColor: legend.color }} />
          {legend.label}
        </span>
      </div>
      <div className={styles.chartBody}>{children}</div>
    </article>
  );
}

function HeatmapChart({ matrix, dayLabels, shiftLabels }) {
  const max = Math.max(...matrix.flat(), 1);
  const steps = [0, 0.25, 0.45, 0.7, 1];

  return (
    <div className={styles.heatmapWrap}>
      <div className={styles.heatmapLegend}>
        <span>Menos</span>
        <div className={styles.heatmapLegendScale}>
          {steps.map((step) => (
            <span
              key={step}
              className={styles.heatLegendCell}
              style={getHeatmapColor(step, step > 0, step)}
            />
          ))}
        </div>
        <span>Mais</span>
      </div>
      <div
        className={styles.heatmapTable}
        style={{ gridTemplateColumns: `88px repeat(${dayLabels.length}, minmax(0, 1fr))` }}
      >
        <span className={styles.heatmapCorner} />
        {dayLabels.map((label) => (
          <span key={label} className={styles.heatmapDayLabelCell}>{label}</span>
        ))}

        {shiftLabels.map((shiftLabel, shiftIndex) => (
          <React.Fragment key={shiftLabel}>
            <span className={styles.heatmapShiftLabel}>{shiftLabel}</span>
            {dayLabels.map((dayLabel, dayIndex) => {
              const count = matrix[shiftIndex]?.[dayIndex] || 0;
              const normalized = count / max;
              const color = getHeatmapColor(normalized, count > 0, normalized);
              return (
                <span
                  key={`${shiftLabel}-${dayLabel}`}
                  className={styles.heatCell}
                  style={color}
                />
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function getHeatmapColor(intensity, hasValue, normalized) {
  if (!hasValue) {
    return {
      backgroundColor: 'rgba(13, 39, 35, 0.92)',
      boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.03)',
      opacity: 0.95,
    };
  }

  const lightness = 16 + (normalized * 28) + (intensity * 10);
  const saturation = 42 + (normalized * 32);
  const alpha = 0.42 + (normalized * 0.48);

  return {
    backgroundColor: `hsla(170, ${saturation}%, ${lightness}%, ${alpha})`,
    boxShadow: `
      inset 0 0 0 1px rgba(255, 255, 255, 0.06),
      0 0 ${6 + (normalized * 14)}px rgba(62, 208, 177, ${0.14 + (normalized * 0.36)})
    `,
    opacity: 1,
  };
}

function LineChart({ values, labels, stroke, fill }) {
  const width = 320;
  const height = 150;
  const max = Math.max(...values, 1);
  const step = values.length > 1 ? (width - 32) / (values.length - 1) : 0;

  const points = values.map((value, index) => {
    const x = 16 + (step * index);
    const y = 18 + ((max - value) / max) * 96;
    return { x, y };
  });

  const polyline = points.map((point) => `${point.x},${point.y}`).join(' ');
  const area = `M 16 ${120} ${points.map((point) => `L ${point.x} ${point.y}`).join(' ')} L ${width - 16} ${120} Z`;

  return (
    <svg className={styles.chartSvg} viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Linha de atividade">
      <defs>
        <linearGradient id={`lineFill-${stroke.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fill} stopOpacity="0.45" />
          <stop offset="100%" stopColor={fill} stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#lineFill-${stroke.replace('#', '')})`} />
      <polyline points={polyline} fill="none" stroke={stroke} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((point, index) => (
        <g key={labels[index] || index}>
          <circle
            cx={point.x}
            cy={point.y}
            r="3.5"
            fill={stroke}
          />
          <text
            x={point.x}
            y={Math.max(12, point.y - 8)}
            textAnchor="middle"
            className={styles.chartValueLabel}
          >
            {values[index]}
          </text>
        </g>
      ))}
    </svg>
  );
}

function BarChart({ values, labels, fill }) {
  const max = Math.max(...values, 1);
  const barWidth = 28;
  const gap = 14;
  const totalWidth = (values.length * barWidth) + ((values.length - 1) * gap);
  const start = (320 - totalWidth) / 2;

  return (
    <svg className={styles.chartSvg} viewBox="0 0 320 150" role="img" aria-label="Gráfico de barras">
      {values.map((value, index) => {
        const barHeight = Math.max(8, (value / max) * 88);
        const x = start + (index * (barWidth + gap));
        const y = 108 - barHeight;
        return (
          <g key={labels[index] || index}>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              rx="6"
              fill={fill}
              opacity="0.85"
            />
            <text
              x={x + (barWidth / 2)}
              y={Math.max(14, y - 4)}
              textAnchor="middle"
              className={styles.chartValueLabel}
            >
              {value}
            </text>
            <text x={x + (barWidth / 2)} y="132" textAnchor="middle" className={styles.chartAxisLabel}>
              {labels[index]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function RingCard({ title, centerLabel, centerValue, segments }) {
  const total = segments.reduce((sum, entry) => sum + (entry.value || 0), 0) || 1;
  let cursor = 0;
  const gradient = segments
    .map((segment) => {
      const start = cursor;
      cursor += (segment.value || 0) / total * 100;
      return `${segment.color} ${start}% ${cursor}%`;
    })
    .join(', ');

  return (
    <article className={styles.ringCard}>
      <h3 className={styles.chartTitle}>{title}</h3>
      <div className={styles.ringVisual} style={{ background: `conic-gradient(${gradient})` }}>
        <div className={styles.ringInner}>
          <span>{centerLabel}</span>
          <strong>{centerValue}</strong>
        </div>
      </div>
      <div className={styles.ringLegend}>
        {segments.map((segment) => (
          <div
            key={segment.label || segment.name}
            className={`${styles.legendItem} ${!segment.value ? styles.legendItemDimmed : ''}`}
          >
            <span className={styles.legendDot} style={{ backgroundColor: segment.color }} />
            <span>{segment.label || segment.name}</span>
            <strong>{segment.value || 0}</strong>
          </div>
        ))}
      </div>
    </article>
  );
}

function ServerMetric({ label, value, highlight }) {
  return (
    <div className={styles.serverMetric}>
      <span>{label}</span>
      <strong className={highlight ? styles.serverHighlight : ''}>{value}</strong>
    </div>
  );
}

function buildServerSummary(servers) {
  const list = Array.isArray(servers) ? servers : [];
  const summary = list.reduce((acc, server) => {
    const status = normalizeServerStatus(server.status);
    const maxPlayers = Number(server.maxPlayers) || 0;
    const currentPlayers = Number(server.currentPlayers) || 0;
    const region = String(server.region || '').trim().toLowerCase();

    acc.total += 1;
    acc.players += currentPlayers;
    acc.capacity += maxPlayers;
    if (region) acc.regions.add(region);
    if (status === 'online') acc.online += 1;
    if (status === 'cheio') acc.full += 1;
    if (status === 'manutencao') acc.maintenance += 1;
    if (status === 'offline') acc.offline += 1;
    return acc;
  }, {
    total: 0,
    online: 0,
    full: 0,
    maintenance: 0,
    offline: 0,
    players: 0,
    capacity: 0,
    regions: new Set(),
  });

  return {
    ...summary,
    regions: summary.regions.size,
    occupancy: summary.capacity > 0 ? Math.round((summary.players / summary.capacity) * 100) : 0,
  };
}

function getServerSortScore(server) {
  const statusScore = {
    online: 4,
    cheio: 3,
    manutencao: 2,
    offline: 1,
  }[normalizeServerStatus(server.status)] || 0;

  return (statusScore * 100000) + (Number(server.currentPlayers) || 0);
}

function normalizeServerStatus(status) {
  const value = String(status || '').trim().toLowerCase();
  if (value === 'online') return 'online';
  if (value === 'cheio') return 'cheio';
  if (value === 'manutencao' || value === 'manutenção') return 'manutencao';
  return 'offline';
}

function getServerStatusLabel(status) {
  const normalized = normalizeServerStatus(status);
  if (normalized === 'online') return 'ONLINE';
  if (normalized === 'cheio') return 'CHEIO';
  if (normalized === 'manutencao') return 'MANUTENÇÃO';
  return 'OFFLINE';
}

function getServerStatusKey(status) {
  const normalized = normalizeServerStatus(status);
  if (normalized === 'online') return 'Online';
  if (normalized === 'cheio') return 'Cheio';
  if (normalized === 'manutencao') return 'Manutencao';
  return 'Offline';
}

function getServerStatusTone(status) {
  const normalized = normalizeServerStatus(status);
  if (normalized === 'online') return 'toneTeal';
  if (normalized === 'cheio') return 'toneGold';
  if (normalized === 'manutencao') return 'tonePurple';
  return 'toneRed';
}

function getServerOccupancy(currentPlayers, maxPlayers) {
  const max = Number(maxPlayers) || 0;
  if (!max) return 0;
  return Math.round(((Number(currentPlayers) || 0) / max) * 100);
}

function getUserName(user) {
  return user.name || user.username || user.displayName || user.email?.split('@')[0] || 'Usuário';
}

function getStatusLabel(status) {
  const normalized = String(status || '').toLowerCase();
  if (normalized === 'active' || normalized === 'ativo') return 'ATIVO';
  if (normalized === 'banned' || normalized === 'banido') return 'BANIDO';
  return 'PENDENTE';
}

function formatAccess(value) {
  if (!value) {
    return 'Último acesso: não informado';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Último acesso: recente';
  }

  const diffMs = Date.now() - date.getTime();
  const diffHours = Math.max(0, Math.round(diffMs / 36e5));

  if (diffHours < 1) {
    return 'Último acesso: agora';
  }

  if (diffHours === 1) {
    return 'Último acesso: há 1 hora';
  }

  if (diffHours < 24) {
    return `Último acesso: há ${diffHours} horas`;
  }

  const diffDays = Math.round(diffHours / 24);
  return `Último acesso: há ${diffDays} dia${diffDays > 1 ? 's' : ''}`;
}

function normalizeUser(user) {
  if (!user) return null;

  return {
    id: user.id || user._id || null,
    email: user.email ? String(user.email).trim().toLowerCase() : null,
    name: user.name || user.username || user.displayName || null,
  };
}

function areUsersEquivalent(a, b) {
  if (!a || !b) return false;

  if (a.id && b.id && String(a.id) === String(b.id)) return true;
  if (a.email && b.email && a.email === b.email) return true;
  if (a.name && b.name && a.name.toLowerCase() === b.name.toLowerCase()) return true;

  return false;
}

function pickAccessFields(user) {
  return {
    lastAccess: user.lastAccess,
    lastLoginAt: user.lastLoginAt,
    updatedAt: user.updatedAt,
    createdAt: user.createdAt,
  };
}

function getUserAccessTime(user) {
  const value = user?.lastAccess || user?.lastLoginAt || user?.updatedAt || user?.createdAt;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function sum(values) {
  return values.reduce((total, value) => total + value, 0);
}

export default DashboardPage;



