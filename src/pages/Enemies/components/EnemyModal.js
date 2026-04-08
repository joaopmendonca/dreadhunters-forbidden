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
  const { baseStatus, derivedStatus, normalizeStats } = useStatus();
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
    artworkUrl: '',
    experienceReward: 0
  });

  const [iconFile, setIconFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Calcula pontos máximos baseado no tipo e nível
  const enemyType = form.type || 'normal';
  const enemyLevel = form.level || 1;
  const typeKey = `enemyTypeMultiplier${enemyType.charAt(0).toUpperCase()}${enemyType.slice(1)}`;
  const maxPoints = serverConfig
    ? Math.floor(
        (serverConfig.enemyInitialStatPoints + serverConfig.enemyStatPointsPerLevel * (enemyLevel - 1))
        * (serverConfig[typeKey] ?? TYPE_MULTIPLIERS[enemyType])
      )
    : 6;

  const usedPoints = baseStatus.reduce((sum, status) => {
    const value = Number(form.stats[status.nome]) || 0;
    return sum + value;
  }, 0);

  const remainingPoints = maxPoints - usedPoints;

  // Calcula os stats derivados baseado nos stats base e level
  const calculateDerivedStats = () => {
    const stats = form.stats;
    const level = form.level || 1;
    
    const str = Number(stats.str) || 0;
    const dex = Number(stats.dex) || 0;
    const con = Number(stats.con) || 0;
    const int = Number(stats.int) || 0;
    const wis = Number(stats.wis) || 0;
    const luk = Number(stats.luk) || 0;

    return {
      // Pontos de Vida e Energia
      max_hp: Math.floor((con * 8) + (level * 4.5)),
      max_sp: Math.floor((wis * 5) + (level * 2)),
      max_cp: Math.floor((con * 6) + (level * 3.5)),
      hp_regen: ((con * 0.1) + (level * 0.05)).toFixed(2),
      sp_regen: ((wis * 0.15) + (level * 0.03)).toFixed(2),
      cp_regen: (con * 0.08).toFixed(2),
      // Poder Ofensivo
      p_atk: Math.floor((str * 1.2) + (level * 0.8)),
      m_atk: Math.floor((int * 1.5) + (wis * 0.5) + (level * 0.7)),
      crit_rate: ((dex * 0.3) + 10).toFixed(1),
      crit_dmg: Math.floor((str * 0.2) + 100),
      m_crit_rate: ((luk * 0.4) + 5).toFixed(1),
      // Poder Defensivo
      p_def: Math.floor((con * 1.5) + (dex * 0.3) + (level * 0.5)),
      m_def: Math.floor((wis * 1.3) + (int * 0.4) + (level * 0.4)),
      evasion: ((dex * 0.5) + (luk * 0.3)).toFixed(1)
    };
  };

  const derivedStats = calculateDerivedStats();

  // Labels para os stats derivados
  const derivedLabels = {
    max_hp: 'HP Máximo',
    max_sp: 'SP Máximo', 
    max_cp: 'CP Máximo',
    hp_regen: 'Regen HP',
    sp_regen: 'Regen SP',
    cp_regen: 'Regen CP',
    p_atk: 'Ataque Físico',
    m_atk: 'Ataque Mágico',
    crit_rate: 'Taxa Crítico',
    crit_dmg: 'Dano Crítico',
    m_crit_rate: 'Crit. Mágico',
    p_def: 'Defesa Física',
    m_def: 'Defesa Mágica',
    evasion: 'Evasão'
  };

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
      artworkUrl: initialData.artworkUrl || '',
      stats: initStats(),
      loot: Array.isArray(initialData.lootTable) 
        ? initialData.lootTable.map(l => ({
            item: l.itemId?._id || l.itemId,
            dropChance: l.dropRate || 0,
            minQuantity: l.minQty || 1,
            maxQuantity: l.maxQty || 1
          }))
        : [],
      currencyLoot: Array.isArray(initialData.currencyLoot)
        ? initialData.currencyLoot.map(c => ({
            currency: c.currencyId?._id || c.currencyId,
            minAmount: c.minQty || 0,
            maxAmount: c.maxQty || 0
          }))
        : [],
      iconUrl: initialData.iconUrl || '',
      experienceReward: initialData.xpReward || 0
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
      fd.append('xpReward', form.experienceReward);
      if (form.artworkUrl) fd.append('artworkUrl', form.artworkUrl);

      if (form.loot.length > 0) {
        // Mapear para os campos esperados pelo backend
        const lootData = form.loot.map(l => ({
          itemId: l.item,
          dropRate: l.dropChance,
          minQty: l.minQuantity,
          maxQty: l.maxQuantity
        }));
        fd.append('lootTable', JSON.stringify(lootData));
      }
      if (form.currencyLoot.length > 0) {
        // Mapear para os campos esperados pelo backend
        const currencyData = form.currencyLoot.map(c => ({
          currencyId: c.currency,
          minQty: c.minAmount,
          maxQty: c.maxAmount
        }));
        fd.append('currencyLoot', JSON.stringify(currencyData));
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
              {/* Pontos Restantes */}
              <div className={styles.pointsInfo}>
                ⚔ Pontos Restantes: <strong>{remainingPoints}</strong> / {maxPoints}
              </div>

              {/* Atributos Base */}
              <fieldset className={styles.fieldset}>
                <legend>Atributos Base</legend>
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
              </fieldset>

              {/* Atributos Derivados (Calculados) */}
              <fieldset className={styles.fieldset}>
                <legend>Atributos Derivados</legend>
                <div className={styles.derivedGrid}>
                  {Object.entries(derivedStats).map(([key, value]) => (
                    <div key={key} className={styles.derivedStat}>
                      <span className={styles.derivedLabel}>{derivedLabels[key]}</span>
                      <span className={styles.derivedValue}>{value}</span>
                    </div>
                  ))}
                </div>
              </fieldset>
            </div>
          </Modal.Body>

          {/* Seção Loot (Full Width) */}
          <Modal.Body columns={COLUMN_LAYOUTS.SINGLE}>
            <div className={styles.lootContainer}>
              <fieldset className={styles.fieldset}>
                <legend>Loot de Itens</legend>
                <div className={styles.lootHeader}>
                  <span className={styles.lootTitle}>Itens que podem ser dropados</span>
                  <button type="button" className={styles.addButton} onClick={addLootItem} disabled={saving}>
                    <FaPlus /> Adicionar
                  </button>
                </div>
                {form.loot.length === 0 ? (
                  <p className={styles.emptyText}>Nenhum item configurado</p>
                ) : (
                  <>
                    <div className={styles.lootLabels}>
                      <span>Item</span>
                      <span>% Drop</span>
                      <span>Qtd Min</span>
                      <span>Qtd Max</span>
                      <span></span>
                    </div>
                    {form.loot.map((loot, idx) => (
                      <div key={idx} className={styles.lootRow}>
                        <Select options={itemOptions} value={loot.item} onChange={val => changeLootItem(idx, 'item', val)} disabled={saving} />
                        <TextInput type="number" min={0} max={1} step={0.01} value={loot.dropChance} onChange={e => changeLootItem(idx, 'dropChance', +e.target.value)} disabled={saving} />
                        <TextInput type="number" min={1} value={loot.minQuantity} onChange={e => changeLootItem(idx, 'minQuantity', +e.target.value)} disabled={saving} />
                        <TextInput type="number" min={1} value={loot.maxQuantity} onChange={e => changeLootItem(idx, 'maxQuantity', +e.target.value)} disabled={saving} />
                        <IconButton icon={<FaTrash />} onClick={() => removeLootItem(idx)} disabled={saving} hoverColor="#d92828" />
                      </div>
                    ))}
                  </>
                )}
              </fieldset>

              <fieldset className={styles.fieldset}>
                <legend>Loot de Moedas</legend>
                <div className={styles.lootHeader}>
                  <span className={styles.lootTitle}>Moedas que podem ser dropadas</span>
                  <button type="button" className={styles.addButton} onClick={addCurrencyLoot} disabled={saving}>
                    <FaPlus /> Adicionar
                  </button>
                </div>
                {form.currencyLoot.length === 0 ? (
                  <p className={styles.emptyText}>Nenhuma moeda configurada</p>
                ) : (
                  <>
                    <div className={styles.lootLabels} style={{ gridTemplateColumns: '2fr 1fr 1fr auto' }}>
                      <span>Moeda</span>
                      <span>Qtd Min</span>
                      <span>Qtd Max</span>
                      <span></span>
                    </div>
                    {form.currencyLoot.map((curr, idx) => (
                      <div key={idx} className={styles.lootRow} style={{ gridTemplateColumns: '2fr 1fr 1fr auto' }}>
                        <Select options={currencyOptions} value={curr.currency} onChange={val => changeCurrencyLoot(idx, 'currency', val)} disabled={saving} />
                        <TextInput type="number" min={0} value={curr.minAmount} onChange={e => changeCurrencyLoot(idx, 'minAmount', +e.target.value)} disabled={saving} />
                        <TextInput type="number" min={0} value={curr.maxAmount} onChange={e => changeCurrencyLoot(idx, 'maxAmount', +e.target.value)} disabled={saving} />
                        <IconButton icon={<FaTrash />} onClick={() => removeCurrencyLoot(idx)} disabled={saving} hoverColor="#d92828" />
                      </div>
                    ))}
                  </>
                )}
              </fieldset>
            </div>
          </Modal.Body>

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
