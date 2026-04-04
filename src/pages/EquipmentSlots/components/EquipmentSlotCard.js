import Card from '../../../shared/components/Card';
import { buildImageSrc } from '../utils';

export default function EquipmentSlotCard({ equipmentSlot, onEdit, onDelete }) {
  const hasIcon = equipmentSlot.iconUrl;

  return (
    <Card variant="maroon">
      <Card.TopBar
        badge={
          <>
            {!equipmentSlot.active && <Card.Badge variant="gray">Inativo</Card.Badge>}
            <Card.Badge variant="maroon">{equipmentSlot.key}</Card.Badge>
          </>
        }
      >
        <Card.Actions
          onEdit={() => onEdit(equipmentSlot)}
          onDelete={() => onDelete(equipmentSlot._id)}
        />
      </Card.TopBar>

      <Card.Header
        image={hasIcon ? buildImageSrc(equipmentSlot.iconUrl) : null}
        title={equipmentSlot.name}
        icon={!hasIcon ? '🧩' : null}
        iconBgColor="var(--dark-3)"
      />

      <Card.Body>
        {equipmentSlot.description && (
          <Card.Section title="Descricao">
            <p>{equipmentSlot.description}</p>
          </Card.Section>
        )}

        <Card.Section title="Propriedades">
          <Card.StatList
            stats={[
              { label: 'Max Itens', value: equipmentSlot.maxItems },
              { label: 'Ordem', value: equipmentSlot.order },
              { label: 'Status', value: equipmentSlot.active ? 'Ativo' : 'Inativo' }
            ]}
          />
        </Card.Section>
      </Card.Body>
    </Card>
  );
}
