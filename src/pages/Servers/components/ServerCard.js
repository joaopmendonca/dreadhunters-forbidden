import React from 'react';
import Card from '../../../shared/components/Card';
import { getStatusIcon, getStatusLabel } from '../utils';

export const ServerCard = ({ server, onEdit, onDelete }) => {
  const statusVariant = server.status === 'online' ? 'green' : 'maroon';
  const statusIcon = getStatusIcon(server.status);
  const statusLabel = getStatusLabel(server.status);

  return (
    <Card variant="blue">
      <Card.TopBar
        badge={
          <Card.Badge variant={statusVariant}>
            {statusIcon} {statusLabel}
          </Card.Badge>
        }
      >
        <Card.Actions
          onEdit={() => onEdit(server)}
          onDelete={() => onDelete(server.slug)}
        />
      </Card.TopBar>
      <Card.Header title={`${server.name} (${server.slug})`} />
      <Card.Body>
        <Card.Section title="Informações">
          <Card.StatList
            stats={[
              {
                label: 'Jogadores',
                value: `${server.currentPlayers} / ${server.maxPlayers}`,
              },
              { label: 'Região', value: server.region || '—' },
            ]}
          />
        </Card.Section>
      </Card.Body>
    </Card>
  );
};
