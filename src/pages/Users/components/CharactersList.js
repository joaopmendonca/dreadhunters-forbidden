// src/pages/Users/components/CharactersList.js

import React from 'react';
import Card from '../../../shared/components/Card';
import CharacterCard from './CharacterCard';
import styles from '../styles/UserDetail.module.css';

export default function CharactersList({ 
  characters, 
  classes,
  fetchServerName,
  onEditCharacter, 
  onDeleteCharacter 
}) {
  return (
    <Card>
      <Card.Header 
        title="Personagens" 
        badge={characters && characters.length > 0 ? (
          <Card.Badge variant="neutral">{characters.length}</Card.Badge>
        ) : null}
      />
      <Card.Body>
        {characters && characters.length > 0 ? (
          <div className={styles.charactersList}>
            {characters.map(char => (
              <CharacterCard
                key={char._id}
                character={char}
                classes={classes}
                fetchServerName={fetchServerName}
                onEdit={onEditCharacter}
                onDelete={onDeleteCharacter}
              />
            ))}
          </div>
        ) : (
          <p className={styles.emptyMessage}>Nenhum personagem encontrado.</p>
        )}
      </Card.Body>
    </Card>
  );
}
