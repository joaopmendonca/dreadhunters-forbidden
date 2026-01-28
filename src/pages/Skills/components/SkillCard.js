import React from 'react';
import Card from '../../../shared/components/Card';
import { buildIconSrc } from '../utils';

export function SkillCard({ skill, onEdit, onDelete }) {
  return (
    <Card key={skill._id} variant="blue">
      <Card.TopBar
        badge={
          <Card.Badge variant="blue">
            ✨ {skill.type === 'active' ? 'Ativa' : skill.type === 'passive' ? 'Passiva' : skill.type}
          </Card.Badge>
        }
      >
        <Card.Actions 
          onEdit={() => onEdit(skill)}
          onDelete={() => onDelete(skill._id)}
        />
      </Card.TopBar>

      <Card.Header
        image={skill.iconUrl ? buildIconSrc(skill.iconUrl) : null}
        type="SKILL"
        title={skill.name}
      >
        {!skill.iconUrl && <span style={{ fontSize: '2rem' }}>✨</span>}
      </Card.Header>

      <Card.Body>
        {skill.description && (
          <Card.Section title="Descrição">
            <p>{skill.description}</p>
          </Card.Section>
        )}
        
        <Card.Section title="Requisitos">
          <Card.StatList 
            stats={[
              { value: skill.type || 'active', label: 'Tipo' },
              { value: `Lv.${skill.levelRequirement || 1}`, label: 'Nível Mín.' }
            ]}
          />
        </Card.Section>

        {skill.classRestrictions?.length > 0 && (
          <Card.Section title="Classes">
            <span>{skill.classRestrictions.join(', ')}</span>
          </Card.Section>
        )}

        {skill.statsModifiers && Object.keys(skill.statsModifiers).length > 0 && (
          <Card.Section title="Modificadores">
            <Card.StatList 
              stats={Object.entries(skill.statsModifiers).map(([statName, value]) => ({
                value: value > 0 ? `+${value}` : String(value),
                label: statName.toUpperCase()
              }))}
            />
          </Card.Section>
        )}
      </Card.Body>
    </Card>
  );
}
