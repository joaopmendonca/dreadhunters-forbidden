// src/pages/Skills/components/StatsModifiersEditor.js

import React from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import TextInput from '../../../shared/components/TextInput';
import Select from '../../../shared/components/Select';
import Button from '../../../shared/components/Button';
import styles from '../styles/StatsModifiersEditor.module.css';

// Lista de stats disponíveis
const STATS_OPTIONS = [
  // === ATRIBUTOS BASE ===
  { value: 'STR', label: '💪 STR (Força)' },
  { value: 'DEX', label: '🎯 DEX (Destreza)' },
  { value: 'INT', label: '🧠 INT (Inteligência)' },
  { value: 'WIS', label: '📚 WIS (Sabedoria)' },
  { value: 'CON', label: '❤️ CON (Constituição)' },
  { value: 'CHA', label: '✨ CHA (Carisma)' },
  
  // === STATS DERIVADOS ===
  { value: 'max_hp', label: '❤️ HP Máximo' },
  { value: 'max_sp', label: '🧠 SP Máximo' },
  { value: 'max_cp', label: '🛡️ CP Máximo' },
  { value: 'p_atk', label: '⚔️ P.ATK (Ataque Físico)' },
  { value: 'm_atk', label: '✨ M.ATK (Ataque Mágico)' },
  { value: 'p_def', label: '🛡️ P.DEF (Defesa Física)' },
  { value: 'm_def', label: '🌟 M.DEF (Defesa Mágica)' },
  { value: 'accuracy', label: '🎯 Precisão' },
  { value: 'evasion', label: '💨 Evasão' },
  { value: 'crit_rate', label: '💥 Taxa Crítico' },
  { value: 'crit_damage', label: '💢 Dano Crítico' },
  { value: 'atk_speed', label: '⚡ Velocidade Ataque' },
  { value: 'cast_speed', label: '🔮 Velocidade Conjuração' },
  { value: 'move_speed', label: '🏃 Velocidade Movimento' },
];

const MODIFIER_TYPE_OPTIONS = [
  { value: 'flat', label: 'Valor Fixo (+10, -5, etc)' },
  { value: 'percent', label: 'Percentual (+10%, -5%, etc)' }
];

export default function StatsModifiersEditor({ modifiers, onChange, disabled }) {
  // Converter Map ou Object para array de modificadores
  const modifiersList = React.useMemo(() => {
    const list = [];
    if (modifiers instanceof Map) {
      modifiers.forEach((value, key) => {
        list.push({ stat: key, value, type: key.endsWith('_percent') ? 'percent' : 'flat' });
      });
    } else if (modifiers && typeof modifiers === 'object') {
      Object.entries(modifiers).forEach(([key, value]) => {
        list.push({ stat: key, value, type: key.endsWith('_percent') ? 'percent' : 'flat' });
      });
    }
    return list;
  }, [modifiers]);

  const handleAdd = () => {
    const newList = [...modifiersList, { stat: 'STR', value: 0, type: 'flat' }];
    updateModifiers(newList);
  };

  const handleRemove = (index) => {
    const newList = modifiersList.filter((_, i) => i !== index);
    updateModifiers(newList);
  };

  const handleChange = (index, field, value) => {
    const newList = [...modifiersList];
    newList[index] = { ...newList[index], [field]: value };
    updateModifiers(newList);
  };

  const updateModifiers = (list) => {
    const newModifiers = {};
    list.forEach(({ stat, value, type }) => {
      const key = type === 'percent' ? `${stat}_percent` : stat;
      newModifiers[key] = parseFloat(value) || 0;
    });
    onChange(newModifiers);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.title}>Modificadores de Stats</span>
        <Button
          type="button"
          icon={<FaPlus />}
          onClick={handleAdd}
          backgroundColor="var(--maroon)"
          textColor="var(--light)"
          hoverColor="var(--gold)"
          disabled={disabled}
          size="small"
        >
          Adicionar
        </Button>
      </div>

      {modifiersList.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>📊</span>
          <p>Nenhum modificador configurado</p>
          <small>Clique em "Adicionar" para incluir modificadores de stats</small>
        </div>
      ) : (
        <div className={styles.list}>
          {modifiersList.map((mod, index) => (
            <div key={index} className={styles.modifierRow}>
              <div className={styles.modifierStat}>
                <label>Stat</label>
                <Select
                  value={mod.stat}
                  onChange={(val) => handleChange(index, 'stat', val)}
                  options={STATS_OPTIONS}
                  disabled={disabled}
                />
              </div>

              <div className={styles.modifierType}>
                <label>Tipo</label>
                <Select
                  value={mod.type}
                  onChange={(val) => handleChange(index, 'type', val)}
                  options={MODIFIER_TYPE_OPTIONS}
                  disabled={disabled}
                />
              </div>

              <div className={styles.modifierValue}>
                <label>Valor</label>
                <TextInput
                  type="number"
                  step="0.1"
                  value={mod.value}
                  onChange={(e) => handleChange(index, 'value', e.target.value)}
                  placeholder={mod.type === 'percent' ? '10 (%)' : '5'}
                  disabled={disabled}
                />
              </div>

              <button
                type="button"
                className={styles.removeButton}
                onClick={() => handleRemove(index)}
                disabled={disabled}
                title="Remover modificador"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className={styles.info}>
        <strong>💡 Dica:</strong> Use valores <strong>positivos</strong> para buffs (+10) e <strong>negativos</strong> para debuffs (-5).
        Percentuais são mais poderosos em níveis altos.
      </div>
    </div>
  );
}
