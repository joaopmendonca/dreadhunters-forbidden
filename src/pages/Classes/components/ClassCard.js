// src/pages/Classes/components/ClassCard.js

import React, { useState } from 'react';
import { FaSitemap } from 'react-icons/fa';
import Card from '../../../shared/components/Card';
import IconButton from '../../../shared/components/IconButton';
import { buildIconSrc } from '../utils';
import api from '../../../config/api';
import styles from '../styles/Classes.module.css';

const SkillTreeModal = React.lazy(() => import('./SkillTreeModal'));

export default function ClassCard({ cls, statsList, onEdit, onDelete }) {
  const baseURL = api.defaults.baseURL;
  const [skillTreeOpen, setSkillTreeOpen] = useState(false);

  return (
    <Card variant="maroon">
      <Card.TopBar
        badge={
          <Card.Badge variant="maroon">
            {cls.iconUrl
              ? <img src={buildIconSrc(cls.iconUrl, baseURL)} alt="" style={{ width: 16, height: 16, marginRight: 6 }} />
              : '⚔️ '}
            {cls.name}
          </Card.Badge>
        }
      >
        <Card.Actions 
          onEdit={() => onEdit(cls)}
          onDelete={() => onDelete(cls._id)}
        />
      </Card.TopBar>

      <Card.Header
        image={cls.artworkUrl ? buildIconSrc(cls.artworkUrl, baseURL) : null}
        title={cls.name}
        subtitle={cls.role?.name || ''}
      />

      <Card.Body>
        {cls.description && (
          <Card.Section title="Descrição">
            <p>{cls.description}</p>
          </Card.Section>
        )}

        {/* Atributos Base dinâmicos */}
        {statsList.length > 0 && (
          <Card.Section title="Atributos Base">
            <div className={styles.baseStatsGrid}>
              {statsList.slice(0, 6).map(stat => (
                <div key={stat._id} className={styles.statItem}>
                  <span className={styles.statLabel}>{stat.label || stat.nome}</span>
                  <span className={styles.statValue}>{cls.baseStats?.[stat.nome] || 0}</span>
                </div>
              ))}
            </div>
          </Card.Section>
        )}

        {/* Atributos Derivados */}
        {cls.calculatedStats && (
          <Card.Section title="Atributos Derivados">
            <div className={styles.derivedStatsGrid}>
              <div className={styles.derivedItem}>
                <span className={styles.derivedLabel}>HP Máximo</span>
                <span className={styles.derivedValue}>{Math.floor(cls.calculatedStats.max_hp || 0)}</span>
              </div>
              <div className={styles.derivedItem}>
                <span className={styles.derivedLabel}>SP Máximo</span>
                <span className={styles.derivedValue}>{Math.floor(cls.calculatedStats.max_sp || 0)}</span>
              </div>
              <div className={styles.derivedItem}>
                <span className={styles.derivedLabel}>CP Máximo</span>
                <span className={styles.derivedValue}>{Math.floor(cls.calculatedStats.max_cp || 0)}</span>
              </div>
              <div className={styles.derivedItem}>
                <span className={styles.derivedLabel}>Regen HP</span>
                <span className={styles.derivedValue}>{(cls.calculatedStats.regen_hp || 0).toFixed(2)}</span>
              </div>
              <div className={styles.derivedItem}>
                <span className={styles.derivedLabel}>Regen SP</span>
                <span className={styles.derivedValue}>{(cls.calculatedStats.regen_sp || 0).toFixed(2)}</span>
              </div>
              <div className={styles.derivedItem}>
                <span className={styles.derivedLabel}>Regen CP</span>
                <span className={styles.derivedValue}>{(cls.calculatedStats.regen_cp || 0).toFixed(2)}</span>
              </div>
              <div className={styles.derivedItem}>
                <span className={styles.derivedLabel}>Ataque Físico</span>
                <span className={styles.derivedValue}>{Math.floor(cls.calculatedStats.p_atk || 0)}</span>
              </div>
              <div className={styles.derivedItem}>
                <span className={styles.derivedLabel}>Ataque Mágico</span>
                <span className={styles.derivedValue}>{Math.floor(cls.calculatedStats.m_atk || 0)}</span>
              </div>
              <div className={styles.derivedItem}>
                <span className={styles.derivedLabel}>Taxa Crítico</span>
                <span className={styles.derivedValue}>{(cls.calculatedStats.crit_rate || 0).toFixed(1)}</span>
              </div>
              <div className={styles.derivedItem}>
                <span className={styles.derivedLabel}>Dano Crítico</span>
                <span className={styles.derivedValue}>{Math.floor(cls.calculatedStats.crit_dmg || 0)}</span>
              </div>
              <div className={styles.derivedItem}>
                <span className={styles.derivedLabel}>Defesa Física</span>
                <span className={styles.derivedValue}>{Math.floor(cls.calculatedStats.p_def || 0)}</span>
              </div>
              <div className={styles.derivedItem}>
                <span className={styles.derivedLabel}>Defesa Mágica</span>
                <span className={styles.derivedValue}>{Math.floor(cls.calculatedStats.m_def || 0)}</span>
              </div>
              <div className={styles.derivedItem}>
                <span className={styles.derivedLabel}>Evasão</span>
                <span className={styles.derivedValue}>{(cls.calculatedStats.evasion || 0).toFixed(1)}</span>
              </div>
            </div>
          </Card.Section>
        )}

        {/* Skills Desbloqueadas (Skill Tree) */}
        {cls.skillTree?.roots && cls.skillTree.roots.filter(r => r.unlocked).length > 0 && (
          <Card.Section title="✨ Skills Iniciais">
            <div className={styles.skillsList}>
              {cls.skillTree.roots.filter(r => r.unlocked).map((root, idx) => {
                const skill = root.skill;
                const skillName = typeof skill === 'string' ? skill : (skill?.name || skill?._id || 'Sem nome');
                const skillIcon = typeof skill === 'string' ? null : skill?.iconUrl;
                
                return (
                  <div key={idx} className={styles.skillItem} title={skillName}>
                    {skillIcon && (
                      <img 
                        src={buildIconSrc(skillIcon, baseURL)} 
                        alt={skillName} 
                        className={styles.skillIconImg}
                      />
                    )}
                    <span className={styles.skillName}>{skillName}</span>
                    <span className={styles.skillLevel} style={{ background: 'var(--gold)', color: 'var(--dark)' }}>
                      Lv.{root.requiredLevel || 1}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card.Section>
        )}

        {/* Skill Tree - Nós Raiz */}
        {cls.skillTree?.roots && cls.skillTree.roots.length > 0 && (
          <Card.Section title="Skill Tree - Disponíveis">
            <div className={styles.skillsList}>
              {cls.skillTree.roots.map((root, idx) => {
                const skill = root.skill;
                const skillName = typeof skill === 'string' ? skill : (skill.name || skill._id || 'Sem nome');
                const skillIcon = typeof skill === 'string' ? null : skill.iconUrl;
                
                return (
                  <div key={idx} className={styles.skillItem} title={skillName}>
                    {skillIcon && (
                      <img 
                        src={buildIconSrc(skillIcon, baseURL)} 
                        alt={skillName} 
                        className={styles.skillIconImg}
                      />
                    )}
                    <span className={styles.skillName}>{skillName}</span>
                    <span className={styles.skillLevel} style={{ background: 'var(--maroon)', color: 'var(--light)' }}>
                      Nv. {root.requiredLevel || 1}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card.Section>
        )}

        {cls.specials && cls.specials.length > 0 && (
          <Card.Section title="Especiais">
            <span>{cls.specials.map(s => s.name).join(', ')}</span>
          </Card.Section>
        )}
      </Card.Body>

      <Card.Footer>
        <IconButton
          icon={<FaSitemap />}
          onClick={() => setSkillTreeOpen(true)}
          hoverColor="var(--gold)"
          title="Skill Tree"
        />
      </Card.Footer>

      {skillTreeOpen && (
        <React.Suspense fallback={<div>Carregando...</div>}>
          <SkillTreeModal
            isOpen={skillTreeOpen}
            onClose={() => setSkillTreeOpen(false)}
            cls={cls}
          />
        </React.Suspense>
      )}
    </Card>
  );
}
