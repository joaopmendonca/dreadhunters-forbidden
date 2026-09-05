import React, { useEffect, useState } from 'react';
import { FaUserAstronaut } from 'react-icons/fa';
import Modal, { MODAL_SIZES, COLUMN_LAYOUTS } from '../../../shared/components/Modal';
import Button from '../../../shared/components/Button';
import Select from '../../../shared/components/Select';
import TextArea from '../../../shared/components/TextArea';
import TextInput from '../../../shared/components/TextInput';
import PhotoInput from '../../../shared/components/PhotoInput';
import useStatus from '../../../shared/hooks/useStatus';
import { RARITIES, UNLOCK_TYPES, GENDERS } from '../constants';
import { statsToObject, buildImgSrc } from '../utils';
import styles from '../styles/PlayableCharacters.module.css';

const emptyForm = {
  _id: '',
  name: '',
  description: '',
  classId: '',
  rarity: 'common',
  unlockType: 'starter',
  gender: 'male',
  baseLevel: 1,
  isActive: true,
  baseStats: {},
};

export default function PlayableCharacterModal({ isOpen, onClose, onSave, initialData = null, classes = [] }) {
  const { baseStatus } = useStatus();
  const [form, setForm] = useState(emptyForm);
  const [portraitFile, setPortraitFile] = useState(null);
  const [portraitPreview, setPortraitPreview] = useState('');
  const [artworkFile, setArtworkFile] = useState(null);
  const [artworkPreview, setArtworkPreview] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    if (!initialData) {
      setForm(emptyForm);
      setPortraitFile(null); setPortraitPreview('');
      setArtworkFile(null); setArtworkPreview('');
      return;
    }
    const classVal =
      typeof initialData.class === 'object' ? initialData.class?._id : initialData.class;
    const statsObj = statsToObject(initialData.baseStats);
    const stats = {};
    (baseStatus || []).forEach((s) => { stats[s.nome] = statsObj[s.nome] || 0; });
    setForm({
      _id: initialData._id || '',
      name: initialData.name || '',
      description: initialData.description || '',
      classId: classVal || '',
      rarity: initialData.rarity || 'common',
      unlockType: initialData.unlockRule?.type || 'starter',
      gender: initialData.gender || 'male',
      baseLevel: initialData.baseLevel || 1,
      isActive: initialData.isActive !== false,
      baseStats: stats,
    });
    setPortraitFile(null);
    setPortraitPreview(initialData.portraitUrl ? buildImgSrc(initialData.portraitUrl) : '');
    setArtworkFile(null);
    setArtworkPreview(initialData.artworkUrl ? buildImgSrc(initialData.artworkUrl) : '');
  }, [isOpen, initialData, baseStatus]);

  const pickFile = (input) => {
    if (!input) return null;
    if (input instanceof File) return input;
    if (input.length && input[0] instanceof File) return input[0];
    if (input.target && input.target.files) return input.target.files[0];
    return null;
  };

  const onPortrait = (input) => {
    const f = pickFile(input);
    if (portraitPreview.startsWith('blob:')) URL.revokeObjectURL(portraitPreview);
    if (!f) { setPortraitFile(null); setPortraitPreview(''); return; }
    setPortraitFile(f); setPortraitPreview(URL.createObjectURL(f));
  };
  const onArtwork = (input) => {
    const f = pickFile(input);
    if (artworkPreview.startsWith('blob:')) URL.revokeObjectURL(artworkPreview);
    if (!f) { setArtworkFile(null); setArtworkPreview(''); return; }
    setArtworkFile(f); setArtworkPreview(URL.createObjectURL(f));
  };

  const handleStat = (name, value) => {
    setForm((prev) => ({ ...prev, baseStats: { ...prev.baseStats, [name]: Math.max(0, Number(value) || 0) } }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const unlockRule = { type: form.unlockType };
      let payload;
      if (portraitFile || artworkFile) {
        payload = new FormData();
        payload.append('name', form.name);
        payload.append('description', form.description || '');
        if (form.classId) payload.append('class', form.classId);
        payload.append('rarity', form.rarity);
        payload.append('gender', form.gender);
        payload.append('baseLevel', String(form.baseLevel));
        payload.append('isActive', String(form.isActive));
        payload.append('baseStats', JSON.stringify(form.baseStats));
        payload.append('unlockRule', JSON.stringify(unlockRule));
        if (portraitFile) payload.append('portrait', portraitFile);
        if (artworkFile) payload.append('artwork', artworkFile);
      } else {
        payload = {
          name: form.name,
          description: form.description || '',
          rarity: form.rarity,
          gender: form.gender,
          baseLevel: Number(form.baseLevel) || 1,
          isActive: form.isActive,
          baseStats: form.baseStats,
          unlockRule,
          ...(form.classId ? { class: form.classId } : {}),
        };
      }
      await onSave(payload, form._id || undefined);
    } catch {
      // erro tratado no hook
    } finally {
      setSaving(false);
      if (portraitPreview.startsWith('blob:')) URL.revokeObjectURL(portraitPreview);
      if (artworkPreview.startsWith('blob:')) URL.revokeObjectURL(artworkPreview);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={form._id ? 'Editar Personagem Jogável' : 'Novo Personagem Jogável'}
      icon={<FaUserAstronaut />}
      size={MODAL_SIZES.XLARGE}
      closeOnOverlayClick={!saving}
    >
      <form onSubmit={handleSubmit}>
        <Modal.Body columns={COLUMN_LAYOUTS.DOUBLE}>
          <div className={styles.column}>
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Identidade</h3>
              <div className={styles.field}>
                <label>Nome</label>
                <TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required disabled={saving} />
              </div>
              <div className={styles.field}>
                <label>Descrição</label>
                <TextArea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} disabled={saving} />
              </div>
            </div>

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Características</h3>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label>Classe</label>
                  <Select
                    value={form.classId}
                    onChange={(val) => setForm({ ...form, classId: val })}
                    options={[{ value: '', label: 'Sem classe' }, ...classes.map((c) => ({ value: c._id, label: c.name }))]}
                    disabled={saving}
                  />
                </div>
                <div className={styles.field}>
                  <label>Gênero</label>
                  <Select value={form.gender} onChange={(val) => setForm({ ...form, gender: val })} options={GENDERS} disabled={saving} />
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label>Raridade</label>
                  <Select value={form.rarity} onChange={(val) => setForm({ ...form, rarity: val })} options={RARITIES} disabled={saving} />
                </div>
                <div className={styles.field}>
                  <label>Desbloqueio</label>
                  <Select value={form.unlockType} onChange={(val) => setForm({ ...form, unlockType: val })} options={UNLOCK_TYPES} disabled={saving} />
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label>Nível base</label>
                  <TextInput type="number" min={1} value={form.baseLevel} onChange={(e) => setForm({ ...form, baseLevel: Math.max(1, +e.target.value) })} disabled={saving} />
                </div>
                <div className={styles.field}>
                  <label>Ativo</label>
                  <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} disabled={saving} />
                </div>
              </div>
            </div>

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Arte</h3>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label>Retrato (thumbnail)</label>
                  <PhotoInput file={portraitFile} previewUrl={portraitPreview} onFileChange={onPortrait} onRemove={() => onPortrait(null)} accept="image/*" disabled={saving} />
                </div>
                <div className={styles.field}>
                  <label>Ilustração (detalhe)</label>
                  <PhotoInput file={artworkFile} previewUrl={artworkPreview} onFileChange={onArtwork} onRemove={() => onArtwork(null)} accept="image/*" disabled={saving} />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.column}>
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Atributos Base (nível 1)</h3>
              <div className={styles.statsGrid}>
                {(baseStatus || []).map((s) => (
                  <div key={s.nome} className={styles.statControl}>
                    <label>{s.label || s.nome}</label>
                    <TextInput
                      type="number"
                      min={0}
                      value={form.baseStats[s.nome] ?? 0}
                      onChange={(e) => handleStat(s.nome, e.target.value)}
                      disabled={saving}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer alignment="between">
          <Button type="button" onClick={onClose} variant="secondary" disabled={saving}>Cancelar</Button>
          <Button type="submit" backgroundColor="var(--maroon)" textColor="var(--light)" hoverColor="var(--gold)" disabled={saving}>
            {saving ? 'Salvando…' : 'Salvar'}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
