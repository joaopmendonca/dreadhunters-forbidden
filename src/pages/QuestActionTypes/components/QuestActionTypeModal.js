import { useEffect, useState } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import Modal, { MODAL_SIZES, COLUMN_LAYOUTS } from '../../../shared/components/Modal';
import TextInput from '../../../shared/components/TextInput';
import TextArea from '../../../shared/components/TextArea';
import Button from '../../../shared/components/Button';
import { EMPTY_FORM, EMPTY_STAT_MODIFIER, EMPTY_ITEM_MODIFIER, EMPTY_EFFECT_MODIFIER } from '../constants';
import styles from '../styles/QuestActionTypeModal.module.css';

export function QuestActionTypeModal({ isOpen, onClose, onSave, initialData }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
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

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(form, initialData?._id);
    } finally {
      setSaving(false);
    }
  };

  const modalTitle = initialData ? 'Editar Tipo de Ação' : 'Novo Tipo de Ação';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={modalTitle}
      size={MODAL_SIZES.LARGE}
      closeOnOverlayClick
    >
      <form onSubmit={handleSubmit}>
        <Modal.Body columns={COLUMN_LAYOUTS.SINGLE}>

            {/* Informações Gerais */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Informações Gerais</h3>
              <div className={styles.field}>
                <label>Nome *</label>
                <TextInput
                  value={form.name}
                  onChange={e => handleField('name', e.target.value)}
                  placeholder="Ex: Investigar, Caçar, Conversar"
                  required
                  disabled={saving}
                />
              </div>
              <div className={styles.field}>
                <label>Descrição</label>
                <TextArea
                  value={form.description}
                  onChange={e => handleField('description', e.target.value)}
                  rows={2}
                  disabled={saving}
                />
              </div>
              <div className={styles.field}>
                <label>Duração Base (minutos) *</label>
                <TextInput
                  type="number"
                  min={1}
                  value={form.baseDurationMinutes}
                  onChange={e => handleField('baseDurationMinutes', Number(e.target.value))}
                  disabled={saving}
                />
              </div>
            </div>

            {/* Modificadores de Stat */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>
                Modificadores de Stat
                <Button
                  type="button"
                  icon={<FaPlus />}
                  onClick={() => handleField('statModifiers', [...form.statModifiers, { ...EMPTY_STAT_MODIFIER }])}
                  disabled={saving}
                  backgroundColor="var(--maroon)"
                  textColor="#fff"
                  hoverColor="#a00030"
                >
                  Adicionar
                </Button>
              </h3>
              {form.statModifiers.length === 0 && (
                <p className={styles.emptyText}>Nenhum modificador de stat cadastrado.</p>
              )}
              {form.statModifiers.map((mod, i) => (
                <div key={i} className={styles.modifierRow}>
                  <div className={styles.field}>
                    <label>Stat Key</label>
                    <TextInput
                      value={mod.statKey}
                      onChange={e => handleStatModifierChange(i, 'statKey', e.target.value)}
                      placeholder="dex"
                      disabled={saving}
                    />
                  </div>
                  <div className={styles.field}>
                    <label>Redução/Ponto</label>
                    <TextInput
                      type="number"
                      min={0}
                      value={mod.reductionPerPoint}
                      onChange={e => handleStatModifierChange(i, 'reductionPerPoint', Number(e.target.value))}
                      disabled={saving}
                    />
                  </div>
                  <div className={styles.field}>
                    <label>Redução Máx.</label>
                    <TextInput
                      type="number"
                      min={0}
                      value={mod.maxReduction}
                      onChange={e => handleStatModifierChange(i, 'maxReduction', Number(e.target.value))}
                      disabled={saving}
                    />
                  </div>
                  <Button
                    type="button"
                    icon={<FaTrash />}
                    onClick={() => handleField('statModifiers', form.statModifiers.filter((_, idx) => idx !== i))}
                    disabled={saving}
                    backgroundColor="transparent"
                    textColor="#d92828"
                    hoverColor="var(--dark-4)"
                  />
                </div>
              ))}
            </div>

            {/* Modificadores de Item */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>
                Modificadores de Item
                <Button
                  type="button"
                  icon={<FaPlus />}
                  onClick={() => handleField('itemModifiers', [...form.itemModifiers, { ...EMPTY_ITEM_MODIFIER }])}
                  disabled={saving}
                  backgroundColor="var(--maroon)"
                  textColor="#fff"
                  hoverColor="#a00030"
                >
                  Adicionar
                </Button>
              </h3>
              {form.itemModifiers.length === 0 && (
                <p className={styles.emptyText}>Nenhum modificador de item cadastrado.</p>
              )}
              {form.itemModifiers.map((mod, i) => (
                <div key={i} className={styles.modifierRow}>
                  <div className={styles.field}>
                    <label>Item ID</label>
                    <TextInput
                      value={mod.itemId}
                      onChange={e => handleItemModifierChange(i, 'itemId', e.target.value)}
                      placeholder="ObjectId do item"
                      disabled={saving}
                    />
                  </div>
                  <div className={styles.field}>
                    <label>Redução (%)</label>
                    <TextInput
                      type="number"
                      min={0}
                      max={100}
                      value={mod.reductionPercent}
                      onChange={e => handleItemModifierChange(i, 'reductionPercent', Number(e.target.value))}
                      disabled={saving}
                    />
                  </div>
                  <Button
                    type="button"
                    icon={<FaTrash />}
                    onClick={() => handleField('itemModifiers', form.itemModifiers.filter((_, idx) => idx !== i))}
                    disabled={saving}
                    backgroundColor="transparent"
                    textColor="#d92828"
                    hoverColor="var(--dark-4)"
                  />
                </div>
              ))}
            </div>

            {/* Modificadores de Efeito Ativo */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>
                Modificadores de Efeito Ativo
                <Button
                  type="button"
                  icon={<FaPlus />}
                  onClick={() => handleField('activeEffectModifiers', [...form.activeEffectModifiers, { ...EMPTY_EFFECT_MODIFIER }])}
                  disabled={saving}
                  backgroundColor="var(--maroon)"
                  textColor="#fff"
                  hoverColor="#a00030"
                >
                  Adicionar
                </Button>
              </h3>
              {form.activeEffectModifiers.length === 0 && (
                <p className={styles.emptyText}>Nenhum modificador de efeito ativo cadastrado.</p>
              )}
              {form.activeEffectModifiers.map((mod, i) => (
                <div key={i} className={styles.modifierRow}>
                  <div className={styles.field}>
                    <label>Nome do Efeito</label>
                    <TextInput
                      value={mod.effectName}
                      onChange={e => handleEffectModifierChange(i, 'effectName', e.target.value)}
                      placeholder="Ex: Bênção da Velocidade"
                      disabled={saving}
                    />
                  </div>
                  <div className={styles.field}>
                    <label>Fator de Tempo</label>
                    <TextInput
                      type="number"
                      min={0}
                      step={0.05}
                      value={mod.timeFactor}
                      onChange={e => handleEffectModifierChange(i, 'timeFactor', Number(e.target.value))}
                      disabled={saving}
                    />
                  </div>
                  <Button
                    type="button"
                    icon={<FaTrash />}
                    onClick={() => handleField('activeEffectModifiers', form.activeEffectModifiers.filter((_, idx) => idx !== i))}
                    disabled={saving}
                    backgroundColor="transparent"
                    textColor="#d92828"
                    hoverColor="var(--dark-4)"
                  />
                </div>
              ))}
            </div>

        </Modal.Body>

        <Modal.Footer alignment="between">
          <Button
            backgroundColor="var(--dark-3)"
            textColor="var(--light)"
            hoverColor="var(--gold)"
            onClick={onClose}
            disabled={saving}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            backgroundColor="var(--maroon)"
            textColor="#fff"
            hoverColor="#a00030"
            disabled={saving}
          >
            {saving ? 'Salvando…' : 'Salvar'}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
