import React from 'react';
import { GiSwordClash } from 'react-icons/gi';
import Card from '../../../shared/components/Card';

export function QuestActionTypeCard({ actionType, onEdit, onDelete }) {
  return (
    <Card variant="blue">
      <Card.TopBar>
        <Card.Actions
          onEdit={() => onEdit(actionType)}
          onDelete={() => onDelete(actionType._id)}
        />
      </Card.TopBar>

      <Card.Header
        type="ACTION TYPE"
        title={actionType.name}
      >
        <GiSwordClash style={{ fontSize: '2rem', color: 'var(--gold)' }} />
      </Card.Header>

      <Card.Body>
        {actionType.description && (
          <Card.Section title="Descrição">
            <p>{actionType.description}</p>
          </Card.Section>
        )}

        <Card.Section title="Tempo Base">
          <Card.StatList
            stats={[
              { value: `${actionType.baseDurationMinutes} min`, label: 'Duração' },
              { value: actionType.statModifiers?.length || 0, label: 'Mod. Stats' },
              { value: actionType.itemModifiers?.length || 0, label: 'Mod. Itens' },
              { value: actionType.activeEffectModifiers?.length || 0, label: 'Mod. Efeitos' }
            ]}
          />
        </Card.Section>
      </Card.Body>
    </Card>
  );
}
