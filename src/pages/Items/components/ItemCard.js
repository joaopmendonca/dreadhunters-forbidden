import Card from '../../../shared/components/Card';
import { buildIconSrc } from '../utils';
import styles from '../styles/Items.module.css';

export default function ItemCard({ item, onEdit, onDelete }) {
  return (
    <Card key={item._id} variant="orange">
      <Card.TopBar 
        badge={
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Card.Badge variant="orange">{item.type}</Card.Badge>
            <Card.Badge variant="gold">{item.rarity}</Card.Badge>
          </div>
        }
      >
        <Card.Actions
          onEdit={() => onEdit(item)}
          onDelete={() => onDelete(item._id)}
        />
      </Card.TopBar>

      <Card.Header
        image={item.iconUrl ? buildIconSrc(item.iconUrl) : null}
        title={item.name}
      />

      <Card.Body>
        {/* Descrição */}
        {item.description && (
          <Card.Section title="Descrição">
            <p>{item.description}</p>
          </Card.Section>
        )}

        {/* Propriedades Básicas */}
        <Card.Section title="Propriedades">
          <Card.StatList
            stats={[
              ...(item.buyPrice > 0 || item.sellPrice > 0 
                ? [{ label: 'Compra / Venda', value: `🪙 ${item.buyPrice} / 🏷️ ${item.sellPrice}` }] 
                : []),
              ...(item.stackable 
                ? [{ label: 'Empilhável', value: `Até ${item.maxStack}` }] 
                : []),
              ...(item.requirements?.level > 1 
                ? [{ label: 'Requisito', value: `Nível ≥${item.requirements.level}${item.requirements.classes?.length > 0 ? ` – ${item.requirements.classes.join(', ')}` : ''}` }] 
                : []),
            ]}
          />
        </Card.Section>

        {/* Consumível */}
        {item.type === 'consumable' && item.consumable && (
          <Card.Section title="Consumível">
            <Card.StatList
              stats={[
                { label: 'Restaura', value: `+${item.consumable.hpRestore} HP, +${item.consumable.mpRestore} MP` },
                ...(item.consumable.buff 
                  ? [{ label: 'Buff', value: `${item.consumable.buff} (${item.consumable.buffDuration}s)` }] 
                  : []),
              ]}
            />
          </Card.Section>
        )}

        {/* Equipamento */}
        {item.type === 'equipment' && item.equipment && (
          <Card.Section title="Equipamento">
            <Card.StatList
              stats={[
                { label: 'Slot', value: item.equipment.slot },
                { label: 'Durabilidade', value: `${item.equipment.durability?.current || 0} / ${item.equipment.durability?.max || 0}` },
                ...(item.equipment.slot === 'weapon' ? [
                  { label: 'Tipo de Arma', value: item.equipment.isPrimary ? 'Primária' : 'Secundária' },
                  { label: 'Mãos', value: `${item.equipment.hands} mão${item.equipment.hands > 1 ? 's' : ''}` },
                  ...(item.equipment.ammoMax > 0 
                    ? [{ label: 'Munição', value: `${item.equipment.ammoCurrent} / ${item.equipment.ammoMax}` }] 
                    : []),
                ] : []),
              ]}
            />
            {/* Bônus de Stats - mostrar apenas valores, sem ícones já que são dinâmicos */}
            {Object.entries(item.equipment.combatStats || {})
              .filter(([, v]) => v > 0).length > 0 && (
              <div className={styles.bonusStatsBlock}>
                {Object.entries(item.equipment.combatStats)
                  .filter(([, v]) => v > 0)
                  .map(([key, value]) => (
                    <div key={key} className={styles.bonusStatItem}>
                      <span>{key}: +{value}</span>
                    </div>
                  ))}
              </div>
            )}
          </Card.Section>
        )}

        {/* Material Tags */}
        {item.type === 'material' && item.tags?.length > 0 && (
          <Card.Section title="Tags">
            <div className={styles.tagsBlock}>
              {item.tags.map((tag, idx) => (
                <span key={idx} className={styles.tagLabel}>{tag}</span>
              ))}
            </div>
          </Card.Section>
        )}

        {/* Key / Quest Item */}
        {(item.type === 'key' || item.type === 'quest') && (
          <Card.Section title="Uso">
            <p>
              {item.type === 'key'
                ? 'Chave – uso específico no jogo'
                : 'Quest item – utilizado em missões'}
            </p>
          </Card.Section>
        )}
      </Card.Body>
    </Card>
  );
}
