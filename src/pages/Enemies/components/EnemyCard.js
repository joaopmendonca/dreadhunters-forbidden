import Card from '../../../shared/components/Card';
import useStatus from '../../../shared/hooks/useStatus';
import { buildIconSrc } from '../utils';
import styles from '../styles/Enemies.module.css';

export default function EnemyCard({ enemy, items, currencies, onEdit, onDelete }) {
  const { baseStatus } = useStatus();

  const renderDrops = (loot, currencyLoot) => (
    <>
      {loot?.map((l, i) => {
        const item = items.find(it => it._id === (l.item?._id || l.item));
        if (!item) return null;
        return (
          <div
            key={`i-${i}`}
            className={styles.rewardEntry}
            title={`${item.name} ×${l.minQuantity}–${l.maxQuantity} — ${Math.round((l.dropChance || 0) * 100)}%`}
          >
            <img src={buildIconSrc(item.iconUrl)} alt="" className={styles.rewardIcon} />
            <span>{Math.round((l.dropChance || 0) * 100)}% até x{l.maxQuantity}</span>
          </div>
        );
      })}
      {currencyLoot?.map((c, i) => {
        const curr = currencies.find(cc => cc._id === (c.currency?._id || c.currency));
        if (!curr) return null;
        return (
          <div
            key={`c-${i}`}
            className={styles.rewardEntry}
            title={`${curr.name} ×${c.minAmount}–${c.maxAmount}`}
          >
            <img src={buildIconSrc(curr.iconUrl)} alt="" className={styles.rewardIcon} />
            <span>x{c.minAmount}–{c.maxAmount}</span>
          </div>
        );
      })}
    </>
  );

  return (
    <Card key={enemy._id} variant="maroon">
      <Card.TopBar 
        badge={
          <>
            <Card.Badge variant="maroon">{enemy.type}</Card.Badge>
            <Card.Badge variant="orange">Lvl {enemy.level}</Card.Badge>
          </>
        }
      >
        <Card.Actions
          onEdit={() => onEdit(enemy)}
          onDelete={() => onDelete(enemy._id)}
        />
      </Card.TopBar>

      <Card.Header
        image={enemy.iconUrl ? buildIconSrc(enemy.iconUrl) : null}
        title={enemy.name}
      />

      <Card.Body>
        {enemy.description && (
          <Card.Section title="Descrição">
            <p>{enemy.description}</p>
          </Card.Section>
        )}

        {/* Stats dinâmicos */}
        <Card.Section title="Atributos">
          <div className={styles.statsGroup}>
            {baseStatus.map(status => {
              const value = enemy.stats?.[status.nome] || 0;
              return (
                <div key={status.nome}>
                  {status.iconeUrl && (
                    <img src={status.iconeUrl} alt={status.label} className={styles.statIcon} />
                  )}
                  <span>{value}</span>
                </div>
              );
            })}
          </div>
        </Card.Section>

        {enemy.experienceReward > 0 && (
          <Card.Section title="Recompensa">
            <Card.StatList
              stats={[{ label: 'XP', value: enemy.experienceReward }]}
            />
          </Card.Section>
        )}

        {(enemy.loot?.length > 0 || enemy.currencyLoot?.length > 0) && (
          <Card.Section title="Drops">
            <div className={styles.cardRewards}>
              {renderDrops(enemy.loot || [], enemy.currencyLoot || [])}
            </div>
          </Card.Section>
        )}
      </Card.Body>
    </Card>
  );
}
