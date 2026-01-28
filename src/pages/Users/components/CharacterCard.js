// src/pages/Users/components/CharacterCard.js

import React, { useEffect, useState } from 'react';
import { FaUser, FaTrash, FaEdit } from 'react-icons/fa';
import Card from '../../../shared/components/Card';
import styles from '../styles/UserDetail.module.css';

export default function CharacterCard({ 
  character, 
  classes,
  fetchServerName,
  onEdit, 
  onDelete 
}) {
  const [serverName, setServerName] = useState(null);

  // Get class name
  const classObj = character.class 
    ? (typeof character.class === 'object' 
        ? character.class 
        : classes.find(c => c._id === character.class))
    : null;
  const className = classObj?.name || '—';

  // Fetch server name
  useEffect(() => {
    const serverId = character.server 
      ? (typeof character.server === 'object' ? character.server._id : character.server)
      : null;
    
    if (serverId && fetchServerName) {
      fetchServerName(serverId).then(name => setServerName(name));
    }
  }, [character.server, fetchServerName]);

  return (
    <Card variant="secondary" className={styles.characterCard}>
      <Card.TopBar>
        <Card.Actions 
          onEdit={() => onEdit(character)}
          onDelete={() => onDelete(character._id)} 
        />
      </Card.TopBar>

      <div className={styles.characterContent}>
        <div className={styles.characterHeader}>
          <div className={styles.characterAvatar}>
            {character.iconUrl ? (
              <img src={character.iconUrl} alt={character.name} className={styles.avatarImage} />
            ) : (
              <div className={styles.avatarPlaceholder}>
                <FaUser size={24} />
              </div>
            )}
          </div>
          
          <div className={styles.characterInfo}>
            <h3 className={styles.characterName}>{character.name}</h3>
            <p className={styles.characterClass}>
              {className} • Nível {character.level || 1}
            </p>
            {serverName && (
              <p className={styles.characterServer}>{serverName}</p>
            )}
          </div>
        </div>

        {/* Stats */}
        {character.stats && Object.keys(character.stats).length > 0 && (
          <div className={styles.statsSection}>
            <h4 className={styles.sectionTitle}>Stats</h4>
            <div className={styles.statsGrid}>
              {Object.entries(character.stats).slice(0, 4).map(([key, value]) => (
                <div key={key} className={styles.statItem}>
                  <span className={styles.statLabel}>{key}</span>
                  <span className={styles.statValue}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Inventory */}
        {character.inventory && character.inventory.length > 0 && (
          <div className={styles.inventorySection}>
            <h4 className={styles.sectionTitle}>Inventário ({character.inventory.length})</h4>
            <div className={styles.inventoryGrid}>
              {character.inventory.slice(0, 6).map((inv, idx) => {
                const item = inv.item || inv;
                const itemName = typeof item === 'object' ? item.name : 'Item';
                const iconUrl = typeof item === 'object' ? item.iconUrl : null;
                const qty = inv.quantity || 1;

                return (
                  <div key={idx} className={styles.inventoryItem}>
                    <div className={styles.itemIcon}>
                      {iconUrl ? (
                        <img src={iconUrl} alt={itemName} />
                      ) : (
                        <span className={styles.itemIconPlaceholder}>—</span>
                      )}
                    </div>
                    <div className={styles.itemInfo}>
                      <span className={styles.itemName}>{itemName}</span>
                      <span className={styles.itemQuantity}>x{qty}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            {character.inventory.length > 6 && (
              <p className={styles.moreItems}>
                +{character.inventory.length - 6} item{character.inventory.length - 6 > 1 ? 's' : ''}
              </p>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
