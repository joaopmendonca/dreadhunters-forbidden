import React from 'react';
import Card from '../../../shared/components/Card';
import { buildIconSrc, getAttributeEmoji } from '../utils';

export function AttributeCard({ attribute, onEdit, onDelete }) {
  return (
    <Card key={attribute._id} variant={attribute.tipo === 'base' ? 'blue' : 'mental'}>
      <Card.TopBar
        badge={
          <Card.Badge variant={attribute.tipo === 'base' ? 'blue' : 'mental'}>
            {attribute.tipo === 'base' ? '🎲 Base' : '🧮 Derivado'}
          </Card.Badge>
        }
      >
        <Card.Actions 
          onEdit={() => onEdit(attribute)}
          onDelete={() => onDelete(attribute._id)}
        />
      </Card.TopBar>

      <Card.Header
        image={attribute.iconeUrl ? buildIconSrc(attribute.iconeUrl) : null}
        type={attribute.nome}
        title={attribute.label || attribute.nome}
      >
        {!attribute.iconeUrl && (
          <span style={{ fontSize: '2rem' }}>{getAttributeEmoji(attribute.nome)}</span>
        )}
      </Card.Header>

      <Card.Body>
        {attribute.descricao && (
          <Card.Section title="Descrição">
            <p>{attribute.descricao}</p>
          </Card.Section>
        )}

        <Card.Section title="Propriedades">
          <Card.StatList 
            stats={[
              { value: attribute.visivel ? '👁️' : '🙈', label: attribute.visivel ? 'Visível' : 'Oculto' },
              { value: `#${attribute.ordem || 0}`, label: 'Ordem' },
              ...(attribute.unidade ? [{ value: attribute.unidade, label: 'Unidade' }] : [])
            ]}
          />
        </Card.Section>

        {attribute.formula && (
          <Card.Section title="Fórmula">
            <code style={{ 
              display: 'block', 
              padding: '0.5rem', 
              background: 'rgba(0,0,0,0.3)', 
              borderRadius: '4px',
              fontSize: '0.8rem',
              color: 'var(--gold)'
            }}>
              {attribute.formula}
            </code>
          </Card.Section>
        )}
      </Card.Body>
    </Card>
  );
}
