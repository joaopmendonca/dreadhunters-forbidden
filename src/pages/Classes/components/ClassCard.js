// src/pages/Classes/components/ClassCard.js

import React, { useState, Suspense, lazy } from 'react';
import { FaSitemap, FaEdit, FaTrash } from 'react-icons/fa';
import StatsRadarChart from '../../../shared/components/StatsRadarChart';
import { buildIconSrc } from '../utils';
import api from '../../../config/api';
import styles from '../styles/ClassCard.module.css';

const SkillTreeModal = lazy(() => import('./SkillTreeModal'));

export default function ClassCard({ cls, statsList, onEdit, onDelete }) {
  const baseURL = api.defaults.baseURL;
  const [skillTreeOpen, setSkillTreeOpen] = useState(false);

  const unlockedSkills = cls.skillTree?.roots?.filter(r => r.unlocked) || [];
  const allSkills = cls.skillTree?.roots || [];

  return (
    <div className={styles.card}>
      {/* Artwork Hero */}
      <div className={styles.hero}>
        {cls.artworkUrl ? (
          <>
            <div 
              className={styles.heroBg} 
              style={{ backgroundImage: `url(${buildIconSrc(cls.artworkUrl, baseURL)})` }}
            />
            <img 
              src={buildIconSrc(cls.artworkUrl, baseURL)} 
              alt={cls.name} 
              className={styles.heroImg}
            />
          </>
        ) : (
          <div className={styles.heroPlaceholder}>
            {cls.iconUrl ? (
              <img src={buildIconSrc(cls.iconUrl, baseURL)} alt="" className={styles.heroIcon} />
            ) : (
              <span className={styles.heroEmoji}>⚔️</span>
            )}
          </div>
        )}
        
        {/* Overlay com nome */}
        <div className={styles.heroOverlay}>
          <div className={styles.heroInfo}>
            {cls.iconUrl && (
              <img src={buildIconSrc(cls.iconUrl, baseURL)} alt="" className={styles.classIcon} />
            )}
            <div className={styles.heroText}>
              <h3 className={styles.className}>{cls.name}</h3>
              {cls.role?.name && <span className={styles.roleBadge}>{cls.role.name}</span>}
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className={styles.actions}>
          <button className={styles.actionBtn} onClick={() => onEdit(cls)} title="Editar">
            <FaEdit />
          </button>
          <button className={styles.actionBtn} onClick={() => setSkillTreeOpen(true)} title="Skill Tree">
            <FaSitemap />
          </button>
          <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => onDelete(cls._id)} title="Excluir">
            <FaTrash />
          </button>
        </div>
      </div>

      {/* Conteúdo */}
      <div className={styles.content}>
        {/* Descrição */}
        {cls.description && (
          <p className={styles.description}>{cls.description}</p>
        )}

        {/* Gráfico Radar */}
        {statsList?.length > 0 && cls.baseStats && (
          <div className={styles.chartSection}>
            <StatsRadarChart
              statsDistribution={cls.baseStats}
              baseStatus={statsList}
              isPercentage={false}
              height={180}
              color="#c5893a"
            />
          </div>
        )}

        {/* Skills */}
        {(unlockedSkills.length > 0 || allSkills.length > 0) && (
          <div className={styles.skillsSection}>
            {unlockedSkills.length > 0 && (
              <div className={styles.skillGroup}>
                <span className={styles.skillGroupTitle}>✨ Iniciais</span>
                <div className={styles.skillTags}>
                  {unlockedSkills.slice(0, 3).map((root, idx) => {
                    const skill = root.skill;
                    const name = typeof skill === 'string' ? skill : (skill?.name || 'Skill');
                    return (
                      <span key={idx} className={`${styles.skillTag} ${styles.unlocked}`}>
                        {name}
                      </span>
                    );
                  })}
                  {unlockedSkills.length > 3 && (
                    <span className={styles.skillMore}>+{unlockedSkills.length - 3}</span>
                  )}
                </div>
              </div>
            )}
            
            {allSkills.length > 0 && (
              <div className={styles.skillGroup}>
                <span className={styles.skillGroupTitle}>🌳 Skill Tree</span>
                <span className={styles.skillCount}>{allSkills.length} skills</span>
              </div>
            )}
          </div>
        )}

        {/* Especiais */}
        {cls.specials?.length > 0 && (
          <div className={styles.specialsSection}>
            {cls.specials.map((s, i) => (
              <span key={i} className={styles.specialBadge}>⭐ {s.name}</span>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {skillTreeOpen && (
        <Suspense fallback={null}>
          <SkillTreeModal
            isOpen={skillTreeOpen}
            onClose={() => setSkillTreeOpen(false)}
            cls={cls}
          />
        </Suspense>
      )}
    </div>
  );
}