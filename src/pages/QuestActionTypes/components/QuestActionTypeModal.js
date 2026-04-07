import React, { useEffect, useState } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import Modal, { COLUMN_LAYOUTS } from '../../../shared/components/Modal';
import TextInput from '../../../shared/components/TextInput';
import TextArea from '../../../shared/components/TextArea';
import Button from '../../../shared/components/Button';
import { EMPTY_FORM, EMPTY_STAT_MODIFIER, EMPTY_ITEM_MODIFIER, EMPTY_EFFECT_MODIFIER } from '../constants';

export function QuestActionTypeModal({ isOpen, onClose, onSave, initialData }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        description: initialData.description || '',
        baseDurationMinutes: initialData.baseDurationMinutes ?? 30,
        statModifiers: initialData.statModifiers || [],
        itemModifiers: initialData.itemModifiers || [],
        activeEffectModifiers: initialData.activeEffectModifiers || []
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [initialData, isOpen]);

  const handleField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleStatModifierChange = (index, field, value) => {
    const updated = form.statModifiers.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    handleField('statModifiers', updated);
  };

  const handleItemModifierChange = (index, field, value) => {
    const updated = form.itemModifiers.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    handleField('itemModifiers', updated);
  };

  const handleEffectModifierChange = (index, field, value) => {
    const updated = form.activeEffectModifiers.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    handleField('activeEffectModifiers', updated);
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await onSave(form, initialData?._id);
    } finally {
      setSaving(false);
    }
  };

  const title = initialData ? 'Editar Tipo de Ação' : 'Novo Tipo de Ação';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      columnLayout={COLUMN_LAYOUTS.ONE_COLUMN}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>Cancelar</Button>
          <Button onClick={handleSubmit} loading={saving}>Salvar</Button>
        </>
      }
    >
      <Modal.Section title="Informações Gerais">
        <TextInput
          label="Nome *"
          value={form.name}
          onChange={e => handleField('name', e.target.value)}
          placeholder="Ex: Investigar, Caçar, Conversar"
        />
        <TextArea
          label="Descrição"
          value={form.description}
          onChange={e => handleField('description', e.target.value)}
          rows={2}
        />
        <TextInput
          label="Duração Base (minutos) *"
          type="number"
          min={1}
          value={form.baseDurationMinutes}
          onChange={e => handleField('baseDurationMinutes', Number(e.target.value))}
        />
      </Modal.Section>

      <Modal.Section
        title="Modificadores de Stat"
        action={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleField('statModifiers', [...form.statModifiers, { ...EMPTY_STAT_MODIFIER }])}
          >
            <FaPlus /> Adicionar
          </Button>
        }
      >
        {form.statModifiers.length === 0 && (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Nenhum modificador de stat.</p>
        )}
        {form.statModifiers.map((mod, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-end', marginBottom: 8 }}>
            <TextInput
              label="Stat Key"
              value={mod.statKey}
              onChange={e => handleStatModifierChange(i, 'statKey', e.target.value)}
              placeholder="dex"
            />
            <TextInput
              label="Redução/Ponto"
              type="number"
              min={0}
              value={mod.reductionPerPoint}
              onChange={e => handleStatModifierChange(i, 'reductionPerPoint', Number(e.target.value))}
            />
            <TextInput
              label="Redução Máx."
              type="number"
              min={0}
              value={mod.maxReduction}
              onChange={e => handleStatModifierChange(i, 'maxReduction', Number(e.target.value))}
            />
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleField('statModifiers', form.statModifiers.filter((_, idx) => idx !== i))}
            >
              <FaTrash />
            </Button>
          </div>
        ))}
      </Modal.Section>

      <Modal.Section
        title="Modificadores de Item"
        action={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleField('itemModifiers', [...form.itemModifiers, { ...EMPTY_ITEM_MODIFIER }])}
          >
            <FaPlus /> Adicionar
          </Button>
        }
      >
        {form.itemModifiers.length === 0 && (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Nenhum modificador de item.</p>
        )}
        {form.itemModifiers.map((mod, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-end', marginBottom: 8 }}>
            <TextInput
              label="Item ID"
              value={mod.itemId}
              onChange={e => handleItemModifierChange(i, 'itemId', e.target.value)}
              placeholder="ObjectId do item"
            />
            <TextInput
              label="Redução (%)"
              type="number"
              min={0}
              max={100}
              value={mod.reductionPercent}
              onChange={e => handleItemModifierChange(i, 'reductionPercent', Number(e.target.value))}
            />
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleField('itemModifiers', form.itemModifiers.filter((_, idx) => idx !== i))}
            >
              <FaTrash />
            </Button>
          </div>
        ))}
      </Modal.Section>

      <Modal.Section
        title="Modificadores de Efeito Ativo"
        action={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleField('activeEffectModifiers', [...form.activeEffectModifiers, { ...EMPTY_EFFECT_MODIFIER }])}
          >
            <FaPlus /> Adicionar
          </Button>
        }
      >
        {form.activeEffectModifiers.length === 0 && (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Nenhum modificador de efeito ativo.</p>
        )}
        {form.activeEffectModifiers.map((mod, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-end', marginBottom: 8 }}>
            <TextInput
              label="Nome do Efeito"
              value={mod.effectName}
              onChange={e => handleEffectModifierChange(i, 'effectName', e.target.value)}
              placeholder="Ex: Bênção da Velocidade"
            />
            <TextInput
              label="Fator de Tempo"
              type="number"
              min={0}
              step={0.05}
              value={mod.timeFactor}
              onChange={e => handleEffectModifierChange(i, 'timeFactor', Number(e.target.value))}
            />
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleField('activeEffectModifiers', form.activeEffectModifiers.filter((_, idx) => idx !== i))}
            >
              <FaTrash />
            </Button>
          </div>
        ))}
      </Modal.Section>
    </Modal>
  );
}
