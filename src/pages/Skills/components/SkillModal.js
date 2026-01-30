import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { FaTrash } from 'react-icons/fa';
import Modal, { MODAL_SIZES, COLUMN_LAYOUTS } from '../../../shared/components/Modal';
import ConfirmationModal from '../../../shared/components/ConfirmationModal';
import TextInput from '../../../shared/components/TextInput';
import TextArea from '../../../shared/components/TextArea';
import Select from '../../../shared/components/Select';
import PhotoInput from '../../../shared/components/PhotoInput';
import Button from '../../../shared/components/Button';
import StatsModifiersEditor from './StatsModifiersEditor';
import DurationEditor from './DurationEditor';
import AfflictionEffectsEditor from './AfflictionEffectsEditor';
import RecurringEffectsEditor from './RecurringEffectsEditor';
import DamageEditor from './DamageEditor';
import TargetSelector from './TargetSelector';
import { CostEditor } from './CostEditor';
import api from '../../../config/api';
import { TYPE_OPTIONS } from '../constants';
import styles from '../styles/SkillModal.module.css';

export function SkillModal({
  isOpen,
  onClose,
  onSave,
  initialData = {}
}) {
  const { enqueueSnackbar } = useSnackbar();
  const [form, setForm] = useState({
    name: '',
    description: '',
    type: 'active',
    levelRequirement: 1,
    classRestrictions: [],
    iconUrl: ''
  });
  const [iconFile, setIconFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [statsModifiers, setStatsModifiers] = useState({});
  const [duration, setDuration] = useState({ type: 'permanent' });
  const [afflictionEffects, setAfflictionEffects] = useState([]);
  const [recurringEffects, setRecurringEffects] = useState([]);
  const [cost, setCost] = useState({ resources: {}, items: [] });
  const [damage, setDamage] = useState({ formula: '', type: 'none' });
  const [targets, setTargets] = useState(['enemy']);
  const [statusList, setStatusList] = useState([]);
  const [itemsList, setItemsList] = useState([]);

  // Buscar status e itens ao montar
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statusRes, itemsRes] = await Promise.all([
          api.get('/status'),
          api.get('/items')
        ]);
        setStatusList(statusRes.data);
        setItemsList(itemsRes.data);
      } catch (err) {
        console.error('Erro ao carregar status/items:', err);
      }
    };
    if (isOpen) fetchData();
  }, [isOpen]);

  useEffect(() => {
    setForm({
      name: initialData.name || '',
      description: initialData.description || '',
      type: initialData.type || 'active',
      levelRequirement: initialData.levelRequirement ?? 1,
      classRestrictions: initialData.classRestrictions || [],
      iconUrl: initialData.iconUrl || ''
    });
    
    const modifiers = {};
    if (initialData.statsModifiers) {
      if (initialData.statsModifiers instanceof Map) {
        initialData.statsModifiers.forEach((value, key) => {
          modifiers[key] = value;
        });
      } else {
        Object.assign(modifiers, initialData.statsModifiers);
      }
    }
    setStatsModifiers(modifiers);
    
    // Duration
    setDuration(initialData.duration || { type: 'permanent' });
    
    // Affliction Effects
    setAfflictionEffects(initialData.afflictionEffects || []);
    
    // Recurring Effects
    setRecurringEffects(initialData.recurringEffects || []);
    
    // Cost
    setCost(initialData.cost || { resources: {}, items: [] });
    
    // Damage
    setDamage(initialData.damage || { formula: '', type: 'none' });
    
    // Targets
    setTargets(initialData.targets || ['enemy']);
    
    setIconFile(null);
    setPreviewUrl(initialData.iconUrl || '');
  }, [initialData, isOpen]);

  const handleChange = (field, val) =>
    setForm(prev => ({ ...prev, [field]: val }));

  const handleFileChange = e => {
    const f = e.target.files[0];
    if (f) {
      setIconFile(f);
      setPreviewUrl(URL.createObjectURL(f));
    }
  };

  const performDeleteIcon = async () => {
    if (!initialData._id) {
      setIconFile(null);
      setPreviewUrl('');
      return;
    }
    setDeleting(true);
    try {
      await api.delete(`/skills/${initialData._id}/icon`);
      enqueueSnackbar('Ícone removido', { variant: 'success' });
      setIconFile(null);
      setPreviewUrl('');
      setForm(prev => ({ ...prev, iconUrl: '' }));
    } catch {
      enqueueSnackbar('Falha ao remover ícone', { variant: 'error' });
    } finally {
      setDeleting(false);
    }
  };

  const handleConfirmDelete = async () => {
    setConfirmOpen(false);
    await performDeleteIcon();
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name.trim());
      fd.append('description', form.description.trim());
      fd.append('type', form.type);
      fd.append('levelRequirement', form.levelRequirement);
      fd.append('classRestrictions', JSON.stringify(form.classRestrictions));
      fd.append('statsModifiers', JSON.stringify(statsModifiers));
      fd.append('duration', JSON.stringify(duration));
      fd.append('afflictionEffects', JSON.stringify(afflictionEffects));
      fd.append('recurringEffects', JSON.stringify(recurringEffects));
      fd.append('cost', JSON.stringify(cost));
      fd.append('damage', JSON.stringify(damage));
      fd.append('targets', JSON.stringify(targets));
      if (iconFile) fd.append('icon', iconFile);

      await onSave(fd, initialData._id);
      onClose();
    } catch {
      enqueueSnackbar('Falha ao salvar skill', { variant: 'error' });
    } finally {
      setSaving(false);
      if (previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
    }
  };

  return (
    <>
      <ConfirmationModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        icon={FaTrash}
        iconColor="#d92828"
        message="A remoção da foto não poderá ser desfeita. Deseja continuar?"
        buttons={[
          {
            text: 'Cancelar',
            onClick: () => setConfirmOpen(false),
            buttonColor: 'transparent',
            textColor: '#fff',
            disabled: deleting
          },
          {
            text: 'Excluir',
            onClick: handleConfirmDelete,
            buttonColor: '#d92828',
            textColor: '#fff',
            disabled: deleting
          }
        ]}
      />

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={initialData._id ? 'Editar Skill' : 'Nova Skill'}
        size={MODAL_SIZES.FULL}
        closeOnOverlayClick
      >
        <form onSubmit={handleSubmit}>
          <Modal.Body columns={COLUMN_LAYOUTS.DOUBLE}>
            {/* Coluna Esquerda */}
            <div className={styles.column}>
              <div className={styles.section}>
                <span className={styles.sectionTitle}>Identidade</span>

                <div className={styles.field}>
                  <label>Nome da Skill</label>
                  <TextInput
                    value={form.name}
                    onChange={e => handleChange('name', e.target.value)}
                    placeholder="Nome da skill"
                    required
                    disabled={saving}
                  />
                </div>

                <div className={styles.field}>
                  <label>Tipo</label>
                  <Select
                    value={form.type}
                    onChange={val => handleChange('type', val)}
                    options={TYPE_OPTIONS}
                    disabled={saving}
                  />
                </div>

                <div className={styles.field}>
                  <label>Level Mínimo</label>
                  <TextInput
                    type="number"
                    min={1}
                    value={form.levelRequirement}
                    onChange={e => handleChange('levelRequirement', +e.target.value)}
                    disabled={saving}
                  />
                </div>
              </div>

              <div className={styles.section}>
                <span className={styles.sectionTitle}>Descrição</span>

                <div className={styles.field}>
                  <label>Descrição da Skill</label>
                  <TextArea
                    value={form.description}
                    onChange={e => handleChange('description', e.target.value)}
                    placeholder="Descrição da skill"
                    rows={5}
                    disabled={saving}
                  />
                </div>
              </div>

              <div className={styles.section}>
                <span className={styles.sectionTitle}>Visuais</span>

                <div className={styles.field}>
                  <label>Ícone da Skill</label>
                  <PhotoInput
                    file={iconFile}
                    previewUrl={previewUrl}
                    onFileChange={handleFileChange}
                    onRemove={() => setConfirmOpen(true)}
                    disabled={saving}
                    placeholderLabel="Escolher imagem"
                  />
                </div>
              </div>

              <div className={styles.section}>
                <DurationEditor
                  duration={duration}
                  onChange={setDuration}
                  disabled={saving}
                />
              </div>
            </div>

            {/* Coluna Direita */}
            <div className={styles.column}>
              <div className={styles.section}>
                <CostEditor
                  cost={cost}
                  onChange={setCost}
                  disabled={saving}
                  statusList={statusList}
                  itemsList={itemsList}
                />
              </div>

              <div className={styles.section}>
                <DamageEditor
                  damage={damage}
                  onChange={setDamage}
                  disabled={saving}
                  statusList={statusList}
                />
              </div>

              <div className={styles.section}>
                <TargetSelector
                  value={targets}
                  onChange={setTargets}
                />
              </div>

              <div className={styles.section}>
                <StatsModifiersEditor
                  modifiers={statsModifiers}
                  onChange={setStatsModifiers}
                  disabled={saving}
                />
              </div>

              <div className={styles.section}>
                <AfflictionEffectsEditor
                  effects={afflictionEffects}
                  onChange={setAfflictionEffects}
                  disabled={saving}
                />
              </div>

              <div className={styles.section}>
                <RecurringEffectsEditor
                  effects={recurringEffects}
                  onChange={setRecurringEffects}
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
              {saving ? 'Salvando…' : 'Salvar'}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}
