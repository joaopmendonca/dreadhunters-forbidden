import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import Modal, { MODAL_SIZES } from '../../../shared/components/Modal';
import TextInput from '../../../shared/components/TextInput';
import TextArea from '../../../shared/components/TextArea';
import Button from '../../../shared/components/Button';
import PhotoInput from '../../../shared/components/PhotoInput';
import api from '../../../config/api';
import { DEFAULT_MAX_ITEMS, DEFAULT_ORDER } from '../constants';
import { buildImageSrc } from '../utils';
import styles from '../styles/EquipmentSlotModal.module.css';

export default function EquipmentSlotModal({ isOpen, onClose, onSave, initialData = {} }) {
  const { enqueueSnackbar } = useSnackbar();
  const [form, setForm] = useState({
    key: '',
    name: '',
    description: '',
    maxItems: DEFAULT_MAX_ITEMS,
    order: DEFAULT_ORDER,
    active: true
  });
  const [saving, setSaving] = useState(false);
  const [iconFile, setIconFile] = useState(null);
  const [iconPreview, setIconPreview] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    if (initialData._id) {
      setForm({
        key: initialData.key || '',
        name: initialData.name || '',
        description: initialData.description || '',
        maxItems: initialData.maxItems || DEFAULT_MAX_ITEMS,
        order: initialData.order || DEFAULT_ORDER,
        active: initialData.active !== undefined ? initialData.active : true
      });

      if (initialData.iconUrl) {
        setIconPreview(buildImageSrc(initialData.iconUrl));
      } else {
        setIconPreview('');
      }
    } else {
      setForm({
        key: '',
        name: '',
        description: '',
        maxItems: DEFAULT_MAX_ITEMS,
        order: DEFAULT_ORDER,
        active: true
      });
      setIconPreview('');
    }

    setIconFile(null);
  }, [initialData, isOpen]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleIconChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setIconFile(file);
      setIconPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveIcon = async () => {
    if (initialData._id && initialData.iconUrl) {
      try {
        await api.delete(`/equipment-slots/${initialData._id}/icon`);
        enqueueSnackbar('Icone removido', { variant: 'success' });
      } catch {
        enqueueSnackbar('Erro ao remover icone', { variant: 'error' });
      }
    }

    setIconFile(null);
    setIconPreview('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append('key', form.key.trim().toLowerCase());
      formData.append('name', form.name.trim());
      formData.append('description', form.description.trim());
      formData.append('maxItems', form.maxItems);
      formData.append('order', form.order);
      formData.append('active', form.active);

      if (iconFile) {
        formData.append('icon', iconFile);
      }

      await onSave(formData, initialData._id);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData._id ? 'Editar Slot de Equipamento' : 'Novo Slot de Equipamento'}
      size={MODAL_SIZES.MEDIUM}
      closeOnOverlayClick
    >
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          <div className={styles.modalBody}>
            <div className={styles.row}>
              <div className={styles.field}>
                <label>Key</label>
                <TextInput
                  value={form.key}
                  onChange={(e) => handleChange('key', e.target.value)}
                  placeholder="ex: head, left_hand"
                  required
                  disabled={saving}
                />
              </div>

              <div className={styles.field}>
                <label>Nome</label>
                <TextInput
                  value={form.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="ex: Cabeca"
                  required
                  disabled={saving}
                />
              </div>
            </div>

            <div className={styles.field}>
              <label>Descricao</label>
              <TextArea
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Descricao do slot"
                rows={3}
                disabled={saving}
              />
            </div>

            <div className={styles.field}>
              <label>Icone</label>
              <PhotoInput
                file={iconFile}
                previewUrl={iconPreview}
                onFileChange={handleIconChange}
                onRemove={handleRemoveIcon}
                disabled={saving}
                placeholderLabel="Escolher icone"
              />
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label>Maximo de Itens</label>
                <TextInput
                  type="number"
                  min={1}
                  value={form.maxItems}
                  onChange={(e) => handleChange('maxItems', parseInt(e.target.value, 10) || 1)}
                  disabled={saving}
                />
              </div>

              <div className={styles.field}>
                <label>Ordem</label>
                <TextInput
                  type="number"
                  value={form.order}
                  onChange={(e) => handleChange('order', parseInt(e.target.value, 10) || 0)}
                  disabled={saving}
                />
              </div>
            </div>

            <div className={styles.checkboxField}>
              <input
                type="checkbox"
                id="active"
                checked={form.active}
                onChange={(e) => handleChange('active', e.target.checked)}
                disabled={saving}
              />
              <label htmlFor="active">Ativo</label>
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
            type="button"
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
            {saving ? 'Salvando...' : 'Salvar'}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
