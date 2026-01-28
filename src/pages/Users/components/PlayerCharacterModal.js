// src/pages/Users/components/PlayerCharacterModal.js

import React, { useEffect, useState } from 'react';
import Modal, { MODAL_SIZES } from '../../../shared/components/Modal';
import TextInput from '../../../shared/components/TextInput';
import Select from '../../../shared/components/Select';
import PhotoInput from '../../../shared/components/PhotoInput';
import Button from '../../../shared/components/Button';
import ConfirmationModal from '../../../shared/components/ConfirmationModal';
import styles from '../../Characters/styles/CharacterModal.module.css';

const emptyForm = {
  _id: '',
  name: '',
  classId: '',
  gender: 'male',
  level: 1,
  xp: 0,
  nextLevelXp: 100,
  levelUpPoints: 0,
  currency: 0,
  iconUrl: '',
  stats: {
    health: 0,
    sanity: 0,
    physicalAttack: 0,
    rangedAttack: 0,
    strength: 0,
    dexterity: 0,
    intelligence: 0,
    willpower: 0
  },
  currentHp: 0,
  maxHp: 0,
  currentSp: 0,
  maxSp: 0,
  faceIndex: 0,
  hairIndex: 0,
  eyesIndex: 0,
  beardIndex: 0,
  serverId: ''
};

export default function PlayerCharacterModal({
  isOpen,
  onClose,
  onSave,
  onIconDeleted,
  initialData = null,
  classes = [],
  servers = []
}) {
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

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
      const classVal = initialData.classId || 
        (initialData.class 
          ? (typeof initialData.class === 'object' ? initialData.class._id : initialData.class) 
          : '');
      const serverVal = initialData.server 
        ? (typeof initialData.server === 'object' ? initialData.server._id : initialData.server) 
        : '';
      
      setForm({
        _id: initialData._id || '',
        name: initialData.name || '',
        classId: classVal || '',
        gender: initialData.gender || 'male',
        level: initialData.level || 1,
        xp: initialData.xp || 0,
        nextLevelXp: initialData.nextLevelXp || 100,
        levelUpPoints: initialData.levelUpPoints || 0,
        currency: initialData.currency || 0,
        iconUrl: initialData.iconUrl || '',
        stats: initialData.stats || emptyForm.stats,
        currentHp: initialData.currentHp || 0,
        maxHp: initialData.maxHp || 0,
        currentSp: initialData.currentSp || 0,
        maxSp: initialData.maxSp || 0,
        faceIndex: initialData.faceIndex || 0,
        hairIndex: initialData.hairIndex || 0,
        eyesIndex: initialData.eyesIndex || 0,
        beardIndex: initialData.beardIndex || 0,
        serverId: serverVal || ''
      });
      setFile(null);
      setPreview(initialData.iconUrl || '');
      setConfirmDelete(false);
    }
  }, [initialData]);

  const handleFileChange = (fileInput) => {
    if (!fileInput) {
      if (preview && preview.startsWith('blob:')) URL.revokeObjectURL(preview);
      setFile(null);
      setPreview('');
      return;
    }
    let selectedFile;
    if (fileInput instanceof File) selectedFile = fileInput;
    else if (fileInput.length && fileInput[0] instanceof File) selectedFile = fileInput[0];
    else if (fileInput.target && fileInput.target.files) selectedFile = fileInput.target.files[0];
    else return;
    
    if (preview && preview.startsWith('blob:')) URL.revokeObjectURL(preview);
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleRemoveIcon = async () => {
    setSaving(true);
    try {
      if (form._id && onIconDeleted) await onIconDeleted(form._id);
      setForm(f => ({ ...f, iconUrl: '' }));
      setFile(null);
      setPreview('');
    } finally {
      setSaving(false);
      setConfirmDelete(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const entityType = 'player';
      let payload;
      
      if (file) {
        payload = new FormData();
        Object.entries(form).forEach(([key, val]) => {
          if (key === 'iconUrl') return;
          if (key === 'classId') { if (val) payload.append('class', val); return; }
          if (key === 'serverId') { 
            payload.append('server', val ? val : 'null');
            return; 
          }
          if (key === 'stats') { payload.append('stats', JSON.stringify(val || {})); return; }
          payload.append(key, val);
        });
        payload.append('type', entityType);
        payload.append('icon', file);
      } else {
        payload = { ...form, stats: form.stats || {}, type: entityType };
        if (payload.classId) payload.class = payload.classId;
        payload.server = payload.serverId ? payload.serverId : null;
        delete payload.classId;
        delete payload.serverId;
      }

      await onSave(payload);
      onClose();
    } finally {
      setSaving(false);
      if (preview && preview.startsWith('blob:')) URL.revokeObjectURL(preview);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={form._id ? 'Editar Personagem' : 'Novo Personagem'}
        size={MODAL_SIZES.LARGE}
      >
        <form onSubmit={handleSubmit}>
          <div className={styles.column}>
            <div className={styles.field}>
              <label>Nome</label>
              <TextInput 
                value={form.name} 
                onChange={e => setForm({ ...form, name: e.target.value })} 
                placeholder="Nome do personagem" 
                disabled={saving} 
                required 
              />
            </div>

            <div className={styles.field}>
              <label>Classe</label>
              <Select 
                value={form.classId} 
                onChange={(val) => setForm({ ...form, classId: val })} 
                options={[
                  { value: '', label: 'Selecione a classe' }, 
                  ...classes.map(c => ({ value: c._id, label: c.name }))
                ]} 
                disabled={saving} 
              />
            </div>

            <div className={styles.field}>
              <label>Servidor</label>
              <Select
                value={form.serverId}
                onChange={(val) => setForm({ ...form, serverId: val })}
                options={[
                  { value: '', label: 'Nenhum' }, 
                  ...servers.map(s => ({ value: s._id, label: s.name || s.slug || s._id }))
                ]}
                disabled={saving}
              />
            </div>

            <div className={styles.field}>
              <label>Ícone</label>
              <PhotoInput 
                file={file} 
                previewUrl={preview} 
                onFileChange={handleFileChange} 
                onRemove={() => setConfirmDelete(true)} 
                accept="image/*" 
                disabled={saving} 
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              <div className={styles.field}>
                <label>Nível</label>
                <TextInput 
                  type="number" 
                  value={form.level} 
                  onChange={e => setForm({ ...form, level: +e.target.value })} 
                  min={1} 
                  disabled={saving} 
                />
              </div>
              <div className={styles.field}>
                <label>XP</label>
                <TextInput 
                  type="number" 
                  value={form.xp} 
                  onChange={e => setForm({ ...form, xp: +e.target.value })} 
                  min={0} 
                  disabled={saving} 
                />
              </div>
              <div className={styles.field}>
                <label>Moeda</label>
                <TextInput 
                  type="number" 
                  value={form.currency} 
                  onChange={e => setForm({ ...form, currency: +e.target.value })} 
                  min={0} 
                  disabled={saving} 
                />
              </div>
            </div>

            <h3 style={{ margin: '1rem 0 0.5rem', color: 'var(--gold)' }}>Vida / Sanidade</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
              <div className={styles.field}>
                <label>Max HP</label>
                <TextInput type="number" value={form.maxHp} onChange={e => setForm({ ...form, maxHp: +e.target.value })} disabled={saving} />
              </div>
              <div className={styles.field}>
                <label>Current HP</label>
                <TextInput type="number" value={form.currentHp} onChange={e => setForm({ ...form, currentHp: +e.target.value })} disabled={saving} />
              </div>
              <div className={styles.field}>
                <label>Max SP</label>
                <TextInput type="number" value={form.maxSp} onChange={e => setForm({ ...form, maxSp: +e.target.value })} disabled={saving} />
              </div>
              <div className={styles.field}>
                <label>Current SP</label>
                <TextInput type="number" value={form.currentSp} onChange={e => setForm({ ...form, currentSp: +e.target.value })} disabled={saving} />
              </div>
            </div>

            <h3 style={{ margin: '1rem 0 0.5rem', color: 'var(--gold)' }}>Stats</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
              {Object.entries(form.stats || {}).map(([k, v]) => (
                <div className={styles.field} key={k}>
                  <label>{k}</label>
                  <TextInput 
                    type="number" 
                    value={v} 
                    onChange={e => setForm(f => ({ ...f, stats: { ...f.stats, [k]: +e.target.value } }))} 
                    min={0} 
                    disabled={saving} 
                  />
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
              <Button 
                type="submit" 
                variant="primary" 
                disabled={saving}
              >
                {saving ? 'Salvando…' : 'Salvar'}
              </Button>
              <Button onClick={onClose} disabled={saving}>
                Cancelar
              </Button>
            </div>
          </div>
        </form>
      </Modal>

      <ConfirmationModal
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleRemoveIcon}
        title="Excluir Ícone"
        message="Tem certeza que deseja remover o ícone do personagem?"
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="danger"
      />
    </>
  );
}
