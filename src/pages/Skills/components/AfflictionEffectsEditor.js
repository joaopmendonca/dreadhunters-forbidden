// src/pages/Skills/components/AfflictionEffectsEditor.js

import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import Select from '../../../shared/components/Select';
import TextInput from '../../../shared/components/TextInput';
import Button from '../../../shared/components/Button';
import api from '../../../config/api';
import styles from '../styles/AfflictionEffectsEditor.module.css';

const TARGET_OPTIONS = [
  { value: 'enemy', label: '🎯 Inimigo' },
  { value: 'self', label: '👤 Usuário' },
  { value: 'team', label: '👥 Equipe' }
];

export default function AfflictionEffectsEditor({ effects, onChange, disabled }) {
  const [afflictionsList, setAfflictionsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAfflictions();
  }, []);

  const loadAfflictions = async () => {
    try {
      const { data } = await api.get('/afflictions');
      setAfflictionsList(data.map(a => ({
        value: a._id,
        label: a.nome || a.name || 'Sem nome'
      })));
    } catch (error) {
      console.error('Erro ao carregar aflições:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    const newEffects = [
      ...(effects || []),
      {
        affliction: '',
        target: 'enemy',
        chance: 100
      }
    ];
    onChange(newEffects);
  };

  const handleRemove = (index) => {
    const newEffects = effects.filter((_, i) => i !== index);
    onChange(newEffects);
  };

  const handleChange = (index, field, value) => {
    const newEffects = [...effects];
    newEffects[index] = {
      ...newEffects[index],
      [field]: value
    };
    onChange(newEffects);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.title}>Efeitos de Aflições</span>
        <Button
          type="button"
          icon={<FaPlus />}
          onClick={handleAdd}
          backgroundColor="var(--maroon)"
          textColor="var(--light)"
          hoverColor="var(--gold)"
          disabled={disabled || loading}
          size="small"
        >
          Adicionar
        </Button>
      </div>

      {!effects || effects.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>💫</span>
          <p>Nenhum efeito de aflição configurado</p>
          <small>Skills podem causar aflições em inimigos, no usuário ou na equipe</small>
        </div>
      ) : (
        <div className={styles.list}>
          {effects.map((effect, index) => (
            <div key={index} className={styles.effectRow}>
              <div className={styles.effectAffliction}>
                <label>Aflição</label>
                <Select
                  value={effect.affliction}
                  onChange={(val) => handleChange(index, 'affliction', val)}
                  options={afflictionsList}
                  disabled={disabled || loading}
                  placeholder={loading ? 'Carregando...' : 'Selecione uma aflição'}
                />
              </div>

              <div className={styles.effectTarget}>
                <label>Alvo</label>
                <Select
                  value={effect.target || 'enemy'}
                  onChange={(val) => handleChange(index, 'target', val)}
                  options={TARGET_OPTIONS}
                  disabled={disabled}
                />
              </div>

              <div className={styles.effectChance}>
                <label>Chance (%)</label>
                <TextInput
                  type="number"
                  min={0}
                  max={100}
                  value={effect.chance || 100}
                  onChange={(e) => handleChange(index, 'chance', parseInt(e.target.value) || 0)}
                  placeholder="100"
                  disabled={disabled}
                />
              </div>

              <button
                type="button"
                className={styles.removeButton}
                onClick={() => handleRemove(index)}
                disabled={disabled}
                title="Remover efeito"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className={styles.info}>
        <strong>💡 Dica:</strong> Afflições em <strong>inimigos</strong> são debuffs, em <strong>si mesmo</strong> ou <strong>equipe</strong> podem ser buffs ou trade-offs.
      </div>
    </div>
  );
}
