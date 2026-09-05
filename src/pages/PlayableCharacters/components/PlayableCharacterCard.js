import React from 'react';
import Card from '../../../shared/components/Card';
import { buildImgSrc } from '../utils';
import { RARITIES } from '../constants';

const rarityLabel = (v) => RARITIES.find((r) => r.value === v)?.label || v || '—';

export default function PlayableCharacterCard({ template, onEdit, onDelete }) {
  return (
    <Card variant="gold">
      <Card.TopBar
        badge={<Card.Badge variant="gold">★ {rarityLabel(template.rarity)}</Card.Badge>}
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
        <Card.Section title="Nível base">
          <span>{template.baseLevel ?? 1}</span>
        </Card.Section>
        <Card.Section title="Desbloqueio">
          <span>{template.unlockRule?.type || 'starter'}</span>
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
