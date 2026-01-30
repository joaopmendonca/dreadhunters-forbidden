import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import Button from '../../../shared/components/Button';
import TextInput from '../../../shared/components/TextInput';
import Select from '../../../shared/components/Select';
import styles from '../styles/CostEditor.module.css';

export function CostEditor({ cost = {}, onChange, disabled, statusList = [], itemsList = [] }) {
  const [resources, setResources] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Inicializar recursos como array
    let resourcesArray = [];
    if (cost.resources) {
      if (Array.isArray(cost.resources)) {
        resourcesArray = cost.resources;
      } else if (cost.resources instanceof Map) {
        // Converter Map para array
        cost.resources.forEach((value, key) => {
          resourcesArray.push({ resource: key, value, type: 'flat' });
        });
      } else if (typeof cost.resources === 'object') {
        // Converter objeto para array
        resourcesArray = Object.entries(cost.resources).map(([key, value]) => ({
          resource: key,
          value,
          type: 'flat'
        }));
      }
    }
    setResources(resourcesArray);

    // Inicializar itens
    setItems(Array.isArray(cost.items) ? cost.items : []);
  }, [cost]);

  const notifyChange = (newResources, newItems) => {
    onChange({
      resources: newResources,
      items: newItems
    });
  };

  const handleAddResource = () => {
    const updated = [...resources, { resource: '', value: 0, type: 'flat' }];
    setResources(updated);
    notifyChange(updated, items);
  };

  const handleResourceChange = (index, field, value) => {
    const updated = [...resources];
    updated[index] = { ...updated[index], [field]: value };
    setResources(updated);
    notifyChange(updated, items);
  };

  const handleRemoveResource = index => {
    const updated = resources.filter((_, i) => i !== index);
    setResources(updated);
    notifyChange(updated, items);
  };

  const handleAddItem = () => {
    const updated = [...items, { item: '', quantity: 1, type: 'flat' }];
    setItems(updated);
    notifyChange(resources, updated);
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
    notifyChange(resources, updated);
  };

  const handleRemoveItem = index => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
    notifyChange(resources, updated);
  };

  // Opções de recursos (apenas derivados)
  const resourceOptions = statusList
    .filter(s => s.tipo === 'derivado')
    .map(s => ({ value: s.nome, label: s.label || s.nome }));

  // Opções de itens
  const itemOptions = itemsList.map(item => ({ 
    value: item._id, 
    label: item.name 
  }));

  // Opções de tipo
  const typeOptions = [
    { value: 'flat', label: 'Valor Fixo' },
    { value: 'percent', label: 'Porcentagem (%)' }
  ];

  return (
    <div className={styles.costEditor}>
      <span className={styles.sectionTitle}>Custo da Skill</span>

      {/* Recursos */}
      <div className={styles.subsection}>
        <div className={styles.subsectionHeader}>
          <label>Recursos</label>
          <Button
            type="button"
            backgroundColor="var(--maroon)"
            textColor="#fff"
            hoverColor="#a00030"
            onClick={handleAddResource}
            disabled={disabled}
            className={styles.addButton}
            icon={<FaPlus />}
          >
            Adicionar
          </Button>
        </div>

        {resources.map((res, index) => (
          <div key={index} className={styles.resourceRow}>
            <Select
              value={res.resource}
              onChange={val => handleResourceChange(index, 'resource', val)}
              options={resourceOptions}
              placeholder="Selecione recurso"
              disabled={disabled}
              className={styles.resourceSelect}
            />
            <TextInput
              type="number"
              min={0}
              value={res.value}
              onChange={e => handleResourceChange(index, 'value', +e.target.value)}
              placeholder="Quantidade"
              disabled={disabled}
              className={styles.resourceInput}
            />
            <Select
              value={res.type}
              onChange={val => handleResourceChange(index, 'type', val)}
              options={typeOptions}
              disabled={disabled}
              className={styles.typeSelect}
            />
            <Button
              type="button"
              backgroundColor="var(--dark-3)"
              textColor="#d92828"
              hoverColor="var(--dark-4)"
              onClick={() => handleRemoveResource(index)}
              disabled={disabled}
              className={styles.removeButton}
              icon={<FaTrash />}
            >
            </Button>
          </div>
        ))}

        {resources.length === 0 && (
          <p className={styles.emptyMessage}>Nenhum custo de recurso definido</p>
        )}
      </div>

      {/* Itens */}
      <div className={styles.subsection}>
        <div className={styles.subsectionHeader}>
          <label>Itens Consumidos</label>
          <Button
            type="button"
            backgroundColor="var(--maroon)"
            textColor="#fff"
            hoverColor="#a00030"
            onClick={handleAddItem}
            disabled={disabled}
            className={styles.addButton}
            icon={<FaPlus />}
          >
            Adicionar
          </Button>
        </div>

        {items.map((itemCost, index) => (
          <div key={index} className={styles.itemRow}>
            <Select
              value={itemCost.item}
              onChange={val => handleItemChange(index, 'item', val)}
              options={itemOptions}
              placeholder="Selecione item"
              disabled={disabled}
              className={styles.itemSelect}
            />
            <TextInput
              type="number"
              min={1}
              value={itemCost.quantity}
              onChange={e => handleItemChange(index, 'quantity', +e.target.value)}
              placeholder="Qtd"
              disabled={disabled}
              className={styles.itemInput}
            />
            <Select
              value={itemCost.type}
              onChange={val => handleItemChange(index, 'type', val)}
              options={typeOptions}
              disabled={disabled}
              className={styles.typeSelect}
            />
            <Button
              type="button"
              backgroundColor="var(--dark-3)"
              textColor="#d92828"
              hoverColor="var(--dark-4)"
              onClick={() => handleRemoveItem(index)}
              disabled={disabled}
              className={styles.removeButton}
              icon={<FaTrash />}
            >
            </Button>
          </div>
        ))}

        {items.length === 0 && (
          <p className={styles.emptyMessage}>Nenhum item consumível definido</p>
        )}
      </div>
    </div>
  );
}

export default CostEditor;
