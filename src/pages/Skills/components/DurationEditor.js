// src/pages/Skills/components/DurationEditor.js

import React from 'react';
import Select from '../../../shared/components/Select';
import TextInput from '../../../shared/components/TextInput';
import styles from '../styles/DurationEditor.module.css';

const DURATION_TYPE_OPTIONS = [
  { value: 'instant', label: '⚡ Instantâneo' },
  { value: 'permanent', label: '⏳ Permanente' },
  { value: 'time', label: '⏱️ Por Tempo (minutos)' },
  { value: 'turns', label: '🎲 Por Turnos (batalha)' },
  { value: 'battle_end', label: '⚔️ Até o Fim da Batalha' },
  { value: 'quest_active', label: '📜 Durante Missão Ativa' }
];

export default function DurationEditor({ duration, onChange, disabled }) {
  const handleTypeChange = (type) => {
    onChange({
      type,
      value: type === 'battle_end' || type === 'permanent' || type === 'instant' || type === 'quest_active' ? 0 : (duration?.value || 1)
    });
  };

  const handleValueChange = (value) => {
    onChange({
      ...duration,
      value: parseInt(value) || 0
    });
  };

  const needsValue = duration?.type === 'time' || duration?.type === 'turns';

  return (
    <div className={styles.container}>
      <div className={styles.field}>
        <label>Tipo de Duração</label>
        <Select
          value={duration?.type || 'permanent'}
          onChange={handleTypeChange}
          options={DURATION_TYPE_OPTIONS}
          disabled={disabled}
        />
      </div>

      {needsValue && (
        <div className={styles.field}>
          <label>
            {duration.type === 'time' ? 'Minutos' : 'Turnos'}
          </label>
          <TextInput
            type="number"
            min={1}
            value={duration?.value || 1}
            onChange={(e) => handleValueChange(e.target.value)}
            placeholder={duration.type === 'time' ? '5' : '3'}
            disabled={disabled}
          />
        </div>
      )}

      <div className={styles.info}>
        {duration?.type === 'instant' && '💡 Efeito ocorre apenas no momento de uso'}
        {duration?.type === 'permanent' && '💡 Efeito permanente (skills passivas)'}
        {duration?.type === 'time' && '💡 Duração baseada em tempo real'}
        {duration?.type === 'turns' && '💡 Duração baseada em turnos de batalha'}
        {duration?.type === 'battle_end' && '💡 Efeito dura até o fim do combate'}
        {duration?.type === 'quest_active' && '💡 Efeito ativo enquanto a missão estiver em andamento'}
      </div>
    </div>
  );
}
