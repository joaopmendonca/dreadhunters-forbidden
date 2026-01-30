// RecurringEffectsEditor.js
import React from 'react';
import { FaPlus, FaTrash, FaRedoAlt } from 'react-icons/fa';
import Select from '../../../shared/components/Select';
import TextInput from '../../../shared/components/TextInput';
import Button from '../../../shared/components/Button';
import styles from '../styles/RecurringEffectsEditor.module.css';

const FREQUENCY_TYPE_OPTIONS = [
  { value: 'turn', label: 'A cada turno' },
  { value: 'time', label: 'A cada intervalo de tempo' }
];

const MODIFIER_TYPE_OPTIONS = [
  { value: 'flat', label: 'Valor fixo' },
  { value: 'percent', label: 'Porcentagem (%)' }
];

const STAT_OPTIONS = [
  // Stats base
  { value: 'STR', label: 'STR (Força)' },
  { value: 'DEX', label: 'DEX (Destreza)' },
  { value: 'INT', label: 'INT (Inteligência)' },
  { value: 'WIT', label: 'WIT (Sagacidade)' },
  { value: 'MEN', label: 'MEN (Mente)' },
  { value: 'CON', label: 'CON (Constituição)' },
  
  // Stats dinâmicos/derivados
  { value: 'max_hp', label: 'HP Máximo' },
  { value: 'max_mp', label: 'MP Máximo' },
  { value: 'hp', label: 'HP Atual' },
  { value: 'mp', label: 'MP Atual' },
  { value: 'p_atk', label: 'Ataque Físico' },
  { value: 'p_def', label: 'Defesa Física' },
  { value: 'm_atk', label: 'Ataque Mágico' },
  { value: 'm_def', label: 'Defesa Mágica' },
  { value: 'atk_spd', label: 'Velocidade de Ataque' },
  { value: 'cast_spd', label: 'Velocidade de Conjuração' },
  { value: 'move_spd', label: 'Velocidade de Movimento' },
  { value: 'accuracy', label: 'Precisão' },
  { value: 'evasion', label: 'Evasão' },
  { value: 'crit_rate', label: 'Taxa Crítica' },
  { value: 'crit_damage', label: 'Dano Crítico' },
  { value: 'hp_regen', label: 'Regeneração HP' },
  { value: 'mp_regen', label: 'Regeneração MP' }
];

export default function RecurringEffectsEditor({ effects = [], onChange, disabled = false }) {
  const handleAdd = () => {
    onChange([
      ...effects,
      {
        frequency: { type: 'turn', value: 1 },
        stat: 'hp',
        modifierType: 'flat',
        value: -10
      }
    ]);
  };

  const handleRemove = index => {
    onChange(effects.filter((_, i) => i !== index));
  };

  const handleChangeEffect = (index, field, value) => {
    const updated = [...effects];
    if (field === 'frequency.type' || field === 'frequency.value') {
      const [parent, child] = field.split('.');
      updated[index] = {
        ...updated[index],
        [parent]: {
          ...updated[index][parent],
          [child]: value
        }
      };
    } else {
      updated[index] = {
        ...updated[index],
        [field]: value
      };
    }
    onChange(updated);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.title}>
          <FaRedoAlt /> Efeitos Recorrentes
        </span>
        <Button
          backgroundColor="var(--maroon)"
          textColor="#fff"
          hoverColor="#a00030"
          onClick={handleAdd}
          disabled={disabled}
          type="button"
        >
          <FaPlus /> Adicionar
        </Button>
      </div>

      {effects.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>🔄</span>
          <p>Nenhum efeito recorrente configurado</p>
          <small>Efeitos recorrentes acontecem repetidamente durante a duração da skill</small>
        </div>
      ) : (
        <div className={styles.list}>
          {effects.map((effect, idx) => (
            <div key={idx} className={styles.effectRow}>
              <div className={styles.effectFrequency}>
                <label>Frequência</label>
                <Select
                  value={effect.frequency.type}
                  onChange={val => handleChangeEffect(idx, 'frequency.type', val)}
                  options={FREQUENCY_TYPE_OPTIONS}
                  disabled={disabled}
                />
              </div>

              <div className={styles.effectFrequencyValue}>
                <label>
                  {effect.frequency.type === 'turn' ? 'A cada X turnos' : 'A cada X minutos'}
                </label>
                <TextInput
                  type="number"
                  min={1}
                  value={effect.frequency.value}
                  onChange={e => handleChangeEffect(idx, 'frequency.value', parseInt(e.target.value) || 1)}
                  disabled={disabled}
                />
              </div>

              <div className={styles.effectStat}>
                <label>Stat Afetado</label>
                <Select
                  value={effect.stat}
                  onChange={val => handleChangeEffect(idx, 'stat', val)}
                  options={STAT_OPTIONS}
                  disabled={disabled}
                />
              </div>

              <div className={styles.effectModifierType}>
                <label>Tipo</label>
                <Select
                  value={effect.modifierType}
                  onChange={val => handleChangeEffect(idx, 'modifierType', val)}
                  options={MODIFIER_TYPE_OPTIONS}
                  disabled={disabled}
                />
              </div>

              <div className={styles.effectValue}>
                <label>Valor</label>
                <TextInput
                  type="number"
                  value={effect.value}
                  onChange={e => handleChangeEffect(idx, 'value', parseFloat(e.target.value) || 0)}
                  placeholder="Use negativo para dano"
                  disabled={disabled}
                />
              </div>

              <button
                type="button"
                className={styles.removeButton}
                onClick={() => handleRemove(idx)}
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
        <strong>Exemplo:</strong> Configurar "A cada 1 turno" → "HP Atual" → "Valor fixo" → "-10" 
        fará o alvo perder 10 de HP a cada turno enquanto a skill estiver ativa.
      </div>
    </div>
  );
}
