// src/pages/Classes/components/ClassCard.js

import React from 'react';
import { FaSitemap } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Card from '../../../shared/components/Card';
import IconButton from '../../../shared/components/IconButton';
import { buildIconSrc } from '../utils';
import api from '../../../config/api';
import styles from '../styles/Classes.module.css';

export default function ClassCard({ cls, statsList, onEdit, onDelete }) {
  const navigate = useNavigate();
  const baseURL = api.defaults.baseURL;

  return (
    <Card variant="maroon">
      <Card.TopBar
        badge={
          <Card.Badge variant="maroon">
            {cls.iconUrl
              ? <img src={buildIconSrc(cls.iconUrl, baseURL)} alt="" style={{ width: 16, height: 16, marginRight: 6 }} />
              : '⚔️ '}
            {cls.name}
          </Card.Badge>
        }
      >
        <Card.Actions 
          onEdit={() => onEdit(cls)}
          onDelete={() => onDelete(cls._id)}
        />
      </Card.TopBar>

      <Card.Header
        image={cls.artworkUrl ? buildIconSrc(cls.artworkUrl, baseURL) : null}
        title={cls.name}
        subtitle={cls.role?.name || ''}
      />

      <Card.Body>
        {cls.description && (
          <Card.Section title="Descrição">
            <p>{cls.description}</p>
          </Card.Section>
        )}

        {/* Atributos Base dinâmicos */}
        {statsList.length > 0 && (
          <Card.Section title="Atributos Base">
            <div className={styles.statIcons}>
              {statsList.slice(0, 6).map(stat => (
                <span key={stat._id} className={styles.statIcon} title={stat.label || stat.nome}>
                  {stat.iconUrl 
                    ? <img src={buildIconSrc(stat.iconUrl, baseURL)} alt={stat.nome} className={styles.statImg} />
                    : <span className={styles.statEmoji}>{stat.emoji || '📊'}</span>
                  }
                  {cls.baseStats?.[stat.nome] || 0}
                </span>
              ))}
            </div>
          </Card.Section>
        )}

        {cls.specials && cls.specials.length > 0 && (
          <Card.Section title="Especiais">
            <span>{cls.specials.map(s => s.name).join(', ')}</span>
          </Card.Section>
        )}
      </Card.Body>

      <Card.Footer>
        <IconButton
          icon={<FaSitemap />}
          onClick={() => navigate(`/classes/${cls._id}/skill-tree`)}
          hoverColor="var(--gold)"
          title="Skill Tree"
        />
      </Card.Footer>
    </Card>
  );
}
