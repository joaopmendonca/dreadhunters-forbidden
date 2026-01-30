import React from 'react';
import styles from './TargetSelector.module.css';

const TargetSelector = ({ value = [], onChange }) => {
  const targetOptions = [
    { id: 'self', label: 'Si Mesmo' },
    { id: 'ally', label: 'Aliado' },
    { id: 'all_allies', label: 'Todos Aliados (Área)' },
    { id: 'enemy', label: 'Inimigo' },
    { id: 'all_enemies', label: 'Todos Inimigos (Área)' }
  ];

  const handleToggle = (targetId) => {
    const newTargets = value.includes(targetId)
      ? value.filter(t => t !== targetId)
      : [...value, targetId];
    
    onChange(newTargets);
  };

  return (
    <div className={styles.container}>
      <label className={styles.sectionLabel}>Alvos Possíveis</label>
      <div className={styles.checkboxGroup}>
        {targetOptions.map(option => (
          <label key={option.id} className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={value.includes(option.id)}
              onChange={() => handleToggle(option.id)}
              className={styles.checkbox}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default TargetSelector;
