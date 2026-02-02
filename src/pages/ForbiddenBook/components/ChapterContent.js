// src/pages/ForbiddenBook/components/ChapterContent.js

import { useState } from 'react';
import { CHAPTERS, RARITY_COLORS } from '../constants';
import api from '../../../config/api';
import styles from '../styles/ChapterContent.module.css';
import EntityModal from './EntityModal';

// Função para construir URL completa do ícone
const buildIconSrc = url => {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  const base = api.defaults.baseURL.replace(/\/api\/?$/, '');
  return `${base}${url}`;
};

export default function ChapterContent({ chapter, config, data }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [gameDesignExpanded, setGameDesignExpanded] = useState(false);

  // Sempre renderiza a estrutura da página
  const hasData = data && data.length > 0;

  const filteredData = hasData 
    ? data.filter(item => {
        const name = item.name || item.title || item.label || item.nome || '';
        return name.toLowerCase().includes(searchTerm.toLowerCase());
      })
    : [];

  const openModal = (item) => {
    setSelectedItem(item);
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  // Renderizadores específicos por tipo de capítulo (apenas preview no card)
  const renderClass = (item) => (
    <div className={styles.classCard}>
      <div className={styles.classHeader}>
        {item.iconUrl ? (
          <img src={buildIconSrc(item.iconUrl)} alt={item.name} className={styles.classImage} />
        ) : (
          <span className={styles.classIcon}>⚔️</span>
        )}
        <div className={styles.classInfo}>
          <h4 className={styles.itemTitle}>{item.name}</h4>
          <span className={styles.classRole} style={{ 
            backgroundColor: item.role?.color || 'var(--maroon)' 
          }}>
            {item.role?.name || 'Sem Role'}
          </span>
        </div>
      </div>
    </div>
  );

  const renderAffliction = (item) => (
    <div className={styles.afflictionCard}>
      <div className={styles.afflictionHeader}>
        {item.imagemUrl ? (
          <img src={buildIconSrc(item.imagemUrl)} alt={item.nome} className={styles.afflictionIcon} />
        ) : (
          <span className={styles.afflictionPlaceholder}>☠️</span>
        )}
        <div className={styles.afflictionInfo}>
          <h4 className={styles.itemTitle}>{item.nome}</h4>
          <div className={styles.afflictionMeta}>
            <span 
              className={styles.afflictionType}
              data-type={item.tipo}
            >
              {item.tipo === 'mental' ? '🧠 Mental' : '🦴 Física'}
            </span>
            {item.niveis?.length > 0 && (
              <span className={styles.afflictionLevels}>
                {item.niveis.length} níveis
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderDamageType = (item) => (
    <div className={styles.damageTypeCard}>
      <div className={styles.damageTypeHeader}>
        <span 
          className={styles.damageTypeIcon}
          style={{ backgroundColor: item.cor || 'var(--maroon)' }}
        >
          {item.iconeUrl ? (
            <img src={buildIconSrc(item.iconeUrl)} alt={item.label} className={styles.damageTypeImg} />
          ) : (
            '🔥'
          )}
        </span>
        <div className={styles.damageTypeInfo}>
          <h4 className={styles.itemTitle} style={{ color: item.cor || 'inherit' }}>
            {item.label}
          </h4>
          <div className={styles.damageTypeMeta}>
            <span className={styles.damageTypeCode}>{item.nome?.toUpperCase()}</span>
            <span 
              className={styles.damageTypeColor}
              style={{ backgroundColor: item.cor || '#fff' }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSkill = (item) => (
    <div className={styles.skillCard}>
      <div className={styles.skillHeader}>
        {item.iconUrl ? (
          <img src={buildIconSrc(item.iconUrl)} alt={item.name} className={styles.skillImage} />
        ) : (
          <span className={styles.skillType} data-type={item.type}>
            {item.type === 'active' ? '⚡' : item.type === 'passive' ? '🔮' : '💀'}
          </span>
        )}
        <div className={styles.skillInfo}>
          <h4 className={styles.itemTitle}>{item.name}</h4>
          <div className={styles.skillMeta}>
            {item.cost && (
              <span className={styles.skillCost}>
                💧 {item.cost.mana || 0} | ⚡ {item.cost.stamina || 0}
              </span>
            )}
            {item.cooldown && (
              <span className={styles.skillCooldown}>⏱️ {item.cooldown}s</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderItem = (item) => (
    <div className={styles.itemCard}>
      <div className={styles.itemHeader}>
        {item.iconUrl ? (
          <img src={buildIconSrc(item.iconUrl)} alt={item.name} className={styles.itemImage} />
        ) : (
          <span className={styles.itemPlaceholder}>🎒</span>
        )}
        <div className={styles.itemInfo}>
          <h4 
            className={styles.itemTitle}
            style={{ color: RARITY_COLORS[item.rarity] || 'inherit' }}
          >
            {item.name}
          </h4>
          <div className={styles.itemMeta}>
            <span className={styles.itemType}>{item.type || 'Item'}</span>
            {item.rarity && (
              <span 
                className={styles.itemRarity}
                style={{ color: RARITY_COLORS[item.rarity] }}
              >
                {item.rarity}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderEnemy = (item) => (
    <div className={styles.enemyCard}>
      <div className={styles.enemyHeader}>
        {item.iconUrl ? (
          <img src={buildIconSrc(item.iconUrl)} alt={item.name} className={styles.enemyImage} />
        ) : (
          <span className={styles.enemyIcon}>👹</span>
        )}
        <div className={styles.enemyInfo}>
          <h4 className={styles.itemTitle}>{item.name}</h4>
          <div className={styles.enemyMeta}>
            <span className={styles.enemyLevel}>Nv. {item.level || '?'}</span>
            <span className={styles.enemyType}>{item.category || item.type || 'Criatura'}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderQuest = (item) => (
    <div className={styles.questCard}>
      <div className={styles.questHeader}>
        {item.iconUrl ? (
          <img src={buildIconSrc(item.iconUrl)} alt={item.title || item.name} className={styles.questImage} />
        ) : (
          <span className={styles.questIcon}>📋</span>
        )}
        <div className={styles.questInfo}>
          <h4 className={styles.itemTitle}>{item.title || item.name}</h4>
          <div className={styles.questMeta}>
            <span className={styles.questType}>{item.type || 'Missão'}</span>
            {item.level && <span className={styles.questLevel}>Nv. {item.level}+</span>}
          </div>
        </div>
      </div>
    </div>
  );

  const renderLocation = (item) => (
    <div className={styles.locationCard}>
      <div className={styles.locationHeader}>
        {item.iconUrl ? (
          <img src={buildIconSrc(item.iconUrl)} alt={item.name} className={styles.locationImage} />
        ) : (
          <span className={styles.locationIcon}>🗺️</span>
        )}
        <div className={styles.locationInfo}>
          <h4 className={styles.itemTitle}>{item.name}</h4>
          <div className={styles.locationMeta}>
            <span className={styles.locationType}>{item.type || 'Área'}</span>
            {item.level && <span className={styles.locationLevel}>Nv. {item.level}+</span>}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAttribute = (item) => (
    <div className={styles.attributeCard}>
      <div className={styles.attributeHeader}>
        {item.iconeUrl ? (
          <img src={buildIconSrc(item.iconeUrl)} alt={item.label} className={styles.attributeIcon} />
        ) : (
          <span className={styles.attributePlaceholder}>📊</span>
        )}
        <div className={styles.attributeInfo}>
          <h4 className={styles.itemTitle}>{item.label}</h4>
          <div className={styles.attributeMeta}>
            <span className={styles.attributeCode}>{item.nome?.toUpperCase()}</span>
            <span 
              className={styles.attributeType}
              data-type={item.tipo}
            >
              {item.tipo === 'base' ? 'Base' : 'Derivado'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGeneric = (item) => (
    <div className={styles.genericCard}>
      <div className={styles.genericHeader}>
        <span 
          className={styles.genericIcon} 
          style={{ backgroundColor: item.color || 'var(--maroon)' }}
        >
          {config.icon}
        </span>
        <div className={styles.genericInfo}>
          <h4 className={styles.itemTitle}>{item.name || item.title}</h4>
          {item.category && (
            <span className={styles.genericCategory}>{item.category}</span>
          )}
        </div>
      </div>
    </div>
  );

  const renderCard = (item) => {
    switch (chapter) {
      case CHAPTERS.CLASSES:
        return renderClass(item);
      case CHAPTERS.SKILLS:
        return renderSkill(item);
      case CHAPTERS.ATTRIBUTES:
        return renderAttribute(item);
      case CHAPTERS.AFFLICTIONS:
        return renderAffliction(item);
      case CHAPTERS.DAMAGE_TYPES:
        return renderDamageType(item);
      case CHAPTERS.ITEMS:
        return renderItem(item);
      case CHAPTERS.ENEMIES:
        return renderEnemy(item);
      case CHAPTERS.QUESTS:
        return renderQuest(item);
      case CHAPTERS.LOCATIONS:
        return renderLocation(item);
      default:
        return renderGeneric(item);
    }
  };

  return (
    <div className={styles.container}>
      {/* Introdução do capítulo */}
      {config.intro && (
        <div className={styles.intro}>
          <div className={styles.introDecor}>
            <span className={styles.introLine} />
            <span className={styles.introSymbol}>❧</span>
            <span className={styles.introLine} />
          </div>
          <p className={styles.introText}>{config.intro}</p>
          <div className={styles.introDecor}>
            <span className={styles.introLine} />
            <span className={styles.introSymbol}>❧</span>
            <span className={styles.introLine} />
          </div>
        </div>
      )}

      {/* Seção de Game Design */}
      {config.gameDesign && (
        <div className={styles.gameDesign}>
          <div 
            className={styles.gameDesignHeader}
            onClick={() => setGameDesignExpanded(!gameDesignExpanded)}
          >
            <span className={styles.gameDesignIcon}>🎮</span>
            <h3 className={styles.gameDesignTitle}>Notas de Game Design</h3>
            <span className={styles.gameDesignToggle}>
              {gameDesignExpanded ? '▼' : '▶'}
            </span>
          </div>
          {gameDesignExpanded && (
            <>
              <div className={styles.gameDesignDisclaimer}>
                ⚠️ Em desenvolvimento, pode conter erros ou informações ainda não definidas pelos desenvolvedores
              </div>
              <div className={styles.gameDesignContent}>
                {(() => {
                  const lines = config.gameDesign.split('\n');
                  let inCodeBlock = false;
                  const elements = [];

                  lines.forEach((line, idx) => {
                    // Toggle code block
                    if (line.startsWith('```')) {
                      inCodeBlock = !inCodeBlock;
                      return;
                    }

                    // Code block content
                    if (inCodeBlock) {
                      elements.push(
                        <code key={idx} className={styles.gameDesignCode}>
                          {line}
                        </code>
                      );
                      return;
                    }

                    // Subtítulo (markdown bold)
                    if (line.startsWith('**') && line.endsWith('**')) {
                      elements.push(
                        <h4 key={idx} className={styles.gameDesignSubtitle}>
                          {line.replace(/\*\*/g, '')}
                        </h4>
                      );
                      return;
                    }

                // Lista
                if (line.trim().startsWith('•')) {
                  elements.push(
                    <li key={idx} className={styles.gameDesignListItem}>
                      {line.replace('•', '').trim()}
                    </li>
                  );
                  return;
                }

                // Linha vazia
                if (line.trim() === '') {
                  elements.push(<br key={idx} />);
                  return;
                }

                // Texto normal
                elements.push(
                  <p key={idx} className={styles.gameDesignText}>
                    {line}
                  </p>
                );
              });

              return elements;
            })()}
          </div>
            </>
          )}
        </div>
      )}

      {/* Barra de pesquisa - só mostra se houver dados */}
      {hasData && (
        <div className={styles.searchBar}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder={`Buscar em ${config.title}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <span className={styles.resultCount}>
            {filteredData.length} registro{filteredData.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* Lista de itens ou estado vazio */}
      {hasData ? (
        <>
          <div className={styles.itemsGrid}>
            {filteredData.map(item => (
              <div 
                key={item._id} 
                className={styles.cardWrapper}
                onClick={() => openModal(item)}
              >
                {renderCard(item)}
              </div>
            ))}
          </div>

          {filteredData.length === 0 && searchTerm && (
            <div className={styles.noResults}>
              <p>Nenhum resultado para "{searchTerm}"</p>
            </div>
          )}
        </>
      ) : (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>📭</span>
          <p className={styles.emptyText}>Nenhum registro encontrado neste capítulo.</p>
          <p className={styles.emptyHint}>Os escribas ainda não documentaram este conhecimento.</p>
        </div>
      )}

      {/* Modal de detalhes */}
      {selectedItem && (
        <EntityModal
          item={selectedItem}
          chapter={chapter}
          config={config}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
