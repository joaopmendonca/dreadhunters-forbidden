import React from 'react';
import { GiSwordClash } from 'react-icons/gi';
import Card from '../../../shared/components/Card';
import styles from '../styles/QuestActionTypeCard.module.css';

export function QuestActionTypeCard({ actionType, onEdit, onDelete }) {
  const stats = [
    { value: `${actionType.baseDurationMinutes} min`, label: 'Duração' },
    { value: actionType.statModifiers?.length || 0, label: 'Mod. Stats' },
    { value: actionType.itemModifiers?.length || 0, label: 'Mod. Itens' },
    { value: actionType.activeEffectModifiers?.length || 0, label: 'Mod. Efeitos' }
  ];

  return (
    <Card variant="blue" className={styles.card}>
      <Card.TopBar>
        <Card.Actions
          onEdit={() => onEdit(actionType)}
          onDelete={() => onDelete(actionType._id)}
        />
      </Card.TopBar>

      <Card.Body className={styles.body}>
        <div className={styles.header}>
          <div className={styles.iconWrap}>
            <GiSwordClash className={styles.icon} />
          </div>

          <div className={styles.headerInfo}>
            <h3 className={styles.title}>{actionType.name}</h3>
          </div>
        </div>

        {actionType.description && (
          <section className={styles.section}>
            <span className={styles.sectionLabel}>Descrição</span>
            <p className={styles.description}>{actionType.description}</p>
          </section>
        )}

        <section className={styles.section}>
          <span className={styles.sectionLabel}>Tempo Base</span>
          <div className={styles.statsGrid}>
            {stats.map(stat => (
              <div key={stat.label} className={styles.statTile}>
                <strong className={styles.statValue}>{stat.value}</strong>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
        </section>
      </Card.Body>
    </Card>
  );
}
