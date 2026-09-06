import React, { useEffect, useState } from 'react';
import { FaUserAstronaut } from 'react-icons/fa';
import Modal, { MODAL_SIZES, COLUMN_LAYOUTS } from '../../../shared/components/Modal';
import Button from '../../../shared/components/Button';
import Select from '../../../shared/components/Select';
import TextArea from '../../../shared/components/TextArea';
import TextInput from '../../../shared/components/TextInput';
import PhotoInput from '../../../shared/components/PhotoInput';
import { UNLOCK_TYPES, GENDERS } from '../constants';
import { buildImgSrc } from '../utils';
import styles from '../styles/PlayableCharacters.module.css';

// Raridade sempre 'common' (back-end força) e atributos base vêm da CLASSE — por isso
// nem raridade nem stats aparecem aqui. Ver docs/prd-migracao-equipes.md [R14].
const emptyForm = {
  _id: '',
  name: '',
  description: '',
  classId: '',
  unlockType: 'starter',
  gender: 'male',
  baseLevel: 1,
  isActive: true,
  meleeWeapon: '',
  firearm: '',
  healingItem: '',
  healingItemQty: 1,
};

const idOf = (v) => (v && typeof v === 'object' ? v._id : v) || '';

export default function PlayableCharacterModal({ isOpen, onClose, onSave, initialData = null, classes = [], items = [] }) {
  const equipmentOptions = (items || [])
    .filter((i) => i.type === 'equipment')
    .map((i) => ({ value: i._id, label: i.name }));
  const consumableOptions = (items || [])
    .filter((i) => i.type === 'consumable')
    .map((i) => ({ value: i._id, label: i.name }));

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
    const classVal = typeof initialData.class === 'object' ? initialData.class?._id : initialData.class;
    const kit = initialData.startingKit || {};
    setForm({
      _id: initialData._id || '',
      name: initialData.name || '',
      description: initialData.description || '',
      classId: classVal || '',
      unlockType: initialData.unlockRule?.type || 'starter',
      gender: initialData.gender || 'male',
      baseLevel: initialData.baseLevel || 1,
      isActive: initialData.isActive !== false,
      meleeWeapon: idOf(kit.meleeWeapon),
      firearm: idOf(kit.firearm),
      healingItem: idOf(kit.healingItem),
      healingItemQty: kit.healingItemQty || 1,
    });
    setPortraitFile(null);
    setPortraitPreview(initialData.portraitUrl ? buildImgSrc(initialData.portraitUrl) : '');
    setArtworkFile(null);
    setArtworkPreview(initialData.artworkUrl ? buildImgSrc(initialData.artworkUrl) : '');
  }, [isOpen, initialData]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.classId) return; // classe é obrigatória (fonte dos atributos)
    setSaving(true);
    try {
      const unlockRule = { type: form.unlockType };
      const startingKit = {
        meleeWeapon: form.meleeWeapon || null,
        firearm: form.firearm || null,
        healingItem: form.healingItem || null,
        healingItemQty: Math.max(1, Number(form.healingItemQty) || 1),
      };
      let payload;
      if (portraitFile || artworkFile) {
        payload = new FormData();
        payload.append('name', form.name);
        payload.append('description', form.description || '');
        payload.append('class', form.classId);
        payload.append('gender', form.gender);
        payload.append('baseLevel', String(form.baseLevel));
        payload.append('isActive', String(form.isActive));
        payload.append('unlockRule', JSON.stringify(unlockRule));
        payload.append('startingKit', JSON.stringify(startingKit));
        if (portraitFile) payload.append('portrait', portraitFile);
        if (artworkFile) payload.append('artwork', artworkFile);
      } else {
        payload = {
          name: form.name,
          description: form.description || '',
          class: form.classId,
          gender: form.gender,
          baseLevel: Number(form.baseLevel) || 1,
          isActive: form.isActive,
          unlockRule,
          startingKit,
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
      size={MODAL_SIZES.LARGE}
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
              <div className={styles.field}>
                <label>Classe * <span style={{ opacity: 0.6, fontWeight: 400 }}>(fonte dos atributos base)</span></label>
                <Select
                  value={form.classId}
                  onChange={(val) => setForm({ ...form, classId: val })}
                  options={[{ value: '', label: 'Selecione a classe' }, ...classes.map((c) => ({ value: c._id, label: c.name }))]}
                  disabled={saving}
                />
              </div>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label>Gênero</label>
                  <Select value={form.gender} onChange={(val) => setForm({ ...form, gender: val })} options={GENDERS} disabled={saving} />
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
              <h3 className={styles.sectionTitle}>Kit Inicial</h3>
              <p style={{ fontSize: '0.78rem', opacity: 0.75, margin: 0 }}>
                Vai para o inventário da equipe ao confirmar o time.
              </p>
              <div className={styles.field}>
                <label>Arma branca</label>
                <Select
                  value={form.meleeWeapon}
                  onChange={(val) => setForm({ ...form, meleeWeapon: val })}
                  options={[{ value: '', label: '— nenhum —' }, ...equipmentOptions]}
                  disabled={saving}
                />
              </div>
              <div className={styles.field}>
                <label>Arma de fogo</label>
                <Select
                  value={form.firearm}
                  onChange={(val) => setForm({ ...form, firearm: val })}
                  options={[{ value: '', label: '— nenhum —' }, ...equipmentOptions]}
                  disabled={saving}
                />
              </div>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label>Item de cura</label>
                  <Select
                    value={form.healingItem}
                    onChange={(val) => setForm({ ...form, healingItem: val })}
                    options={[{ value: '', label: '— nenhum —' }, ...consumableOptions]}
                    disabled={saving}
                  />
                </div>
                <div className={styles.field}>
                  <label>Qtd.</label>
                  <TextInput
                    type="number"
                    min={1}
                    value={form.healingItemQty}
                    onChange={(e) => setForm({ ...form, healingItemQty: Math.max(1, +e.target.value) })}
                    disabled={saving}
                  />
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer alignment="between">
          <Button type="button" onClick={onClose} variant="secondary" disabled={saving}>Cancelar</Button>
          <Button type="submit" backgroundColor="var(--maroon)" textColor="var(--light)" hoverColor="var(--gold)" disabled={saving || !form.classId}>
            {saving ? 'Salvando…' : 'Salvar'}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
