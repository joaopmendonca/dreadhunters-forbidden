import React from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import Card from '../../../shared/components/Card';
import { buildIconSrc } from '../utils';

export default function LocationCard({ location, onEdit, onDelete }) {
  return (
    <Card key={location._id} variant="blue">
      <Card.TopBar
        badge={
          <Card.Badge variant="blue">
            <FaMapMarkerAlt /> Local
          </Card.Badge>
        }
      >
        <Card.Actions 
          onEdit={() => onEdit(location)}
          onDelete={() => onDelete(location._id)}
        />
      </Card.TopBar>

      <Card.Header
        image={location.iconUrl ? buildIconSrc(location.iconUrl) : null}
        type="LOCATION"
        title={location.name}
      >
        {!location.iconUrl && (
          <FaMapMarkerAlt style={{ fontSize: '2rem', color: 'var(--gold)' }} />
        )}
      </Card.Header>

      <Card.Body>
        {location.description && (
          <Card.Section title="Descrição">
            <p>{location.description}</p>
          </Card.Section>
        )}

        <Card.Section title="Coordenadas">
          <Card.StatList 
            stats={[
              { value: location.position?.x ?? 0, label: 'Posição X' },
              { value: location.position?.y ?? 0, label: 'Posição Y' }
            ]}
          />
        </Card.Section>
      </Card.Body>
    </Card>
  );
}
