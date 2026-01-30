import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import Select from '../../../shared/components/Select';
import TextInput from '../../../shared/components/TextInput';
import Button from '../../../shared/components/Button';
import api from '../../../config/api';
import styles from '../styles/ConsumableAfflictionsEditor.module.css';

const DURATION_TYPE_OPTIONS = [
  { value: 'instant', label: 'Instantâneo' },
  { value: 'time', label: 'Tempo (segundos)' },
  { value: 'turns', label: 'Turnos' },
  { value: 'battle_end', label: 'Fim da Batalha' },
  { value: 'quest_active', label: 'Durante Missão' },
  { value: 'permanent', label: 'Permanente' }
];

export default function ConsumableAfflictionsEditor({ 
  afflictionEffects = [], 
  onChange, 
  disabled = false 
}) {
  const [effects, setEffects] = useState(afflictionEffects || []);
  const [afflictionsList, setAfflictionsList] = useState([]);

  useEffect(() => {
    api.get('/afflictions')
      .then(r => setAfflictionsList(r.data || []))
      .catch(() => setAfflictionsList([]));
  }, []);

  useEffect(() => {
    setEffects(afflictionEffects || []);
  }, [afflictionEffects]);

  const handleAddEffect = () => {
    const newEffects = [
      ...effects,
      {
        affliction: '',
        duration: { value: 0, type: 'time' }
      }
    ];
    setEffects(newEffects);
    onChange?.(newEffects);
  };

  const handleRemoveEffect = (index) => {
    const newEffects = effects.filter((_, i) => i !== index);
    setEffects(newEffects);
    onChange?.(newEffects);
  };

  const handleChangeEffect = (index, field, value) => {
    const newEffects = [...effects];
    if (field === 'affliction') {
      newEffects[index].affliction = value;
    } else if (field === 'duration.value' || field === 'duration.type') {
      const durationField = field.split('.')[1];
      newEffects[index].duration = {
        ...newEffects[index].duration,
        [durationField]: value
      };
    }
    setEffects(newEffects);
    onChange?.(newEffects);
  };

  const afflictionOptions = afflictionsList.map(a => ({
    value: a._id,
    label: a.nome || a.name
  }));

  return (
    <div className={styles.editor}>
      <div className={styles.header}>
        <span className={styles.title}>Efeitos de Afflictions</span>
        <Button
          type="button"
          backgroundColor="var(--maroon)"
          textColor="#fff"
          hoverColor="#a00030"
          onClick={handleAddEffect}
          disabled={disabled}
          className={styles.addButton}
          icon={<FaPlus />}
        >
          Adicionar
        </Button>
      </div>

      {effects.length === 0 && (
        <div className={styles.empty}>Nenhum efeito configurado</div>
      )}

      {effects.map((effect, index) => (
        <div key={index} className={styles.effectRow}>
          <div className={styles.effectField}>
            <label>Affliction</label>
            <Select
              options={afflictionOptions}
              value={effect.affliction}
              onChange={val => handleChangeEffect(index, 'affliction', val)}
              disabled={disabled}
              placeholder="Selecione..."
            />
          </div>

          <div className={styles.effectField}>
            <label>Duração</label>
            <TextInput
              type="number"
              value={effect.duration?.value || 0}
              onChange={e => handleChangeEffect(index, 'duration.value', Number(e.target.value))}
              disabled={disabled || effect.duration?.type === 'instant' || effect.duration?.type === 'battle_end' || effect.duration?.type === 'quest_active' || effect.duration?.type === 'permanent'}
              min={0}
            />
          </div>

          <div className={styles.effectField}>
            <label>Tipo</label>
            <Select
              options={DURATION_TYPE_OPTIONS}
              value={effect.duration?.type || 'time'}
              onChange={val => handleChangeEffect(index, 'duration.type', val)}
              disabled={disabled}
            />
          </div>

          <Button
            type="button"
            backgroundColor="var(--dark-3)"
            textColor="#d92828"
            hoverColor="var(--dark-4)"
            onClick={() => handleRemoveEffect(index)}
            disabled={disabled}
            className={styles.removeButton}
          >
            <FaTrash />
          </Button>
        </div>
      ))}

      {effects.length > 0 && (
        <div className={styles.hint}>
          💡 Efeitos são aplicados ao consumir o item. Podem curar ou aplicar debuffs.
        </div>
      )}
    </div>
  );
}
