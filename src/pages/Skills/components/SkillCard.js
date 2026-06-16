import React from 'react';
import { GiCrossedSwords } from 'react-icons/gi';
import Card from '../../../shared/components/Card';
import { buildIconSrc } from '../utils';
import styles from '../styles/Skills.module.css';

const TARGET_LABELS = {
  self: 'Si Mesmo',
  ally: 'Aliado',
  all_allies: 'Todos Aliados',
  enemy: 'Inimigo',
  all_enemies: 'Todos Inimigos',
};

const DAMAGE_TYPE_LABELS = {
  physical: 'Físico',
  magical: 'Mágico',
  true: 'Verdadeiro',
  none: 'Nenhum',
};

export function SkillCard({ skill, onEdit, onDelete }) {
  const typeLabel = skill.type === 'active' ? 'Ativa' : skill.type === 'passive' ? 'Passiva' : skill.type;

  return (
    <Card key={skill._id} variant="blue">
      <Card.TopBar
        badge={<Card.Badge variant="blue">{typeLabel}</Card.Badge>}
      >
        <Card.Actions
          onEdit={() => onEdit(skill)}
          onDelete={() => onDelete(skill._id)}
        />
      </Card.TopBar>

      <div className={styles.skillHeader}>
        <div className={styles.skillIconWrap}>
          {skill.iconUrl
            ? <img src={buildIconSrc(skill.iconUrl)} alt="" className={styles.skillIconImg} />
            : <GiCrossedSwords className={styles.skillIconGlyph} />
          }
        </div>
        <div className={styles.skillMeta}>
          <span className={styles.skillKicker}>Skill · {typeLabel}</span>
          <h3 className={styles.skillName}>{skill.name}</h3>
          <span className={styles.skillLevel}>Nível mín. {skill.levelRequirement || 1}</span>
        </div>
      </div>

      <Card.Body>
        {skill.description && (
          <Card.Section>
            <p>{skill.description}</p>
          </Card.Section>
        )}

        {skill.classRestrictions?.length > 0 && (
          <Card.Section title="Classes">
            <span>{skill.classRestrictions.join(', ')}</span>
          </Card.Section>
        )}

        {skill.cost && (skill.cost.resources?.length > 0 || skill.cost.items?.length > 0) && (
          <Card.Section title="Custo">
            {skill.cost.resources?.map((r, idx) => (
              <p key={`res-${idx}`}>
                {r.resource?.toUpperCase() || 'RECURSO'}: <strong style={{ color: '#f87171' }}>
                  -{r.value}{r.type === 'percent' ? '%' : ''}
                </strong>
              </p>
            ))}
            {skill.cost.items?.map((item, idx) => (
              <p key={`item-${idx}`}>
                {item.item?.name || 'Item'}: <strong style={{ color: '#f87171' }}>
                  -{item.quantity}{item.type === 'percent' ? '%' : ''}
                </strong>
              </p>
            ))}
          </Card.Section>
        )}

        {skill.damage?.type !== 'none' && skill.damage?.formula && (
          <Card.Section title="Dano">
            <p><strong style={{ color: '#fbbf24' }}>{DAMAGE_TYPE_LABELS[skill.damage.type] || skill.damage.type}</strong></p>
            <p style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--light-2)' }}>{skill.damage.formula}</p>
          </Card.Section>
        )}

        {skill.targets?.length > 0 && (
          <Card.Section title="Alvos">
            <div className={styles.skillTargets}>
              {skill.targets.map((target, idx) => (
                <span key={idx} className={styles.skillTargetPill}>
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
                label: statName.toUpperCase(),
              }))}
            />
          </Card.Section>
        )}

        {skill.recurringEffects?.length > 0 && (
          <Card.Section title="Efeitos Recorrentes">
            {skill.recurringEffects.map((effect, idx) => {
              const frequencyText = effect.frequency.type === 'turn'
                ? `A cada ${effect.frequency.value} turno${effect.frequency.value > 1 ? 's' : ''}`
                : `A cada ${effect.frequency.value} min`;
              const valueText = effect.modifierType === 'percent'
                ? `${effect.value > 0 ? '+' : ''}${effect.value}%`
                : `${effect.value > 0 ? '+' : ''}${effect.value}`;
              return (
                <p key={idx}>
                  {frequencyText}: <strong style={{ color: effect.value < 0 ? '#f87171' : '#4ade80' }}>
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
