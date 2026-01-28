import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { FaTrash } from 'react-icons/fa';
import Modal, { MODAL_SIZES, COLUMN_LAYOUTS } from '../../../shared/components/Modal';
import TextInput from '../../../shared/components/TextInput';
import TextArea from '../../../shared/components/TextArea';
import PhotoInput from '../../../shared/components/PhotoInput';
import Button from '../../../shared/components/Button';
import ConfirmationModal from '../../../shared/components/ConfirmationModal';
import api from '../../../config/api';
import { MESSAGES } from '../constants';
import styles from '../styles/CurrencyModal.module.css';

export default function CurrencyModal({ isOpen, onClose, onSave, onIconDeleted, initialData = {} }) {
  const { enqueueSnackbar } = useSnackbar();

  const [form, setForm] = useState({
    _id: '',
    name: '',
    symbol: '',
    description: '',
    iconUrl: ''
  });

  const [iconFile, setIconFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setForm({
      _id: initialData._id || '',
      name: initialData.name || '',
      symbol: initialData.symbol || '',
      description: initialData.description || '',
      iconUrl: initialData.iconUrl || ''
    });
    setIconFile(null);
    setPreviewUrl(initialData.iconUrl || '');
  }, [initialData, isOpen]);

  const handleChange = (field, value) =>
    setForm(f => ({ ...f, [field]: value }));

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    setIconFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const performDeleteIcon = async () => {
    if (!form._id) {
      setIconFile(null);
      setPreviewUrl('');
      handleChange('iconUrl', '');
      setConfirmOpen(false);
      onIconDeleted?.();
      return;
    }
    setDeleting(true);
    try {
      await api.delete(`/currency/${form._id}/icon`);
      enqueueSnackbar(MESSAGES.ICON_DELETE_SUCCESS, { variant: 'success' });
      setPreviewUrl('');
      handleChange('iconUrl', '');
      onIconDeleted?.();
    } catch {
      enqueueSnackbar(MESSAGES.ICON_DELETE_ERROR, { variant: 'error' });
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      if (form._id) fd.append('_id', form._id);
      fd.append('name', form.name);
      fd.append('symbol', form.symbol);
      fd.append('description', form.description);
      if (iconFile) fd.append('icon', iconFile);

      await onSave(fd, form._id);
      onClose();
    } catch {
      // Error handled in hook
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <ConfirmationModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        icon={FaTrash}
        message={MESSAGES.ICON_DELETE_CONFIRM}
        buttons={[
          { text: 'Cancelar', onClick: () => setConfirmOpen(false), disabled: deleting },
          { text: 'Excluir', onClick: performDeleteIcon, disabled: deleting, buttonColor: '#d92828' }
        ]}
      />

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={form._id ? 'Editar Moeda' : 'Nova Moeda'}
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
                  placeholder="Nome da moeda"
                  required
                  disabled={saving}
                />
              </div>

              <div className={styles.field}>
                <label>Símbolo</label>
                <TextInput
                  value={form.symbol}
                  onChange={e => handleChange('symbol', e.target.value)}
                  placeholder="Ex: 💰, $, €"
                  required
                  disabled={saving}
                />
              </div>

              <div className={styles.field}>
                <label>Descrição</label>
                <TextArea
                  value={form.description}
                  onChange={e => handleChange('description', e.target.value)}
                  placeholder="Descrição opcional"
                  disabled={saving}
                  rows={3}
                />
              </div>

              <div className={styles.field}>
                <label>Ícone</label>
                <PhotoInput
                  file={iconFile}
                  previewUrl={previewUrl}
                  onFileChange={handleFileChange}
                  onRemove={() => setConfirmOpen(true)}
                  placeholderLabel="Escolher ícone"
                  disabled={saving}
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
    </>
  );
}
