import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import Select from '../../../shared/components/Select';
import Button from '../../../shared/components/Button';
import api from '../../../config/api';
import styles from '../styles/ConsumableRemovesAfflictionsEditor.module.css';

export default function ConsumableRemovesAfflictionsEditor({ 
  removesAfflictions = [], 
  onChange, 
  disabled = false 
}) {
  const [removes, setRemoves] = useState(removesAfflictions || []);
  const [afflictionsList, setAfflictionsList] = useState([]);

  useEffect(() => {
    api.get('/afflictions')
      .then(r => setAfflictionsList(r.data || []))
      .catch(() => setAfflictionsList([]));
  }, []);

  useEffect(() => {
    setRemoves(removesAfflictions || []);
  }, [removesAfflictions]);

  const handleAdd = () => {
    const newRemoves = [...removes, ''];
    setRemoves(newRemoves);
    onChange?.(newRemoves);
  };

  const handleRemove = (index) => {
    const newRemoves = removes.filter((_, i) => i !== index);
    setRemoves(newRemoves);
    onChange?.(newRemoves);
  };

  const handleChange = (index, value) => {
    const newRemoves = [...removes];
    newRemoves[index] = value;
    setRemoves(newRemoves);
    onChange?.(newRemoves);
  };

  const afflictionOptions = afflictionsList.map(a => ({
    value: a._id,
    label: a.nome || a.name
  }));

  return (
    <div className={styles.editor}>
      <div className={styles.header}>
        <span className={styles.title}>REMOVE AFFLICTIONS</span>
        <Button
          type="button"
          backgroundColor="var(--maroon)"
          textColor="#fff"
          hoverColor="var(--gold)"
          onClick={handleAdd}
          disabled={disabled}
          className={styles.addButton}
          icon={<FaPlus />}
        >
          Adicionar
        </Button>
      </div>

      {removes.length === 0 && (
        <div className={styles.empty}>Nenhuma affliction será removida</div>
      )}

      {removes.map((afflictionId, index) => (
        <div key={index} className={styles.row}>
          <div className={styles.selectField}>
            <Select
              options={afflictionOptions}
              value={afflictionId}
              onChange={val => handleChange(index, val)}
              disabled={disabled}
              placeholder="Selecione affliction..."
            />
          </div>

          <Button
            type="button"
            backgroundColor="var(--dark-3)"
            textColor="#d92828"
            hoverColor="var(--dark-4)"
            onClick={() => handleRemove(index)}
            disabled={disabled}
            className={styles.removeButton}
          >
            <FaTrash />
          </Button>
        </div>
      ))}

      {removes.length > 0 && (
        <div className={styles.hint}>
          ✅ Ao consumir este item, as afflictions selecionadas serão removidas do personagem.
        </div>
      )}
    </div>
  );
}
