import Card from '../../../shared/components/Card';

export default function RoleCard({ role, onEdit, onDelete }) {
  return (
    <Card key={role._id} variant="gold">
      <Card.TopBar
        badge={<Card.Badge variant="gold">🛡️ Role</Card.Badge>}
      >
        <Card.Actions 
          onEdit={() => onEdit(role)}
          onDelete={() => onDelete(role._id)}
        />
      </Card.TopBar>

      <Card.Header
        title={role.name}
      />

      <Card.Body>
        <Card.Section title="Descrição">
          <p style={{ opacity: role.description ? 1 : 0.5 }}>
            {role.description || 'Sem descrição'}
          </p>
        </Card.Section>
      </Card.Body>
    </Card>
  );
}
