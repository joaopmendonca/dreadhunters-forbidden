import React, { useState } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import Select from '../../../shared/components/Select';
import TextInput from '../../../shared/components/TextInput';
import Button from '../../../shared/components/Button';
import styles from '../styles/ConsumableStatsEditor.module.css';

const TYPE_OPTIONS = [
  { value: 'flat', label: 'Valor Fixo' },
  { value: 'percent', label: 'Porcentagem' }
];

export default function ConsumableStatsEditor({ 
  statsModifiers = new Map(), 
  onChange, 
  disabled = false,
  statusList = []
}) {
  // Converte Map/Object para Array
  const toArray = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (data instanceof Map) {
      return Array.from(data.entries()).map(([resource, config]) => ({
        resource,
        value: config.value || 0,
        type: config.type || 'flat'
      }));
    }
    if (typeof data === 'object') {
      return Object.entries(data).map(([resource, config]) => ({
        resource,
        value: config.value || 0,
        type: config.type || 'flat'
      }));
    }
    return [];
  };

  const [stats, setStats] = useState(toArray(statsModifiers));

  const handleAddStat = () => {
    const newStats = [...stats, { resource: '', value: 0, type: 'flat' }];
    setStats(newStats);
    emitChange(newStats);
  };

  const handleRemoveStat = (index) => {
    const newStats = stats.filter((_, i) => i !== index);
    setStats(newStats);
    emitChange(newStats);
  };

  const handleChangeStat = (index, field, value) => {
    const newStats = [...stats];
    newStats[index] = { ...newStats[index], [field]: value };
    setStats(newStats);
    emitChange(newStats);
  };

  const emitChange = (newStats) => {
    // Converte de volta para Map
    const map = new Map();
    newStats.forEach(stat => {
      if (stat.resource) {
        map.set(stat.resource, {
          value: Number(stat.value) || 0,
          type: stat.type || 'flat'
        });
      }
    });
    onChange?.(map);
  };

  // Filtra apenas stats de recursos derivados (HP, SP, CP, etc)
  const resourceOptions = statusList
    .filter(s => s.tipo === 'derivado')
    .map(s => ({ value: s.nome, label: s.nome }));

  return (
    <div className={styles.editor}>
      <div className={styles.header}>
        <span className={styles.title}>Stats Restaurados</span>
        <Button
          type="button"
          backgroundColor="var(--maroon)"
          textColor="#fff"
          hoverColor="#a00030"
          onClick={handleAddStat}
          disabled={disabled}
          className={styles.addButton}
          icon={<FaPlus />}
        >
          Adicionar
        </Button>
      </div>

      {stats.length === 0 && (
        <div className={styles.empty}>Nenhum stat configurado</div>
      )}

      {stats.map((stat, index) => (
        <div key={index} className={styles.statRow}>
          <div className={styles.statField}>
            <label>Recurso</label>
            <Select
              options={resourceOptions}
              value={stat.resource}
              onChange={val => handleChangeStat(index, 'resource', val)}
              disabled={disabled}
              placeholder="Selecione..."
            />
          </div>

          <div className={styles.statField}>
            <label>Valor</label>
            <TextInput
              type="number"
              value={stat.value}
              onChange={e => handleChangeStat(index, 'value', Number(e.target.value))}
              disabled={disabled}
              min={0}
            />
          </div>

          <div className={styles.statField}>
            <label>Tipo</label>
            <Select
              options={TYPE_OPTIONS}
              value={stat.type}
              onChange={val => handleChangeStat(index, 'type', val)}
              disabled={disabled}
            />
          </div>

          <Button
            type="button"
            backgroundColor="var(--dark-3)"
            textColor="#d92828"
            hoverColor="var(--dark-4)"
            onClick={() => handleRemoveStat(index)}
            disabled={disabled}
            className={styles.removeButton}
          >
            <FaTrash />
          </Button>
        </div>
      ))}

      {stats.length > 0 && (
        <div className={styles.hint}>
          💡 Valor fixo restaura quantidade exata. Porcentagem restaura % do máximo.
        </div>
      )}
    </div>
  );
}
