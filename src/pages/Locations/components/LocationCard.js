import Card from '../../../shared/components/Card';
import { buildIconSrc } from '../utils';
import styles from '../styles/Locations.module.css';

export default function LocationCard({ location, onEdit, onDelete }) {
  return (
    <Card variant="green">
      <Card.TopBar badge={<Card.Badge variant="green">📍 Local</Card.Badge>}>
        <Card.Actions onEdit={onEdit} onDelete={onDelete} />
      </Card.TopBar>

      <Card.Header
        image={location.iconUrl ? buildIconSrc(location.iconUrl) : null}
        title={location.name}
      />

      <Card.Body>
        {location.description && (
          <Card.Section title="Descrição">
            <p>{location.description}</p>
          </Card.Section>
        )}

        <Card.Section title="Coordenadas">
          <Card.StatList
            stats={[
              { label: 'Posição X', value: location.position?.x ?? 0 },
              { label: 'Posição Y', value: location.position?.y ?? 0 }
            ]}
          />
        </Card.Section>
      </Card.Body>
    </Card>
  );
}
