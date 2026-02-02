import React from 'react';
import { FaEdit, FaTrash, FaSkull } from 'react-icons/fa';
import StatsRadarChart from '../../../shared/components/StatsRadarChart';
import { buildIconSrc } from '../utils';
import api from '../../../config/api';
import styles from '../styles/EnemyCard.module.css';

export default function EnemyCard({ enemy, items, currencies, onEdit, onDelete }) {
  const baseURL = api.defaults.baseURL;

  const baseStatus = [
    { nome: 'str', label: 'STR', iconeUrl: null },
    { nome: 'dex', label: 'DEX', iconeUrl: null },
    { nome: 'con', label: 'CON', iconeUrl: null },
    { nome: 'int', label: 'INT', iconeUrl: null },
    { nome: 'wit', label: 'WIT', iconeUrl: null },
    { nome: 'men', label: 'MEN', iconeUrl: null }
  ];

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

  const getTypeBadgeColor = () => {
    switch(enemy.type) {
      case 'boss': return '#ff4444';
      case 'elite': return '#ff9933';
      default: return '#888';
    }
  };

  return (
    <div className={styles.card}>
      {/* Artwork Hero */}
      <div className={styles.hero}>
        {enemy.artworkUrl ? (
          <>
            <div 
              className={styles.heroBg} 
              style={{ backgroundImage: `url(${buildIconSrc(enemy.artworkUrl, baseURL)})` }}
            />
            <img 
              src={buildIconSrc(enemy.artworkUrl, baseURL)} 
              alt={enemy.name} 
              className={styles.heroImg}
            />
          </>
        ) : (
          <div className={styles.heroPlaceholder}>
            {enemy.iconUrl && (
              <img src={buildIconSrc(enemy.iconUrl, baseURL)} alt="" className={styles.heroIcon} />
            )}
          </div>
        )}
        
        {/* Overlay com nome */}
        <div className={styles.heroOverlay}>
          <div className={styles.heroInfo}>
            {enemy.iconUrl && (
              <img src={buildIconSrc(enemy.iconUrl, baseURL)} alt="" className={styles.enemyIcon} />
            )}
            <div className={styles.heroText}>
              <h3 className={styles.enemyName}>{enemy.name}</h3>
              <div className={styles.badges}>
                <span className={styles.typeBadge} style={{ backgroundColor: getTypeBadgeColor() }}>
                  {enemy.type}
                </span>
                <span className={styles.levelBadge}>Lvl {enemy.level}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className={styles.actions}>
          <button className={styles.actionBtn} onClick={() => onEdit(enemy)} title="Editar">
            <FaEdit />
          </button>
          <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => onDelete(enemy._id)} title="Excluir">
            <FaTrash />
          </button>
        </div>
      </div>

      {/* Conteúdo */}
      <div className={styles.content}>
        {/* Descrição */}
        {enemy.description && (
          <p className={styles.description}>{enemy.description}</p>
        )}

        {/* Gráfico Radar */}
        {baseStatus?.length > 0 && enemy.stats && (
          <div className={styles.chartSection}>
            <StatsRadarChart
              statsDistribution={enemy.stats}
              baseStatus={baseStatus}
              isPercentage={false}
              height={180}
              color="#c41e3a"
            />
          </div>
        )}

        {/* Recompensas */}
        {enemy.experienceReward > 0 && (
          <div className={styles.rewardSection}>
            <div className={styles.xpReward}>
              <span className={styles.xpLabel}>⭐ XP</span>
              <span className={styles.xpValue}>{enemy.experienceReward}</span>
            </div>
          </div>
        )}

        {/* Drops */}
        {(enemy.loot?.length > 0 || enemy.currencyLoot?.length > 0) && (
          <div className={styles.dropsSection}>
            <span className={styles.dropTitle}>💰 Drops</span>
            <div className={styles.cardRewards}>
              {renderDrops(enemy.loot || [], enemy.currencyLoot || [])}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
