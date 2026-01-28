import Card from '../../../shared/components/Card';
import { ACTION_ICONS } from '../constants';
import styles from '../styles/Logs.module.css';

export default function LogCard({ log }) {
  const icon = ACTION_ICONS[log.action?.toUpperCase()] || '📋';
  const timestamp = new Date(log.timestamp).toLocaleString('pt-BR');

  return (
    <Card variant="blue">
      <Card.TopBar
        badge={
          <Card.Badge variant="blue">
            {icon} {log.action}
          </Card.Badge>
        }
      />

      <Card.Body>
        <Card.Section title="Detalhes">
          <Card.StatList
            stats={[
              { label: 'Usuário', value: log.userName },
              { label: 'Data/Hora', value: timestamp },
              { label: 'Recurso', value: log.resource || '—' }
            ]}
          />
        </Card.Section>

        {log.details && (
          <Card.Section title="Informações Adicionais">
            <p className={styles.details}>{log.details}</p>
          </Card.Section>
        )}
      </Card.Body>
    </Card>
  );
}
