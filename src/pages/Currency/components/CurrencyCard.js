import Card from '../../../shared/components/Card';
import { buildIconSrc } from '../utils';

export default function CurrencyCard({ currency, onEdit, onDelete }) {
  return (
    <Card key={currency._id} variant="gold">
      <Card.TopBar badge={<Card.Badge variant="gold">💰 Moeda</Card.Badge>}>
        <Card.Actions
          onEdit={() => onEdit(currency)}
          onDelete={() => onDelete(currency._id)}
        />
      </Card.TopBar>

      <Card.Header
        image={currency.iconUrl ? buildIconSrc(currency.iconUrl) : null}
        title={currency.name}
      />

      <Card.Body>
        {currency.description && (
          <Card.Section title="Descrição">
            <p>{currency.description}</p>
          </Card.Section>
        )}
        <Card.Section title="Símbolo">
          <span style={{ fontSize: '1.5rem', color: 'var(--gold)' }}>
            {currency.symbol}
          </span>
        </Card.Section>
      </Card.Body>
    </Card>
  );
}
