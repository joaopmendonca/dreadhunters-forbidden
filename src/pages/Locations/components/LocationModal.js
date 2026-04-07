import { useState, useEffect } from 'react';
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
import styles from '../styles/LocationModal.module.css';

export default function LocationModal({ isOpen, onClose, onSave, onIconDeleted, initialData = {} }) {
  const { enqueueSnackbar } = useSnackbar();

  const [form, setForm] = useState({
    _id: '',
    name: '',
    description: '',
    positionX: 0,
    positionY: 0,
    iconUrl: '',
    isSafePoint: false
  });

  const [iconFile, setIconFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setForm({
      _id: initialData._id || '',
      name: initialData.name || '',
      description: initialData.description || '',
      positionX: initialData.position?.x || 0,
      positionY: initialData.position?.y || 0,
      iconUrl: initialData.iconUrl || '',
      isSafePoint: initialData.isSafePoint || false
    });
    setIconFile(null);
    setPreviewUrl(initialData.iconUrl || '');
  }, [isOpen, initialData]);

  const changeField = (field, value) => setForm(f => ({ ...f, [field]: value }));

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
      changeField('iconUrl', '');
      setConfirmOpen(false);
      onIconDeleted?.();
      return;
    }
    setDeleting(true);
    try {
      await api.delete(`/locations/${form._id}/icon`);
      enqueueSnackbar(MESSAGES.ICON_DELETE_SUCCESS, { variant: 'success' });
      setPreviewUrl('');
      changeField('iconUrl', '');
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

    if (!form.name.trim()) {
      enqueueSnackbar(MESSAGES.VALIDATION_NAME, { variant: 'warning' });
      return;
    }

    setSaving(true);
    try {
      const fd = new FormData();
      if (form._id) fd.append('_id', form._id);
      fd.append('name', form.name);
      fd.append('description', form.description);
      fd.append('position.x', String(form.positionX));
      fd.append('position.y', String(form.positionY));
      fd.append('isSafePoint', String(form.isSafePoint));
      if (iconFile) fd.append('icon', iconFile);

      await onSave(fd, form._id);
      onClose();
    } catch {
      // Erro já tratado no hook
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
        title={form._id ? 'Editar Local' : 'Novo Local'}
        size={MODAL_SIZES.MEDIUM}
        closeOnOverlayClick
      >
        <form onSubmit={handleSubmit}>
          <Modal.Body columns={COLUMN_LAYOUTS.SINGLE}>
            <div className={styles.section}>
              <span className={styles.sectionTitle}>Informações</span>

              <div className={styles.field}>
                <label>Nome</label>
                <TextInput
                  value={form.name}
                  onChange={e => changeField('name', e.target.value)}
                  placeholder="Nome do local"
                  required
                  disabled={saving}
                />
              </div>

              <div className={styles.field}>
                <label>Descrição</label>
                <TextArea
                  value={form.description}
                  onChange={e => changeField('description', e.target.value)}
                  placeholder="Descrição breve do local"
                  rows={3}
                  disabled={saving}
                />
              </div>
            </div>

            <div className={styles.section}>
              <span className={styles.sectionTitle}>Posição</span>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label>Posição X</label>
                  <TextInput
                    type="number"
                    value={form.positionX}
                    onChange={e => changeField('positionX', +e.target.value)}
                    disabled={saving}
                  />
                </div>
                <div className={styles.field}>
                  <label>Posição Y</label>
                  <TextInput
                    type="number"
                    value={form.positionY}
                    onChange={e => changeField('positionY', +e.target.value)}
                    disabled={saving}
                  />
                </div>
              </div>

              <div className={styles.field} style={{ marginTop: 12 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={form.isSafePoint}
                    onChange={e => changeField('isSafePoint', e.target.checked)}
                    disabled={saving}
                  />
                  Safe Point (local seguro de partida para quests)
                </label>
              </div>
            </div>

            <div className={styles.section}>
              <span className={styles.sectionTitle}>Ícone</span>

              <div className={styles.field}>
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
