import React from 'react';
import Card from '../../../shared/components/Card';
import StatsRadarChart from '../../../shared/components/StatsRadarChart';
import { buildImgSrc } from '../utils';

const UNLOCK_LABEL = { starter: 'Inicial', quest: 'Quest', shop: 'Loja', event: 'Evento' };
const mapToObj = (m) => (m instanceof Map ? Object.fromEntries(m) : m || {});

export default function PlayableCharacterCard({ template, baseStatus = [], onEdit, onDelete }) {
  const distribution = mapToObj(template.classBaseStats);
  const hasStats = (baseStatus || []).some((s) => Number(distribution[s.nome]) > 0);

  return (
    <Card variant="gold">
      <Card.TopBar
        badge={<Card.Badge variant="gold">⚔️ {template.className}</Card.Badge>}
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
      >
        {!template.portraitUrl && <span style={{ fontSize: '2rem' }}>🧝</span>}
      </Card.Header>

      <Card.Body>
        {template.description && (
          <Card.Section title="Descrição">
            <p>{template.description}</p>
          </Card.Section>
        )}
        <Card.Section title="Classe">
          <span>{template.className}</span>
        </Card.Section>
        {hasStats && (
          <Card.Section title="Atributos (da classe)">
            <StatsRadarChart
              statsDistribution={distribution}
              baseStatus={baseStatus}
              isPercentage={false}
              height={180}
              color="#d4af37"
            />
          </Card.Section>
        )}
        <Card.Section title="Nível base">
          <span>{template.baseLevel ?? 1}</span>
        </Card.Section>
        <Card.Section title="Desbloqueio">
          <span>{UNLOCK_LABEL[template.unlockRule?.type] || template.unlockRule?.type || 'Inicial'}</span>
        </Card.Section>
        {template.isActive === false && (
          <Card.Section title="Status">
            <span style={{ color: 'var(--maroon, #a33)' }}>Inativo</span>
          </Card.Section>
        )}
      </Card.Body>
    </Card>
  );
}
