import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import Modal, { MODAL_SIZES, COLUMN_LAYOUTS } from '../../../shared/components/Modal';
import Button from '../../../shared/components/Button';
import PhotoInput from '../../../shared/components/PhotoInput';
import Select from '../../../shared/components/Select';
import TextArea from '../../../shared/components/TextArea';
import TextInput from '../../../shared/components/TextInput';
import ConfirmationModal from '../../../shared/components/ConfirmationModal';
import useServerConfig from '../../../shared/hooks/useServerConfig';
import styles from '../styles/CharacterModal.module.css';

const emptyForm = {
  _id: '',
  name: '',
  description: '',
  classId: '',
  gender: 'male',
  level: 1,
  xp: 0,
  nextLevelXp: 100,
  levelUpPoints: 0,
  currency: 0,
  iconUrl: ''
};

export default function CharacterModal({
  isOpen,
  onClose,
  onSave,
  onIconDeleted,
  initialData = null,
  classes = []
}) {
  const { enqueueSnackbar } = useSnackbar();
  const { config: serverConfig } = useServerConfig();
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const statsEnabled = Boolean(form.classId);

  useEffect(() => {
    if (isOpen && !initialData) {
      setForm(emptyForm);
      setFile(null);
      setPreview('');
      setConfirmDelete(false);
    }
  }, [isOpen, initialData]);

  useEffect(() => {
    if (initialData) {
      const classVal = initialData.classId || (initialData.class ? (typeof initialData.class === 'object' ? initialData.class._id : initialData.class) : '');
      setForm({
        _id: initialData._id || '',
        name: initialData.name || '',
        description: initialData.description || '',
        classId: classVal || '',
        gender: initialData.gender || 'male',
        level: initialData.level || 1,
        xp: initialData.xp || 0,
        nextLevelXp: initialData.nextLevelXp || 100,
        levelUpPoints: initialData.levelUpPoints || 0,
        currency: initialData.currency || 0,
        iconUrl: initialData.iconUrl || ''
      });
      setFile(null);
      setPreview(initialData.iconUrl || '');
      setConfirmDelete(false);
    }
  }, [initialData]);

  const handleFileChange = (fileInput) => {
    // Se não veio arquivo, limpa estado e revoga preview anterior
    if (!fileInput) {
      if (preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
      setFile(null);
      setPreview('');
      return;
    }

    let selectedFile;

    // 1) Recebeu diretamente um File?
    if (fileInput instanceof File) {
      selectedFile = fileInput;

      // 2) Recebeu um array ou FileList?
    } else if (fileInput.length && fileInput[0] instanceof File) {
      selectedFile = fileInput[0];

      // 3) Recebeu evento do input <input type="file" />?
    } else if (fileInput.target && fileInput.target.files) {
      selectedFile = fileInput.target.files[0];

    } else {
      console.error('handleFileChange: formato de arquivo não reconhecido', fileInput);
      return;
    }

    // Revoga URL antiga, se existir
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }

    // Atualiza estado com o novo File e gera o preview
    setFile(selectedFile);
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
  };


  const handleRemoveIcon = async () => {
    setSaving(true);
    try {
      if (form._id && onIconDeleted) {
        await onIconDeleted(form._id);
      }
      setForm((f) => ({ ...f, iconUrl: '' }));
      setFile(null);
      setPreview('');
      enqueueSnackbar('Ícone removido', { variant: 'success' });
    } catch {
      enqueueSnackbar('Erro ao remover ícone', { variant: 'error' });
    } finally {
      setSaving(false);
      setConfirmDelete(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let payload;
      if (file) {
        payload = new FormData();
        Object.entries(form).forEach(([key, val]) => {
          if (key === 'iconUrl') return;
          if (key === 'classId') {
            if (val) payload.append('class', val);
            return;
          }
          payload.append(key, val);
        });
        payload.append('type', 'npc');
        payload.append('icon', file);
      } else {
        payload = {
          ...form,
          type: 'npc',
          ...(form.classId ? { class: form.classId } : {})
        };
        delete payload.classId;
      }
      await onSave(payload);
      enqueueSnackbar(
        form._id ? 'NPC atualizado com sucesso.' : 'NPC criado com sucesso.',
        { variant: 'success' }
      );
      onClose();
    } catch {
      enqueueSnackbar('Falha ao salvar NPC.', { variant: 'error' });
    } finally {
      setSaving(false);
      if (preview.startsWith('blob:')) URL.revokeObjectURL(preview);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={form._id ? 'Editar NPC' : 'Novo NPC'}
        icon={<FaUser />}
        size={MODAL_SIZES.XLARGE}
        closeOnOverlayClick={!saving}
      >
        <form onSubmit={handleSubmit}>
          <Modal.Body columns={COLUMN_LAYOUTS.DOUBLE}>
            {/* Coluna 1 - Informações Básicas */}
            <div className={styles.column}>
              <div className={styles.field}>
                <label>Nome do NPC</label>
                <TextInput
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Nome"
                  disabled={saving}
                  required
                />
              </div>

              <div className={styles.field}>
                <label>Descrição</label>
                <TextArea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows={3}
                  disabled={saving}
                  placeholder="Descrição"
                />
              </div>

              <div className={styles.field}>
                <label>Classe</label>
                <Select
                  value={form.classId}
                  onChange={(val) => setForm({ ...form, classId: val })}
                  options={[
                    { value: '', label: 'Selecione a classe' },
                    ...classes.map((c) => ({ value: c._id, label: c.name }))
                  ]}
                  disabled={saving}
                />
              </div>

              <div className={styles.field}>
                <label>Gênero</label>
                <Select
                  value={form.gender}
                  onChange={(val) => setForm({ ...form, gender: val })}
                  options={[
                    { value: 'male', label: 'Masculino' },
                    { value: 'female', label: 'Feminino' },
                    { value: 'other', label: 'Outro' }
                  ]}
                  disabled={saving}
                />
              </div>

              <div className={styles.field}>
                <label>Ícone do NPC</label>
                <PhotoInput
                  file={file}
                  previewUrl={preview}
                  onFileChange={handleFileChange}
                  onRemove={() => setConfirmDelete(true)}
                  accept="image/*"
                  disabled={saving}
                />
              </div>
            </div>

            {/* Coluna 2 - Estatísticas */}
            <div className={styles.column}>
              <div className={styles.field}>
                <label>Nível</label>
                <TextInput
                  type="number"
                  value={form.level}
                  onChange={(e) =>
                    setForm({ ...form, level: Math.min(serverConfig.maxLevel, Math.max(1, +e.target.value)) })
                  }
                  disabled={!statsEnabled || saving}
                  min={1}
                  max={serverConfig.maxLevel}
                />
              </div>

              <div className={styles.field}>
                <label>XP Atual</label>
                <TextInput
                  type="number"
                  value={form.xp}
                  onChange={(e) => setForm({ ...form, xp: +e.target.value })}
                  disabled={!statsEnabled || saving}
                  min={0}
                />
              </div>

              <div className={styles.field}>
                <label>XP p/ Próx. Nível</label>
                <TextInput
                  type="number"
                  value={form.nextLevelXp}
                  onChange={(e) =>
                    setForm({ ...form, nextLevelXp: +e.target.value })
                  }
                  disabled={!statsEnabled || saving}
                  min={1}
                />
              </div>

              <div className={styles.field}>
                <label>Pontos Level-Up</label>
                <TextInput
                  type="number"
                  value={form.levelUpPoints}
                  onChange={(e) =>
                    setForm({ ...form, levelUpPoints: +e.target.value })
                  }
                  disabled={!statsEnabled || saving}
                  min={0}
                />
              </div>

              <div className={styles.field}>
                <label>Moeda</label>
                <TextInput
                  type="number"
                  value={form.currency}
                  onChange={(e) =>
                    setForm({ ...form, currency: +e.target.value })
                  }
                  disabled={!statsEnabled || saving}
                  min={0}
                />
              </div>
            </div>
          </Modal.Body>

          <Modal.Footer alignment="between">
            <Button
              type="button"
              onClick={onClose}
              variant="secondary"
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              backgroundColor="var(--maroon)"
              textColor="var(--light)"
              hoverColor="var(--gold)"
              disabled={saving}
            >
              {saving ? 'Salvando…' : 'Salvar'}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>

      <ConfirmationModal
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleRemoveIcon}
        title="Excluir Ícone"
        message="Tem certeza que deseja excluir o ícone do NPC?"
        confirmText="Sim, excluir"
        cancelText="Cancelar"
        isLoading={saving}
      />
    </>
  );
}
