import React, { useEffect, useMemo, useState } from 'react';
import { FaUserAstronaut } from 'react-icons/fa';
import Modal, { MODAL_SIZES, COLUMN_LAYOUTS } from '../../../shared/components/Modal';
import Button from '../../../shared/components/Button';
import Select from '../../../shared/components/Select';
import TextArea from '../../../shared/components/TextArea';
import TextInput from '../../../shared/components/TextInput';
import PhotoInput from '../../../shared/components/PhotoInput';
import StatsRadarChart from '../../../shared/components/StatsRadarChart';
import useStatus from '../../../shared/hooks/useStatus';
import ItemPicker from './ItemPicker';
import { UNLOCK_TYPES, GENDERS } from '../constants';
import { buildImgSrc } from '../utils';
import styles from '../styles/PlayableCharacters.module.css';

// Raridade sempre 'common' (back-end força) e atributos base vêm da CLASSE — por isso
// nem raridade nem stats aparecem aqui. Ver docs/prd-migracao-equipes.md [R14].
const emptyForm = {
  _id: '',
  name: '',
  description: '',
  history: '',
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
const mapToObj = (m) => (m instanceof Map ? Object.fromEntries(m) : m || {});

// Radar dos atributos base da classe — mesma construção da tela de Classes
// (StatsRadarChart + useStatus), só que somente leitura aqui.
function ClassStatsPreview({ cls, baseStatus }) {
  if (!cls) {
    return <p className={styles.hint}>Selecione uma classe para ver os atributos iniciais.</p>;
  }
  const distribution = mapToObj(cls.baseStats);
  const hasAnyStat = baseStatus.some((s) => Number(distribution[s.nome]) > 0);

  return (
    <div className={styles.statPreview}>
      <div className={styles.statPreviewHead}>
        Atributos iniciais — <strong>{cls.name}</strong>
        <span className={styles.statPreviewNote}>somente leitura · vêm da classe</span>
      </div>
      {hasAnyStat ? (
        <StatsRadarChart
          statsDistribution={distribution}
          baseStatus={baseStatus}
          isPercentage={false}
          height={200}
          color="#d4af37"
        />
      ) : (
        <p className={styles.hint}>Esta classe ainda não tem atributos base configurados.</p>
      )}
    </div>
  );
}

export default function PlayableCharacterModal({ isOpen, onClose, onSave, initialData = null, classes = [], items = [] }) {
  const equipmentItems = (items || []).filter((i) => i.type === 'equipment');
  const consumableItems = (items || []).filter((i) => i.type === 'consumable');
  const { baseStatus } = useStatus();

  const [form, setForm] = useState(emptyForm);
  const [portraitFile, setPortraitFile] = useState(null);
  const [portraitPreview, setPortraitPreview] = useState('');
  const [artworkFile, setArtworkFile] = useState(null);
  const [artworkPreview, setArtworkPreview] = useState('');
  const [saving, setSaving] = useState(false);

  const selectedClass = useMemo(
    () => classes.find((c) => String(c._id) === String(form.classId)) || null,
    [classes, form.classId]
  );

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
      history: initialData.history || '',
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
        payload.append('history', form.history || '');
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
          history: form.history || '',
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
      size={MODAL_SIZES.XLARGE}
      closeOnOverlayClick={!saving}
    >
      <form onSubmit={handleSubmit}>
        <Modal.Body columns={COLUMN_LAYOUTS.DOUBLE}>
          {/* ───────── Coluna 1 — Ficha ───────── */}
          <div className={styles.column}>
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Identidade</h3>
              <div className={styles.field}>
                <label>Nome</label>
                <TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ex.: Bermond" required disabled={saving} />
              </div>
              <div className={styles.field}>
                <label>Descrição</label>
                <TextArea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Como este personagem é apresentado ao jogador." disabled={saving} />
              </div>
              <div className={styles.field}>
                <label>História <span className={styles.optional}>(opcional)</span></label>
                <TextArea value={form.history} onChange={(e) => setForm({ ...form, history: e.target.value })} rows={4} placeholder="Lore / background do personagem." disabled={saving} />
              </div>
            </section>

            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Classe &amp; atributos</h3>
              <div className={styles.emphasisBox}>
                <div className={styles.field}>
                  <label>Classe <span className={styles.req}>*</span></label>
                  <Select
                    value={form.classId}
                    onChange={(val) => setForm({ ...form, classId: val })}
                    options={[{ value: '', label: 'Selecione a classe' }, ...classes.map((c) => ({ value: c._id, label: c.name }))]}
                    disabled={saving}
                  />
                </div>
                <p className={styles.hint}>
                  Os atributos base vêm da classe. O jogador distribui os pontos iniciais ao adicionar o personagem à equipe.
                </p>
                <ClassStatsPreview cls={selectedClass} baseStatus={baseStatus || []} />
              </div>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label>Nível base</label>
                  <TextInput type="number" min={1} value={form.baseLevel} onChange={(e) => setForm({ ...form, baseLevel: Math.max(1, +e.target.value) })} disabled={saving} />
                </div>
                <div className={styles.field}>
                  <label>Gênero</label>
                  <Select value={form.gender} onChange={(val) => setForm({ ...form, gender: val })} options={GENDERS} disabled={saving} />
                </div>
              </div>
            </section>

            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Disponibilidade</h3>
              <div className={styles.field}>
                <label>Desbloqueio</label>
                <Select value={form.unlockType} onChange={(val) => setForm({ ...form, unlockType: val })} options={UNLOCK_TYPES} disabled={saving} />
              </div>
              <label className={styles.toggleRow}>
                <span>
                  Ativo
                  <span className={styles.toggleHint}>{form.isActive ? 'recrutável no jogo' : 'oculto para os jogadores'}</span>
                </span>
                <input type="checkbox" className={styles.switch} checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} disabled={saving} />
              </label>
            </section>
          </div>

          {/* ───────── Coluna 2 — Apresentação &amp; kit ───────── */}
          <div className={styles.column}>
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Arte</h3>
              <div className={styles.artRow}>
                <div className={styles.field}>
                  <label>Retrato</label>
                  <PhotoInput file={portraitFile} previewUrl={portraitPreview} onFileChange={onPortrait} onRemove={() => onPortrait(null)} accept="image/*" disabled={saving} />
                  <span className={styles.hint}>Miniatura em listas e formação.</span>
                </div>
                <div className={styles.field}>
                  <label>Ilustração</label>
                  <PhotoInput file={artworkFile} previewUrl={artworkPreview} onFileChange={onArtwork} onRemove={() => onArtwork(null)} accept="image/*" disabled={saving} />
                  <span className={styles.hint}>Tela de detalhe do personagem.</span>
                </div>
              </div>
            </section>

            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Kit inicial</h3>
              <p className={styles.hint}>Somado ao inventário da equipe quando o time é criado.</p>
              <div className={styles.field}>
                <label>Arma branca</label>
                <ItemPicker value={form.meleeWeapon} items={equipmentItems} onChange={(val) => setForm({ ...form, meleeWeapon: val })} disabled={saving} />
              </div>
              <div className={styles.field}>
                <label>Arma de fogo</label>
                <ItemPicker value={form.firearm} items={equipmentItems} onChange={(val) => setForm({ ...form, firearm: val })} disabled={saving} />
              </div>
              <div className={styles.field}>
                <label>Item de cura</label>
                <div className={styles.kitHealRow}>
                  <ItemPicker value={form.healingItem} items={consumableItems} onChange={(val) => setForm({ ...form, healingItem: val })} disabled={saving} />
                  <div className={styles.qtyField}>
                    <span>Qtd.</span>
                    <TextInput type="number" min={1} value={form.healingItemQty} onChange={(e) => setForm({ ...form, healingItemQty: Math.max(1, +e.target.value) })} disabled={saving} />
                  </div>
                </div>
              </div>
            </section>
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
