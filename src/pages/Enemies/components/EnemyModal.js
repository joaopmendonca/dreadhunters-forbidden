import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import Modal, { MODAL_SIZES, COLUMN_LAYOUTS } from '../../../shared/components/Modal';
import TextInput from '../../../shared/components/TextInput';
import TextArea from '../../../shared/components/TextArea';
import Select from '../../../shared/components/Select';
import PhotoInput from '../../../shared/components/PhotoInput';
import Button from '../../../shared/components/Button';
import IconButton from '../../../shared/components/IconButton';
import ConfirmationModal from '../../../shared/components/ConfirmationModal';
import useStatus from '../../../shared/hooks/useStatus';
import useServerConfig from '../../../shared/hooks/useServerConfig';
import api from '../../../config/api';
import { TYPE_OPTIONS, TYPE_MULTIPLIERS, MESSAGES } from '../constants';
import styles from '../styles/EnemyModal.module.css';

export default function EnemyModal({ 
  isOpen, 
  onClose, 
  onSave, 
  onIconDeleted, 
  initialData = {},
  items = [],
  currencies = []
}) {
  const { enqueueSnackbar } = useSnackbar();
  const { baseStatus, normalizeStats } = useStatus();
  const { config: serverConfig } = useServerConfig();

  const [form, setForm] = useState({
    _id: '',
    name: '',
    description: '',
    type: 'normal',
    level: 1,
    stats: {},
    loot: [],
    currencyLoot: [],
    iconUrl: '',
    experienceReward: 0
  });

  const [iconFile, setIconFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Calcula pontos máximos baseado no tipo
  const maxPoints = serverConfig 
    ? Math.floor(serverConfig.initialStatPoints * TYPE_MULTIPLIERS[form.type || 'normal'])
    : 6;

  const usedPoints = baseStatus.reduce((sum, status) => {
    const value = Number(form.stats[status.nome]) || 0;
    return sum + value;
  }, 0);

  const remainingPoints = maxPoints - usedPoints;

  useEffect(() => {
    if (!isOpen) return;

    const initStats = () => {
      if (!baseStatus.length) return {};
      const stats = {};
      baseStatus.forEach(status => {
        stats[status.nome] = initialData.stats?.[status.nome] || 0;
      });
      return stats;
    };

    setForm({
      _id: initialData._id || '',
      name: initialData.name || '',
      description: initialData.description || '',
      type: initialData.type || 'normal',
      level: initialData.level || 1,
      stats: initStats(),
      loot: Array.isArray(initialData.loot) 
        ? initialData.loot.map(l => ({
            item: l.item?._id || l.item,
            dropChance: l.dropChance || 0,
            minQuantity: l.minQuantity || 1,
            maxQuantity: l.maxQuantity || 1
          }))
        : [],
      currencyLoot: Array.isArray(initialData.currencyLoot)
        ? initialData.currencyLoot.map(c => ({
            currency: c.currency?._id || c.currency,
            minAmount: c.minAmount || 0,
            maxAmount: c.maxAmount || 0
          }))
        : [],
      iconUrl: initialData.iconUrl || '',
      experienceReward: initialData.experienceReward || 0
    });
    setIconFile(null);
    setPreviewUrl(initialData.iconUrl || '');
  }, [initialData, isOpen, baseStatus]);

  const changeField = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const handleStatDelta = (statName, delta) => {
    const currentValue = Number(form.stats[statName]) || 0;
    const newValue = currentValue + delta;

    if (newValue < 0) return;
    if (newValue > (serverConfig?.maxStatValue || 24)) return;
    if (delta > 0 && remainingPoints < delta) return;

    setForm(prev => ({
      ...prev,
      stats: { ...prev.stats, [statName]: newValue }
    }));
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
      await api.delete(`/enemies/${form._id}/icon`);
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

    if (usedPoints !== maxPoints) {
      enqueueSnackbar(
        MESSAGES.VALIDATION_POINTS.replace('{max}', maxPoints).replace('{current}', usedPoints),
        { variant: 'warning' }
      );
      return;
    }

    setSaving(true);
    try {
      const fd = new FormData();
      if (form._id) fd.append('_id', form._id);
      fd.append('name', form.name);
      fd.append('description', form.description);
      fd.append('type', form.type);
      fd.append('level', form.level);
      fd.append('stats', JSON.stringify(normalizeStats(form.stats)));
      fd.append('experienceReward', form.experienceReward);

      if (form.loot.length > 0) {
        fd.append('loot', JSON.stringify(form.loot));
      }
      if (form.currencyLoot.length > 0) {
        fd.append('currencyLoot', JSON.stringify(form.currencyLoot));
      }

      if (iconFile) fd.append('icon', iconFile);

      await onSave(fd, form._id);
      onClose();
    } catch {
      // Error handled in hook
    } finally {
      setSaving(false);
    }
  };

  const addLootItem = () => {
    setForm(prev => ({
      ...prev,
      loot: [...prev.loot, { item: '', dropChance: 0, minQuantity: 1, maxQuantity: 1 }]
    }));
  };

  const removeLootItem = idx => {
    setForm(prev => ({
      ...prev,
      loot: prev.loot.filter((_, i) => i !== idx)
    }));
  };

  const changeLootItem = (idx, field, val) => {
    setForm(prev => ({
      ...prev,
      loot: prev.loot.map((l, i) => i === idx ? { ...l, [field]: val } : l)
    }));
  };

  const addCurrencyLoot = () => {
    setForm(prev => ({
      ...prev,
      currencyLoot: [...prev.currencyLoot, { currency: '', minAmount: 0, maxAmount: 0 }]
    }));
  };

  const removeCurrencyLoot = idx => {
    setForm(prev => ({
      ...prev,
      currencyLoot: prev.currencyLoot.filter((_, i) => i !== idx)
    }));
  };

  const changeCurrencyLoot = (idx, field, val) => {
    setForm(prev => ({
      ...prev,
      currencyLoot: prev.currencyLoot.map((c, i) => i === idx ? { ...c, [field]: val } : c)
    }));
  };

  const itemOptions = [{ value: '', label: 'Selecione um item' }, ...items.map(it => ({ value: it._id, label: it.name }))];
  const currencyOptions = [{ value: '', label: 'Selecione uma moeda' }, ...currencies.map(c => ({ value: c._id, label: c.name }))];

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
        title={form._id ? 'Editar Inimigo' : 'Novo Inimigo'}
        size={MODAL_SIZES.FULL}
        closeOnOverlayClick
      >
        <form onSubmit={handleSubmit}>
          <Modal.Body columns={COLUMN_LAYOUTS.DOUBLE}>
            {/* Coluna Esquerda */}
            <div className={styles.column}>
              {/* Identidade */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Identidade</h3>
                <div className={styles.field}>
                  <label>Nome</label>
                  <TextInput value={form.name} onChange={e => changeField('name', e.target.value)} placeholder="Nome do inimigo" required disabled={saving} />
                </div>
                <div className={styles.field}>
                  <label>Descrição</label>
                  <TextArea value={form.description} onChange={e => changeField('description', e.target.value)} placeholder="Descrição" rows={3} disabled={saving} />
                </div>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label>Tipo</label>
                    <Select options={TYPE_OPTIONS} value={form.type} onChange={val => changeField('type', val)} disabled={saving} />
                  </div>
                  <div className={styles.field}>
                    <label>Nível</label>
                    <TextInput type="number" min={1} value={form.level} onChange={e => changeField('level', +e.target.value)} disabled={saving} />
                  </div>
                </div>
              </div>

              {/* Visuais */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Visuais</h3>
                <div className={styles.field}>
                  <label>Ícone</label>
                  <PhotoInput file={iconFile} previewUrl={previewUrl} onFileChange={handleFileChange} onRemove={() => setConfirmOpen(true)} placeholderLabel="Escolher ícone" disabled={saving} />
                </div>
              </div>

              {/* Recompensas */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Recompensas</h3>
                <div className={styles.field}>
                  <label>XP</label>
                  <TextInput type="number" min={0} value={form.experienceReward} onChange={e => changeField('experienceReward', +e.target.value)} disabled={saving} />
                </div>
              </div>
            </div>

            {/* Coluna Direita */}
            <div className={styles.column}>
              {/* Atributos */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Atributos</h3>
                <div className={styles.pointsInfo}>
                  ⚔ Pontos Restantes: <strong>{remainingPoints}</strong> / {maxPoints}
                </div>
                <div className={styles.statsGrid}>
                  {baseStatus.map(status => {
                    const value = Number(form.stats[status.nome]) || 0;
                    return (
                      <div key={status.nome} className={styles.statControl}>
                        <div className={styles.statHeader}>
                          <span className={styles.statLabel}>
                            {status.iconeUrl && (
                              <img src={status.iconeUrl} alt={status.label} className={styles.statIcon} />
                            )}
                            {status.label}
                          </span>
                          <span className={styles.statValue}>{value}</span>
                        </div>
                        <div className={styles.statButtons}>
                          <IconButton icon={<FaMinus />} onClick={() => handleStatDelta(status.nome, -1)} disabled={saving || value <= 0} hoverColor="var(--dark-2)" />
                          <IconButton icon={<FaPlus />} onClick={() => handleStatDelta(status.nome, +1)} disabled={saving || remainingPoints <= 0 || value >= (serverConfig?.maxStatValue || 24)} hoverColor="var(--dark-2)" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Modal.Body>

          {/* Seção Loot (Full Width) */}
          <div className={styles.lootSection}>
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>
                Loot de Itens
                <IconButton icon={<FaPlus />} onClick={addLootItem} disabled={saving} hoverColor="var(--gold)" />
              </h3>
              {form.loot.length === 0 ? (
                <p style={{ opacity: 0.5 }}>Nenhum item configurado</p>
              ) : (
                form.loot.map((loot, idx) => (
                  <div key={idx} className={styles.lootRow}>
                    <Select options={itemOptions} value={loot.item} onChange={val => changeLootItem(idx, 'item', val)} disabled={saving} />
                    <TextInput type="number" min={0} max={1} step={0.01} value={loot.dropChance} onChange={e => changeLootItem(idx, 'dropChance', +e.target.value)} placeholder="% Drop" disabled={saving} />
                    <TextInput type="number" min={1} value={loot.minQuantity} onChange={e => changeLootItem(idx, 'minQuantity', +e.target.value)} placeholder="Qtd Min" disabled={saving} />
                    <TextInput type="number" min={1} value={loot.maxQuantity} onChange={e => changeLootItem(idx, 'maxQuantity', +e.target.value)} placeholder="Qtd Max" disabled={saving} />
                    <IconButton icon={<FaTrash />} onClick={() => removeLootItem(idx)} disabled={saving} hoverColor="#d92828" />
                  </div>
                ))
              )}
            </div>

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>
                Loot de Moedas
                <IconButton icon={<FaPlus />} onClick={addCurrencyLoot} disabled={saving} hoverColor="var(--gold)" />
              </h3>
              {form.currencyLoot.length === 0 ? (
                <p style={{ opacity: 0.5 }}>Nenhuma moeda configurada</p>
              ) : (
                form.currencyLoot.map((curr, idx) => (
                  <div key={idx} className={styles.lootRow}>
                    <Select options={currencyOptions} value={curr.currency} onChange={val => changeCurrencyLoot(idx, 'currency', val)} disabled={saving} />
                    <TextInput type="number" min={0} value={curr.minAmount} onChange={e => changeCurrencyLoot(idx, 'minAmount', +e.target.value)} placeholder="Qtd Min" disabled={saving} />
                    <TextInput type="number" min={0} value={curr.maxAmount} onChange={e => changeCurrencyLoot(idx, 'maxAmount', +e.target.value)} placeholder="Qtd Max" disabled={saving} />
                    <IconButton icon={<FaTrash />} onClick={() => removeCurrencyLoot(idx)} disabled={saving} hoverColor="#d92828" />
                  </div>
                ))
              )}
            </div>
          </div>

          <Modal.Footer alignment="between">
            <Button backgroundColor="var(--dark-3)" textColor="var(--light)" hoverColor="var(--gold)" onClick={onClose} disabled={saving}>
              Cancelar
            </Button>
            <Button type="submit" backgroundColor="var(--maroon)" textColor="#fff" hoverColor="#a00030" disabled={saving}>
              {saving ? 'Salvando…' : 'Salvar'}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}
