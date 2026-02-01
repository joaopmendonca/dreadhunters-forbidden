import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import Select from '../../../shared/components/Select';
import TextInput from '../../../shared/components/TextInput';
import Button from '../../../shared/components/Button';
import api from '../../../config/api';
import styles from '../styles/DamageEditor.module.css';

export default function DamageEditor({ 
  damage = { formula: '', type: 'none' }, 
  onChange, 
  disabled = false,
  statusList = []
}) {
  const [baseDamage, setBaseDamage] = useState(0);
  const [scalings, setScalings] = useState([]);
  const [damageType, setDamageType] = useState('none');
  const [initialized, setInitialized] = useState(false);
  const [damageTypes, setDamageTypes] = useState([]);

  // Buscar tipos de dano da API
  useEffect(() => {
    const fetchDamageTypes = async () => {
      try {
        const response = await api.get('/damage-types');
        setDamageTypes(response.data);
      } catch (err) {
        console.error('Erro ao carregar tipos de dano:', err);
      }
    };
    fetchDamageTypes();
  }, []);

  // Parse da fórmula para os campos visuais (apenas na primeira vez)
  useEffect(() => {
    if (!initialized && damage) {
      if (damage.formula) {
        parseFormula(damage.formula);
      } else {
        setBaseDamage(0);
        setScalings([]);
      }
      setDamageType(damage.type || 'none');
      setInitialized(true);
    }
  }, [damage, initialized]);

  const parseFormula = (formula) => {
    if (!formula) return;
    
    // Extrai dano base (primeiro número)
    const baseMatch = formula.match(/^(\d+)/);
    if (baseMatch) {
      setBaseDamage(Number(baseMatch[1]));
    }

    // Extrai escalamentos: (STAT * ratio)
    const scalingPattern = /\(([A-Z_]+)\s*\*\s*([\d.]+)\)/g;
    const matches = [...formula.matchAll(scalingPattern)];
    const parsedScalings = matches.map(match => ({
      stat: match[1],
      ratio: Number(match[2])
    }));
    setScalings(parsedScalings);
  };

  const buildFormula = (base, scalingList) => {
    if (!base && scalingList.length === 0) return '';
    
    let formula = base.toString();
    scalingList.forEach(scaling => {
      if (scaling.stat && scaling.ratio > 0) {
        formula += ` + (${scaling.stat} * ${scaling.ratio})`;
      }
    });
    return formula;
  };

  const emitChange = (newBase, newScalings, newType) => {
    const formula = buildFormula(newBase, newScalings);
    onChange?.({
      formula,
      type: newType
    });
  };

  const handleBaseDamageChange = (value) => {
    const newBase = Number(value) || 0;
    setBaseDamage(newBase);
    emitChange(newBase, scalings, damageType);
  };

  const handleTypeChange = (type) => {
    setDamageType(type);
    emitChange(baseDamage, scalings, type);
  };

  const handleAddScaling = () => {
    const newScalings = [...scalings, { stat: '', ratio: 1.0 }];
    setScalings(newScalings);
    emitChange(baseDamage, newScalings, damageType);
  };

  const handleRemoveScaling = (index) => {
    const newScalings = scalings.filter((_, i) => i !== index);
    setScalings(newScalings);
    emitChange(baseDamage, newScalings, damageType);
  };

  const handleScalingChange = (index, field, value) => {
    const newScalings = [...scalings];
    newScalings[index] = { ...newScalings[index], [field]: value };
    setScalings(newScalings);
    emitChange(baseDamage, newScalings, damageType);
  };

  // Opções de stats base para escalamento
  const statOptions = statusList
    .filter(s => s.tipo === 'base')
    .map(s => ({ value: s.nome, label: s.nome }));

  // Opções de tipos de dano (dinâmicas)
  const damageTypeOptions = damageTypes.map(dt => ({
    value: dt.nome,
    label: dt.label
  }));

  // Preview da fórmula
  const getFormulaPreview = () => {
    if (damageType === 'none') return 'Skill sem dano';
    if (!baseDamage && scalings.length === 0) return 'Configure o dano';
    
    let preview = `${baseDamage}`;
    scalings.forEach(scaling => {
      if (scaling.stat && scaling.ratio > 0) {
        preview += ` + ${scaling.stat}×${scaling.ratio}`;
      }
    });
    return `Dano = ${preview}`;
  };

  return (
    <div className={styles.editor}>
      <div className={styles.header}>
        <span className={styles.title}>Sistema de Dano</span>
      </div>

      <div className={styles.field}>
        <label>Tipo de Dano</label>
        <Select
          options={damageTypeOptions}
          value={damageType}
          onChange={handleTypeChange}
          disabled={disabled}
          placeholder="Selecione o tipo de dano..."
        />
      </div>

      {damageType !== 'none' && (
        <>
          <div className={styles.field}>
            <label>Dano Base</label>
            <TextInput
              type="number"
              min={0}
              value={baseDamage}
              onChange={e => handleBaseDamageChange(e.target.value)}
              disabled={disabled}
              placeholder="0"
            />
          </div>

          <div className={styles.scalingSection}>
            <div className={styles.scalingHeader}>
              <label>Escalamento com Stats</label>
              <Button
                type="button"
                backgroundColor="var(--maroon)"
                textColor="#fff"
                hoverColor="#a00030"
                onClick={handleAddScaling}
                disabled={disabled}
                className={styles.addButton}
                icon={<FaPlus />}
              >
                Adicionar
              </Button>
            </div>

            {scalings.length === 0 && (
              <div className={styles.empty}>Nenhum escalamento configurado</div>
            )}

            {scalings.map((scaling, index) => (
              <div key={index} className={styles.scalingRow}>
                <div className={styles.scalingField}>
                  <label>Stat</label>
                  <Select
                    options={statOptions}
                    value={scaling.stat}
                    onChange={val => handleScalingChange(index, 'stat', val)}
                    disabled={disabled}
                    placeholder="Selecione..."
                  />
                </div>

                <div className={styles.scalingField}>
                  <label>Multiplicador</label>
                  <TextInput
                    type="number"
                    min={0}
                    step={0.1}
                    value={scaling.ratio}
                    onChange={e => handleScalingChange(index, 'ratio', Number(e.target.value))}
                    disabled={disabled}
                  />
                </div>

                <Button
                  type="button"
                  backgroundColor="var(--dark-3)"
                  textColor="#d92828"
                  hoverColor="var(--dark-4)"
                  onClick={() => handleRemoveScaling(index)}
                  disabled={disabled}
                  className={styles.removeButton}
                  icon={<FaTrash />}
                >
                </Button>
              </div>
            ))}
          </div>

          <div className={styles.preview}>
            <strong>Preview:</strong> {getFormulaPreview()}
          </div>
        </>
      )}
    </div>
  );
}
