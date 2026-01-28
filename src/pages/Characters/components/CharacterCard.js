// src/pages/Characters/components/CharacterCard.js

import React from 'react';
import Card from '../../../shared/components/Card';
import { buildIconSrc } from '../utils';

export default function CharacterCard({ character, onEdit, onDelete }) {
  return (
    <Card variant="gold">
      <Card.TopBar
        badge={<Card.Badge variant="gold">⚔️ {character.className}</Card.Badge>}
      >
        <Card.Actions 
          onEdit={() => onEdit(character)}
          onDelete={() => onDelete(character._id)}
        />
      </Card.TopBar>

      <Card.Header
        image={character.iconUrl ? buildIconSrc(character.iconUrl) : null}
        type="NPC"
        title={character.name}
      >
        {!character.iconUrl && <span style={{ fontSize: '2rem' }}>🧙</span>}
      </Card.Header>

      <Card.Body>
        {character.description && (
          <Card.Section title="Descrição">
            <p>{character.description}</p>
          </Card.Section>
        )}
        <Card.Section title="Classe">
          <span>{character.className}</span>
        </Card.Section>
        <Card.Section title="Nível">
          <span>{character.level}</span>
        </Card.Section>
      </Card.Body>
    </Card>
  );
}
