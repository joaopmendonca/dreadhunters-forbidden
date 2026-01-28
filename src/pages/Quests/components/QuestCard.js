import Card from '../../../shared/components/Card';
import { OBJECTIVE_ICONS } from '../constants';
import { buildIconSrc } from '../utils';
import styles from '../styles/Quests.module.css';

export default function QuestCard({ quest, onEdit, onDelete, items = [], currencies = [], locations = [] }) {
  const location = locations.find(l => l._id === (quest.location?._id || quest.locationId));

  const getTypeVariant = () => {
    switch (quest.type) {
      case 'main': return 'gold';
      case 'side': return 'green';
      case 'daily': return 'blue';
      default: return 'default';
    }
  };

  const getTypeLabel = () => {
    switch (quest.type) {
      case 'main': return 'Principal';
      case 'side': return 'Secundária';
      case 'daily': return 'Diária';
      default: return quest.type;
    }
  };

  return (
    <Card variant={getTypeVariant()}>
      <Card.TopBar badge={<Card.Badge variant={getTypeVariant()}>📜 {getTypeLabel()}</Card.Badge>}>
        <Card.Actions onEdit={onEdit} onDelete={onDelete} />
      </Card.TopBar>

      <Card.Header
        image={quest.iconUrl ? buildIconSrc(quest.iconUrl) : null}
        title={quest.title}
      />

      <Card.Body>
        {quest.description && (
          <Card.Section title="Descrição">
            <p>{quest.description}</p>
          </Card.Section>
        )}

        <Card.Section title="Informações">
          <Card.StatList
            stats={[
              { label: 'Local', value: location?.name || '—' },
              {
                label: 'Pré-requisitos',
                value: quest.prerequisites?.length
                  ? quest.prerequisites.map(p => p.title || p).join(', ')
                  : '—'
              }
            ]}
          />
        </Card.Section>

        {quest.objectives?.length > 0 && (
          <Card.Section title="Objetivos">
            <ul className={styles.objectivesList}>
              {quest.objectives.map((o, i) => (
                <li key={i} className={styles.objectiveItem}>
                  <span className={styles.objectiveIcon}>{OBJECTIVE_ICONS[o.type] || '•'}</span>
                  <span className={styles.objectiveText}>
                    {o.description} ({o.quantity})
                  </span>
                </li>
              ))}
            </ul>
          </Card.Section>
        )}

        {(quest.rewards?.xp > 0 || quest.rewards?.items?.length > 0 || quest.rewards?.currencies?.length > 0) && (
          <Card.Section title="Recompensas">
            <div className={styles.rewardsContainer}>
              {quest.rewards.xp > 0 && (
                <div className={styles.rewardEntry}>
                  <span className={styles.rewardLabel}>⚡ XP:</span>
                  <span className={styles.rewardValue}>{quest.rewards.xp}</span>
                </div>
              )}

              {quest.rewards.items?.map((ri, i) => {
                const item = items.find(x => x._id === (ri.itemId?._id || ri.itemId));
                if (!item) return null;
                return (
                  <div key={i} className={styles.rewardEntry}>
                    {item.iconUrl && (
                      <img src={buildIconSrc(item.iconUrl)} alt={item.name} className={styles.rewardIcon} />
                    )}
                    <span className={styles.rewardText}>
                      {item.name} × {ri.quantity}
                    </span>
                  </div>
                );
              })}

              {quest.rewards.currencies?.map((rc, i) => {
                const currency = currencies.find(x => x._id === (rc.currencyId?._id || rc.currencyId));
                if (!currency) return null;
                return (
                  <div key={i} className={styles.rewardEntry}>
                    {currency.iconUrl && (
                      <img src={buildIconSrc(currency.iconUrl)} alt={currency.name} className={styles.rewardIcon} />
                    )}
                    <span className={styles.rewardText}>
                      {currency.name} × {rc.amount}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card.Section>
        )}
      </Card.Body>
    </Card>
  );
}
