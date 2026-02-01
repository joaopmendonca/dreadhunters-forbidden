import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { FaTrash, FaBullseye, FaBoxOpen, FaCoins } from 'react-icons/fa';
import Modal, { MODAL_SIZES, COLUMN_LAYOUTS } from '../../../shared/components/Modal';
import TextInput from '../../../shared/components/TextInput';
import TextArea from '../../../shared/components/TextArea';
import Select from '../../../shared/components/Select';
import PhotoInput from '../../../shared/components/PhotoInput';
import Button from '../../../shared/components/Button';
import ConfirmationModal from '../../../shared/components/ConfirmationModal';
import { TYPE_OPTIONS, OBJECTIVE_TYPE_OPTIONS, MESSAGES } from '../constants';
import { toPrimitive } from '../utils';
import styles from '../styles/QuestModal.module.css';

const emptyObjective = { description: '', type: 'kill', targetId: '', quantity: 1 };
const emptyRewardItem = { itemId: '', quantity: 1 };
const emptyRewardCurrency = { currencyId: '', amount: 0 };

export default function QuestModal({
  isOpen,
  onClose,
  onSave,
  onIconDeleted,
  initialData = {},
  quests = [],
  items = [],
  enemies = [],
  npcs = [],
  locations = [],
  currencies = []
}) {
  const { enqueueSnackbar } = useSnackbar();

  const [form, setForm] = useState({
    _id: '',
    title: '',
    description: '',
    type: 'side',
    locationId: '',
    prerequisites: [],
    objectives: [],
    rewards: { xp: 0, items: [], currencies: [] },
    iconUrl: ''
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
      title: initialData.title || '',
      description: initialData.description || '',
      type: initialData.type || 'side',
      locationId: initialData.location?._id || initialData.locationId || '',
      prerequisites: (initialData.prerequisites || []).map(p =>
        typeof p === 'object' ? p._id : p
      ),
      objectives: initialData.objectives || [],
      rewards: {
        xp: initialData.rewards?.xp || 0,
        items: (initialData.rewards?.items || []).map(r => ({
          itemId: typeof r.itemId === 'object' ? r.itemId._id : r.itemId,
          quantity: r.quantity
        })),
        currencies: (initialData.rewards?.currencies || []).map(r => ({
          currencyId: typeof r.currencyId === 'object' ? r.currencyId._id : r.currencyId,
          amount: r.amount
        }))
      },
      iconUrl: initialData.iconUrl || ''
    });
    setPreviewUrl(initialData.iconUrl || '');
    setIconFile(null);
  }, [isOpen, initialData]);

  const changeField = (field, value) => {
    const val = toPrimitive(value);
    setForm(f => ({ ...f, [field]: val }));
  };

  const changeNested = (section, idx, key, value) => {
    const val = toPrimitive(value);
    setForm(f => {
      const next = { ...f };
      if (section === 'objectives') {
        next.objectives = f.objectives.map((o, i) => i === idx ? { ...o, [key]: val } : o);
      } else if (section === 'items') {
        next.rewards = {
          ...f.rewards,
          items: f.rewards.items.map((item, i) => i === idx ? { ...item, [key]: val } : item)
        };
      } else if (section === 'currencies') {
        next.rewards = {
          ...f.rewards,
          currencies: f.rewards.currencies.map((curr, i) => i === idx ? { ...curr, [key]: val } : curr)
        };
      }
      return next;
    });
  };

  const addRow = section => {
    setForm(f => {
      const next = { ...f };
      if (section === 'objectives') {
        next.objectives = [...f.objectives, { ...emptyObjective }];
      } else if (section === 'items') {
        next.rewards = { ...f.rewards, items: [...f.rewards.items, { ...emptyRewardItem }] };
      } else if (section === 'currencies') {
        next.rewards = { ...f.rewards, currencies: [...f.rewards.currencies, { ...emptyRewardCurrency }] };
      }
      return next;
    });
  };

  const removeRow = (section, idx) => {
    setForm(f => {
      const next = { ...f };
      if (section === 'objectives') {
        next.objectives = f.objectives.filter((_, i) => i !== idx);
      } else if (section === 'items') {
        next.rewards = { ...f.rewards, items: f.rewards.items.filter((_, i) => i !== idx) };
      } else if (section === 'currencies') {
        next.rewards = { ...f.rewards, currencies: f.rewards.currencies.filter((_, i) => i !== idx) };
      }
      return next;
    });
  };

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
      await onIconDeleted(form._id);
      setPreviewUrl('');
      changeField('iconUrl', '');
    } catch {
      enqueueSnackbar(MESSAGES.ICON_DELETE_ERROR, { variant: 'error' });
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!form.title.trim()) {
      enqueueSnackbar(MESSAGES.VALIDATION_TITLE, { variant: 'warning' });
      return;
    }

    setSaving(true);
    try {
      const fd = new FormData();
      if (form._id) fd.append('_id', form._id);
      fd.append('title', form.title);
      fd.append('description', form.description);
      fd.append('type', form.type);
      if (form.locationId) fd.append('locationId', form.locationId);
      fd.append('prerequisites', JSON.stringify(form.prerequisites));
      fd.append(
        'objectives',
        JSON.stringify(form.objectives.filter(o => o.description && o.targetId))
      );
      fd.append('rewards', JSON.stringify(form.rewards));
      if (iconFile) fd.append('icon', iconFile);

      await onSave(fd, form._id);
      onClose();
    } catch {
      // Erro já tratado no hook
    } finally {
      setSaving(false);
    }
  };

  const questOptions = [{ value: '', label: 'Selecione…' }, ...quests.filter(q => q._id !== form._id).map(q => ({ value: q._id, label: q.title }))];
  const itemOptions = [{ value: '', label: 'Selecione…' }, ...items.map(i => ({ value: i._id, label: i.name }))];
  const enemyOptions = [{ value: '', label: 'Selecione…' }, ...enemies.map(e => ({ value: e._id, label: e.name }))];
  const npcOptions = [{ value: '', label: 'Selecione…' }, ...npcs.map(n => ({ value: n._id, label: n.name }))];
  const locationOptions = [{ value: '', label: 'Selecione…' }, ...locations.map(l => ({ value: l._id, label: l.name }))];
  const currencyOptions = [{ value: '', label: 'Selecione…' }, ...currencies.map(c => ({ value: c._id, label: `${c.name} (${c.symbol || ''})` }))];

  const getTargetOptions = type => {
    switch (type) {
      case 'kill': return enemyOptions;
      case 'collect': return itemOptions;
      case 'talk': return npcOptions;
      case 'visit': return locationOptions;
      default: return [];
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
        title={form._id ? 'Editar Quest' : 'Nova Quest'}
        size={MODAL_SIZES.XLARGE}
        closeOnOverlayClick
      >
        <form onSubmit={handleSubmit}>
          <Modal.Body columns={COLUMN_LAYOUTS.DOUBLE}>
            {/* Coluna Esquerda */}
            <div className={styles.column}>
              {/* Informações Básicas */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Informações Básicas</h3>
                <div className={styles.field}>
                  <label>Título</label>
                  <TextInput
                    value={form.title}
                    onChange={e => changeField('title', e.target.value)}
                    placeholder="Título da quest"
                    required
                    disabled={saving}
                  />
                </div>
                <div className={styles.field}>
                  <label>Descrição</label>
                  <TextArea
                    value={form.description}
                    onChange={e => changeField('description', e.target.value)}
                    placeholder="Descrição da quest"
                    rows={3}
                    disabled={saving}
                  />
                </div>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label>Tipo</label>
                    <Select
                      options={TYPE_OPTIONS}
                      value={form.type}
                      onChange={val => changeField('type', val)}
                      disabled={saving}
                    />
                  </div>
                  <div className={styles.field}>
                    <label>Local</label>
                    <Select
                      options={locationOptions}
                      value={form.locationId}
                      onChange={val => changeField('locationId', val)}
                      disabled={saving}
                    />
                  </div>
                </div>
              </div>

              {/* Ícone */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Ícone</h3>
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

              {/* Pré-requisitos */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Pré-requisitos</h3>
                <div className={styles.field}>
                  <label>Quests Necessárias</label>
                  <div className={styles.checkboxGroup}>
                    {questOptions.slice(1).map(opt => (
                      <label key={opt.value} className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={form.prerequisites.includes(opt.value)}
                          onChange={e => {
                            if (e.target.checked) {
                              changeField('prerequisites', [...form.prerequisites, opt.value]);
                            } else {
                              changeField('prerequisites', form.prerequisites.filter(id => id !== opt.value));
                            }
                          }}
                          disabled={saving}
                        />
                        <span>{opt.label}</span>
                      </label>
                    ))}
                    {questOptions.length === 1 && <p className={styles.emptyText}>Nenhuma quest disponível</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Coluna Direita */}
            <div className={styles.column}>
              {/* Objetivos */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>
                  Objetivos
                  <Button 
                    type="button"
                    icon={<FaBullseye />} 
                    onClick={() => addRow('objectives')} 
                    disabled={saving} 
                    backgroundColor="var(--maroon)" 
                    textColor="#fff" 
                    hoverColor="#a00030"
                  >
                    Adicionar
                  </Button>
                </h3>
                {form.objectives.length === 0 ? (
                  <p className={styles.emptyText}>Nenhum objetivo configurado</p>
                ) : (
                  form.objectives.map((obj, idx) => (
                    <div key={idx} className={styles.objectiveRow}>
                      <div className={styles.field}>
                        <label>Descrição</label>
                        <TextInput
                          value={obj.description}
                          onChange={e => changeNested('objectives', idx, 'description', e.target.value)}
                          placeholder="Ex: Derrote 10 goblins"
                          disabled={saving}
                        />
                      </div>
                      <div className={styles.row}>
                        <div className={styles.field}>
                          <label>Tipo</label>
                          <Select
                            options={OBJECTIVE_TYPE_OPTIONS}
                            value={obj.type}
                            onChange={val => {
                              changeNested('objectives', idx, 'type', val);
                              changeNested('objectives', idx, 'targetId', '');
                            }}
                            disabled={saving}
                          />
                        </div>
                        <div className={styles.field}>
                          <label>Alvo</label>
                          <Select
                            options={getTargetOptions(obj.type)}
                            value={obj.targetId}
                            onChange={val => changeNested('objectives', idx, 'targetId', val)}
                            disabled={saving}
                          />
                        </div>
                        <div className={styles.field}>
                          <label>Qtd</label>
                          <TextInput
                            type="number"
                            min={1}
                            value={obj.quantity}
                            onChange={e => changeNested('objectives', idx, 'quantity', +e.target.value)}
                            disabled={saving}
                          />
                        </div>
                      </div>
                      <Button
                        icon={<FaTrash />}
                        onClick={() => removeRow('objectives', idx)}
                        disabled={saving}
                        backgroundColor="transparent"
                        textColor="#d92828"
                        hoverColor="var(--dark-4)"
                      />
                    </div>
                  ))
                )}
              </div>

              {/* Recompensas */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Recompensas</h3>
                <div className={styles.field}>
                  <label>XP</label>
                  <TextInput
                    type="number"
                    min={0}
                    value={form.rewards.xp}
                    onChange={e => changeField('rewards', { ...form.rewards, xp: +e.target.value })}
                    disabled={saving}
                  />
                </div>

                {/* Itens */}
                <div className={styles.subSection}>
                  <h4 className={styles.subSectionTitle}>
                    Itens
                    <Button 
                      type="button"
                      icon={<FaBoxOpen />} 
                      onClick={() => addRow('items')} 
                      disabled={saving} 
                      backgroundColor="var(--maroon)" 
                      textColor="#fff" 
                      hoverColor="#a00030"
                    >
                      Adicionar
                    </Button>
                  </h4>
                  {form.rewards.items.map((item, idx) => (
                    <div key={idx} className={styles.rewardRow}>
                      <Select
                        options={itemOptions}
                        value={item.itemId}
                        onChange={val => changeNested('items', idx, 'itemId', val)}
                        disabled={saving}
                      />
                      <TextInput
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={e => changeNested('items', idx, 'quantity', +e.target.value)}
                        placeholder="Qtd"
                        disabled={saving}
                      />
                      <Button icon={<FaTrash />} onClick={() => removeRow('items', idx)} disabled={saving} backgroundColor="transparent" textColor="#d92828" hoverColor="var(--dark-4)" />
                    </div>
                  ))}
                </div>

                {/* Moedas */}
                <div className={styles.subSection}>
                  <h4 className={styles.subSectionTitle}>
                    Moedas
                    <Button 
                      type="button"
                      icon={<FaCoins />} 
                      onClick={() => addRow('currencies')} 
                      disabled={saving} 
                      backgroundColor="var(--maroon)" 
                      textColor="#fff" 
                      hoverColor="#a00030"
                    >
                      Adicionar
                    </Button>
                  </h4>
                  {form.rewards.currencies.map((curr, idx) => (
                    <div key={idx} className={styles.rewardRow}>
                      <Select
                        options={currencyOptions}
                        value={curr.currencyId}
                        onChange={val => changeNested('currencies', idx, 'currencyId', val)}
                        disabled={saving}
                      />
                      <TextInput
                        type="number"
                        min={0}
                        value={curr.amount}
                        onChange={e => changeNested('currencies', idx, 'amount', +e.target.value)}
                        placeholder="Qtd"
                        disabled={saving}
                      />
                      <Button icon={<FaTrash />} onClick={() => removeRow('currencies', idx)} disabled={saving} backgroundColor="transparent" textColor="#d92828" hoverColor="var(--dark-4)" />
                    </div>
                  ))}
                </div>
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
