// src/pages/ForbiddenBook/components/EntityModal.js

import { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { CHAPTERS, RARITY_COLORS } from '../constants';
import { useImageLightbox } from '../../../shared/components/ImageLightbox';
import styles from '../styles/EntityModal.module.css';
import TechnicalDetails, {
    buildAfflictionTechnicalDetails,
    buildAttributeTechnicalDetails,
    buildClassTechnicalDetails,
    buildDamageTypeTechnicalDetails,
    buildEnemyTechnicalDetails,
    buildItemTechnicalDetails,
    buildLocationTechnicalDetails,
    buildQuestTechnicalDetails,
    buildRoleTechnicalDetails,
    buildSkillTechnicalDetails
} from './TechnicalDetails';

// Imagem de cabeçalho clicável: abre em tela cheia com overlay
function HeaderImage({ src, alt, className }) {
  const { open } = useImageLightbox();
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onClick={() => open(src, alt)}
      title="Ver em tela cheia"
      style={{ cursor: 'zoom-in' }}
    />
  );
}

export default function EntityModal({ item, chapter, config, onClose }) {
  // Fechar com ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Prevenir scroll do body
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (!item) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Renderizadores de conteúdo específico
  const renderClassContent = () => (
    <>
      <div className={styles.modalHeader}>
        {item.iconUrl ? (
          <HeaderImage src={item.iconUrl} alt={item.name} className={styles.headerImage} />
        ) : (
          <span className={styles.headerIcon}>⚔️</span>
        )}
        <div className={styles.headerInfo}>
          <h2 className={styles.title}>{item.name}</h2>
          <span 
            className={styles.badge} 
            style={{ backgroundColor: item.role?.color || 'var(--maroon)' }}
          >
            {item.role?.name || 'Sem Role'}
          </span>
        </div>
      </div>
      <div className={styles.modalBody}>
        <p className={styles.description}>{item.description || 'Sem descrição.'}</p>
        {item.skills?.length > 0 && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Habilidades ({item.skills.length})</h3>
            <div className={styles.tagList}>
              {item.skills.map(sk => (
                <span key={sk._id} className={styles.tag}>{sk.name}</span>
              ))}
            </div>
          </div>
        )}
        <TechnicalDetails sections={buildClassTechnicalDetails(item)} />
      </div>
    </>
  );

  const renderAfflictionContent = () => (
    <>
      <div className={styles.modalHeader}>
        {item.imagemUrl ? (
          <HeaderImage src={item.imagemUrl} alt={item.nome} className={styles.headerImage} />
        ) : (
          <span className={styles.headerIcon}>☠️</span>
        )}
        <div className={styles.headerInfo}>
          <h2 className={styles.title}>{item.nome}</h2>
          <span 
            className={styles.badge}
            data-type={item.tipo}
          >
            {item.tipo === 'mental' ? '🧠 Mental' : '🦴 Física'}
          </span>
        </div>
      </div>
      <div className={styles.modalBody}>
        <p className={styles.description}>{item.descricao || 'Sem descrição.'}</p>
        {item.niveis?.length > 0 && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Níveis de Severidade</h3>
            <div className={styles.severityGrid}>
              {item.niveis.map((nivel, idx) => (
                <div key={idx} className={styles.severityCard} data-severity={nivel.severidade}>
                  <span className={styles.severityLabel}>
                    {nivel.severidade === 'leve' ? 'Leve' : nivel.severidade === 'media' ? 'Média' : 'Grave'}
                  </span>
                  {nivel.penalidades?.length > 0 && (
                    <div className={styles.penaltiesList}>
                      {nivel.penalidades.map((pen, pIdx) => (
                        <span key={pIdx} className={styles.penalty}>
                          {pen.atributo}: {pen.modificador > 0 ? '+' : ''}{pen.modificador}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        <TechnicalDetails sections={buildAfflictionTechnicalDetails(item)} />
      </div>
    </>
  );

  const renderDamageTypeContent = () => (
    <>
      <div className={styles.modalHeader}>
        <span 
          className={styles.headerIconBox}
          style={{ backgroundColor: item.cor || 'var(--maroon)' }}
        >
          {item.iconeUrl ? (
            <HeaderImage src={item.iconeUrl} alt={item.label} className={styles.headerIconImg} />
          ) : (
            '🔥'
          )}
        </span>
        <div className={styles.headerInfo}>
          <h2 className={styles.title} style={{ color: item.cor || 'inherit' }}>{item.label}</h2>
          <div className={styles.badgeRow}>
            <span className={styles.codeBadge}>{item.nome?.toUpperCase()}</span>
            <span 
              className={styles.colorSwatch}
              style={{ backgroundColor: item.cor || '#fff' }}
            />
          </div>
        </div>
      </div>
      <div className={styles.modalBody}>
        <p className={styles.description}>{item.descricao || 'Sem descrição.'}</p>
        {item.formula && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Fórmula de Cálculo</h3>
            <code className={styles.formula}>{item.formula}</code>
          </div>
        )}
        <TechnicalDetails sections={buildDamageTypeTechnicalDetails(item)} />
      </div>
    </>
  );

  const renderSkillContent = () => (
    <>
      <div className={styles.modalHeader}>
        {item.iconUrl ? (
          <HeaderImage src={item.iconUrl} alt={item.name} className={styles.headerImage} />
        ) : (
          <span className={styles.headerIcon} data-type={item.type}>
            {item.type === 'active' ? '⚡' : item.type === 'passive' ? '🔮' : '💀'}
          </span>
        )}
        <div className={styles.headerInfo}>
          <h2 className={styles.title}>{item.name}</h2>
          <div className={styles.badgeRow}>
            {item.cost && (
              <span className={styles.costBadge}>
                💧 {item.cost.mana || 0} | ⚡ {item.cost.stamina || 0}
              </span>
            )}
            {item.cooldown && (
              <span className={styles.cooldownBadge}>⏱️ {item.cooldown}s</span>
            )}
          </div>
        </div>
      </div>
      <div className={styles.modalBody}>
        <p className={styles.description}>{item.description || 'Sem descrição.'}</p>
        {item.damageTypes?.length > 0 && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Tipos de Dano</h3>
            <div className={styles.tagList}>
              {item.damageTypes.map(dt => (
                <span 
                  key={dt._id || dt} 
                  className={styles.tag}
                  style={{ backgroundColor: dt.color || 'var(--maroon)' }}
                >
                  {dt.name || dt}
                </span>
              ))}
            </div>
          </div>
        )}
        <TechnicalDetails sections={buildSkillTechnicalDetails(item)} />
      </div>
    </>
  );

  const renderItemContent = () => (
    <>
      <div className={styles.modalHeader}>
        {item.iconUrl ? (
          <HeaderImage src={item.iconUrl} alt={item.name} className={styles.headerImage} />
        ) : (
          <span className={styles.headerIcon}>🎒</span>
        )}
        <div className={styles.headerInfo}>
          <h2 
            className={styles.title}
            style={{ color: RARITY_COLORS[item.rarity] || 'inherit' }}
          >
            {item.name}
          </h2>
          <div className={styles.badgeRow}>
            <span className={styles.badge}>{item.type || 'Item'}</span>
            {item.rarity && (
              <span 
                className={styles.rarityBadge}
                style={{ color: RARITY_COLORS[item.rarity], borderColor: RARITY_COLORS[item.rarity] }}
              >
                {item.rarity}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className={styles.modalBody}>
        <p className={styles.description}>{item.description || 'Sem descrição.'}</p>
        {item.stats && Object.keys(item.stats).length > 0 && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Atributos</h3>
            <div className={styles.statsGrid}>
              {Object.entries(item.stats).map(([key, val]) => (
                <span key={key} className={styles.statItem}>
                  {key}: <strong>{val > 0 ? `+${val}` : val}</strong>
                </span>
              ))}
            </div>
          </div>
        )}
        <TechnicalDetails sections={buildItemTechnicalDetails(item)} />
      </div>
    </>
  );

  const renderEnemyContent = () => (
    <>
      <div className={styles.modalHeader}>
        {item.iconUrl ? (
          <HeaderImage src={item.iconUrl} alt={item.name} className={styles.headerImage} />
        ) : (
          <span className={styles.headerIcon}>👹</span>
        )}
        <div className={styles.headerInfo}>
          <h2 className={styles.title}>{item.name}</h2>
          <div className={styles.badgeRow}>
            <span className={styles.levelBadge}>Nv. {item.level || '?'}</span>
            <span className={styles.badge}>{item.category || item.type || 'Criatura'}</span>
          </div>
        </div>
      </div>
      <div className={styles.modalBody}>
        <p className={styles.description}>{item.description || 'Uma criatura das trevas.'}</p>
        {item.stats && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Estatísticas</h3>
            <div className={styles.statsGrid}>
              {item.stats.hp && <span className={styles.statItem}>❤️ HP: <strong>{item.stats.hp}</strong></span>}
              {item.stats.damage && <span className={styles.statItem}>⚔️ Dano: <strong>{item.stats.damage}</strong></span>}
              {item.stats.defense && <span className={styles.statItem}>🛡️ Defesa: <strong>{item.stats.defense}</strong></span>}
            </div>
          </div>
        )}
        <TechnicalDetails sections={buildEnemyTechnicalDetails(item)} />
      </div>
    </>
  );

  const renderQuestContent = () => (
    <>
      <div className={styles.modalHeader}>
        {item.iconUrl ? (
          <HeaderImage src={item.iconUrl} alt={item.title || item.name} className={styles.headerImage} />
        ) : (
          <span className={styles.headerIcon}>📋</span>
        )}
        <div className={styles.headerInfo}>
          <h2 className={styles.title}>{item.title || item.name}</h2>
          <div className={styles.badgeRow}>
            <span className={styles.badge}>{item.type || 'Missão'}</span>
            {item.level && <span className={styles.levelBadge}>Nv. {item.level}+</span>}
          </div>
        </div>
      </div>
      <div className={styles.modalBody}>
        <p className={styles.description}>{item.description || 'Detalhes da missão.'}</p>
        {item.objectives?.length > 0 && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Objetivos</h3>
            <ul className={styles.objectiveList}>
              {item.objectives.map((obj, idx) => (
                <li key={idx}>{obj.description || obj}</li>
              ))}
            </ul>
          </div>
        )}
        <TechnicalDetails sections={buildQuestTechnicalDetails(item)} />
      </div>
    </>
  );

  const renderLocationContent = () => (
    <>
      <div className={styles.modalHeader}>
        {item.iconUrl ? (
          <HeaderImage src={item.iconUrl} alt={item.name} className={styles.headerImage} />
        ) : (
          <span className={styles.headerIcon}>🗺️</span>
        )}
        <div className={styles.headerInfo}>
          <h2 className={styles.title}>{item.name}</h2>
          <div className={styles.badgeRow}>
            <span className={styles.badge}>{item.type || 'Área'}</span>
            {item.level && <span className={styles.levelBadge}>Nv. {item.level}+</span>}
          </div>
        </div>
      </div>
      <div className={styles.modalBody}>
        <p className={styles.description}>{item.description || 'Um lugar misterioso.'}</p>
        <TechnicalDetails sections={buildLocationTechnicalDetails(item)} />
      </div>
    </>
  );

  const renderAttributeContent = () => (
    <>
      <div className={styles.modalHeader}>
        {item.iconeUrl ? (
          <HeaderImage src={item.iconeUrl} alt={item.label} className={styles.headerImage} />
        ) : (
          <span className={styles.headerIcon}>📊</span>
        )}
        <div className={styles.headerInfo}>
          <h2 className={styles.title}>{item.label}</h2>
          <div className={styles.badgeRow}>
            <span className={styles.codeBadge}>{item.nome?.toUpperCase()}</span>
            <span 
              className={styles.typeBadge}
              data-type={item.tipo}
            >
              {item.tipo === 'base' ? 'Base' : 'Derivado'}
            </span>
          </div>
        </div>
      </div>
      <div className={styles.modalBody}>
        <p className={styles.description}>{item.descricao || 'Sem descrição.'}</p>
        {item.formula && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Fórmula</h3>
            <code className={styles.formula}>{item.formula}</code>
          </div>
        )}
        <div className={styles.metaGrid}>
          <span className={styles.metaItem}>📏 Unidade: {item.unidade || 'pontos'}</span>
          <span className={styles.metaItem}>📑 Ordem: {item.ordem}</span>
        </div>
        <TechnicalDetails sections={buildAttributeTechnicalDetails(item)} />
      </div>
    </>
  );

  const renderGenericContent = () => (
    <>
      <div className={styles.modalHeader}>
        <span 
          className={styles.headerIconBox}
          style={{ backgroundColor: item.color || 'var(--maroon)' }}
        >
          {config.icon}
        </span>
        <div className={styles.headerInfo}>
          <h2 className={styles.title}>{item.name || item.title}</h2>
          {item.category && (
            <span className={styles.badge}>{item.category}</span>
          )}
        </div>
      </div>
      <div className={styles.modalBody}>
        <p className={styles.description}>{item.description || 'Sem descrição disponível.'}</p>
        <TechnicalDetails sections={buildRoleTechnicalDetails(item)} />
      </div>
    </>
  );

  const renderContent = () => {
    switch (chapter) {
      case CHAPTERS.CLASSES:
        return renderClassContent();
      case CHAPTERS.SKILLS:
        return renderSkillContent();
      case CHAPTERS.ATTRIBUTES:
        return renderAttributeContent();
      case CHAPTERS.AFFLICTIONS:
        return renderAfflictionContent();
      case CHAPTERS.DAMAGE_TYPES:
        return renderDamageTypeContent();
      case CHAPTERS.ITEMS:
        return renderItemContent();
      case CHAPTERS.ENEMIES:
        return renderEnemyContent();
      case CHAPTERS.QUESTS:
        return renderQuestContent();
      case CHAPTERS.LOCATIONS:
        return renderLocationContent();
      default:
        return renderGenericContent();
    }
  };

  // Usar Portal para renderizar fora da hierarquia de stacking do livro
  return ReactDOM.createPortal(
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          ✕
        </button>
        <div className={styles.scrollContainer}>
          {renderContent()}
        </div>
      </div>
    </div>,
    document.body
  );
}
