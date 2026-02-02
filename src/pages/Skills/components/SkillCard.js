import React from 'react';
import { GiCrossedSwords } from 'react-icons/gi';
import Card from '../../../shared/components/Card';
import { buildIconSrc } from '../utils';

const TARGET_LABELS = {
  self: 'Si Mesmo',
  ally: 'Aliado',
  all_allies: 'Todos Aliados',
  enemy: 'Inimigo',
  all_enemies: 'Todos Inimigos'
};

const DAMAGE_TYPE_LABELS = {
  physical: 'Físico',
  magical: 'Mágico',
  true: 'Verdadeiro',
  none: 'Nenhum'
};

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
        {!skill.iconUrl && <GiCrossedSwords style={{ fontSize: '2rem', color: 'var(--gold)' }} />}
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

        {skill.cost && (skill.cost.resources?.length > 0 || skill.cost.items?.length > 0) && (
          <Card.Section title="Custo">
            {skill.cost.resources?.map((r, idx) => (
              <p key={`res-${idx}`} style={{ margin: '0.25rem 0', fontSize: '0.85rem', color: 'var(--light-1)' }}>
                💎 {r.resource?.toUpperCase() || 'RECURSO'}: <strong style={{ color: '#f87171' }}>
                  -{r.value}{r.type === 'percent' ? '%' : ''}
                </strong>
              </p>
            ))}
            {skill.cost.items?.map((item, idx) => (
              <p key={`item-${idx}`} style={{ margin: '0.25rem 0', fontSize: '0.85rem', color: 'var(--light-1)' }}>
                📦 {item.item?.name || 'Item'}: <strong style={{ color: '#f87171' }}>
                  -{item.quantity}{item.type === 'percent' ? '%' : ''}
                </strong>
              </p>
            ))}
          </Card.Section>
        )}

        {skill.damage && skill.damage.type !== 'none' && skill.damage.formula && (
          <Card.Section title="Dano">
            <p style={{ margin: '0.25rem 0', fontSize: '0.85rem', color: 'var(--light-1)' }}>
              <strong style={{ color: '#fbbf24' }}>{DAMAGE_TYPE_LABELS[skill.damage.type] || skill.damage.type}</strong>
            </p>
            <p style={{ margin: '0.25rem 0', fontSize: '0.8rem', color: 'var(--light-2)', fontFamily: 'monospace' }}>
              {skill.damage.formula}
            </p>
          </Card.Section>
        )}

        {skill.targets && skill.targets.length > 0 && (
          <Card.Section title="Alvos">
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {skill.targets.map((target, idx) => (
                <span 
                  key={idx} 
                  style={{ 
                    padding: '0.25rem 0.5rem', 
                    background: 'rgba(74, 158, 255, 0.2)', 
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    color: '#4a9eff',
                    border: '1px solid rgba(74, 158, 255, 0.4)'
                  }}
                >
                  {TARGET_LABELS[target] || target}
                </span>
              ))}
            </div>
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

        {skill.recurringEffects && skill.recurringEffects.length > 0 && (
          <Card.Section title="Efeitos Recorrentes">
            {skill.recurringEffects.map((effect, idx) => {
              const frequencyText = effect.frequency.type === 'turn' 
                ? `A cada ${effect.frequency.value} turno${effect.frequency.value > 1 ? 's' : ''}`
                : `A cada ${effect.frequency.value} min`;
              
              const valueText = effect.modifierType === 'percent'
                ? `${effect.value > 0 ? '+' : ''}${effect.value}%`
                : `${effect.value > 0 ? '+' : ''}${effect.value}`;
              
              return (
                <p key={idx} style={{ margin: '0.25rem 0', fontSize: '0.85rem', color: 'var(--light-1)' }}>
                  🔄 {frequencyText}: <strong style={{ color: effect.value < 0 ? '#f87171' : '#4ade80' }}>
                    {valueText}
                  </strong> {effect.stat.toUpperCase()}
                </p>
              );
            })}
          </Card.Section>
        )}
      </Card.Body>
    </Card>
  );
}
