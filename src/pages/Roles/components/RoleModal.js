import React, { useState, useEffect } from 'react';
import Modal, { MODAL_SIZES, COLUMN_LAYOUTS } from '../../../shared/components/Modal';
import TextInput from '../../../shared/components/TextInput';
import TextArea from '../../../shared/components/TextArea';
import Button from '../../../shared/components/Button';
import styles from '../styles/RoleModal.module.css';

export default function RoleModal({ isOpen, onClose, onSave, initialData = {} }) {
  const [form, setForm] = useState({
    name: '',
    description: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm({
      name: initialData.name || '',
      description: initialData.description || ''
    });
  }, [initialData, isOpen]);

  const handleChange = (field, value) =>
    setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        name: form.name.trim(),
        description: form.description.trim()
      }, initialData._id);
      onClose();
    } catch {
      // Error handled in hook
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData._id ? 'Editar Role' : 'Nova Role'}
      size={MODAL_SIZES.MEDIUM}
      closeOnOverlayClick
    >
      <form onSubmit={handleSubmit}>
        <Modal.Body columns={COLUMN_LAYOUTS.SINGLE}>
          <div className={styles.column}>
            <div className={styles.field}>
              <label>Nome</label>
              <TextInput
                value={form.name}
                onChange={e => handleChange('name', e.target.value)}
                placeholder="Nome da Role"
                required
                disabled={saving}
              />
            </div>

            <div className={styles.field}>
              <label>Descrição</label>
              <TextArea
                value={form.description}
                onChange={e => handleChange('description', e.target.value)}
                placeholder="Breve descrição"
                disabled={saving}
                rows={3}
              />
            </div>
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
