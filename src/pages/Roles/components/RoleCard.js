import Card from '../../../shared/components/Card';
import StatsRadarChart from '../../../shared/components/StatsRadarChart';
import { useStatus } from '../../../shared/hooks/useStatus';

export default function RoleCard({ role, onEdit, onDelete }) {
  const { baseStatus } = useStatus();
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
        {role.statsDistribution && Object.keys(role.statsDistribution).length > 0 && (
          <Card.Section title="Distribuição de Stats">
            <StatsRadarChart
              statsDistribution={role.statsDistribution}
              baseStatus={baseStatus}
              isPercentage={true}
              height={220}
            />
          </Card.Section>
        )}
        <Card.Section title="Descrição">
          <p style={{ opacity: role.description ? 1 : 0.5 }}>
            {role.description || 'Sem descrição'}
          </p>
        </Card.Section>
      </Card.Body>
    </Card>
  );
}
