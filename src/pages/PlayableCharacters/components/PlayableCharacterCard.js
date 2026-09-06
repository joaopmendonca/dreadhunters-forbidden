import React from 'react';
import Card from '../../../shared/components/Card';
import StatsRadarChart from '../../../shared/components/StatsRadarChart';
import { buildImgSrc } from '../utils';
import styles from '../styles/PlayableCharacters.module.css';

const UNLOCK_LABEL = { starter: 'Inicial', quest: 'Quest', shop: 'Loja', event: 'Evento' };
const mapToObj = (m) => (m instanceof Map ? Object.fromEntries(m) : m || {});

export default function PlayableCharacterCard({ template, baseStatus = [], onEdit, onDelete }) {
  const distribution = mapToObj(template.classBaseStats);
  const hasStats = (baseStatus || []).some((s) => Number(distribution[s.nome]) > 0);
  const unlockLabel = UNLOCK_LABEL[template.unlockRule?.type] || 'Inicial';

  return (
    <Card variant="gold">
      <Card.TopBar
        badge={
          <span className={styles.badgeGroup}>
            <Card.Badge variant="gold">⚔️ {template.className}</Card.Badge>
            {template.isActive === false && <Card.Badge variant="maroon">Inativo</Card.Badge>}
          </span>
        }
      >
        <Card.Actions
          onEdit={() => onEdit(template)}
          onDelete={() => onDelete(template._id)}
        />
      </Card.TopBar>

      <Card.Header
        image={template.portraitUrl ? buildImgSrc(template.portraitUrl) : null}
        type="Jogável"
        title={template.name}
        subtitle={`Nível base ${template.baseLevel ?? 1} · ${unlockLabel}`}
      >
        {!template.portraitUrl && <span style={{ fontSize: '2rem' }}>🧝</span>}
      </Card.Header>

      <Card.Body>
        {template.description && (
          <Card.Section title="Descrição">
            <p className={styles.cardClamp}>{template.description}</p>
          </Card.Section>
        )}

        {template.history && (
          <Card.Section title="História">
            <p className={`${styles.cardClamp} ${styles.cardHistory}`}>{template.history}</p>
          </Card.Section>
        )}

        {hasStats && (
          <div className={styles.cardRadarBlock}>
            <Card.SectionLabel>atributos da classe</Card.SectionLabel>
            <StatsRadarChart
              statsDistribution={distribution}
              baseStatus={baseStatus}
              isPercentage={false}
              height={160}
              color="#d4af37"
            />
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
