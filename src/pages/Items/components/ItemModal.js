import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { FaTrash, FaPlus } from 'react-icons/fa';
import Modal, { MODAL_SIZES, COLUMN_LAYOUTS } from '../../../shared/components/Modal';
import TextInput from '../../../shared/components/TextInput';
import TextArea from '../../../shared/components/TextArea';
import Select from '../../../shared/components/Select';
import PhotoInput from '../../../shared/components/PhotoInput';
import Button from '../../../shared/components/Button';
import IconButton from '../../../shared/components/IconButton';
import ConfirmationModal from '../../../shared/components/ConfirmationModal';
import ConsumableStatsEditor from './ConsumableStatsEditor';
import ConsumableAfflictionsEditor from './ConsumableAfflictionsEditor';
import useStatus from '../../../shared/hooks/useStatus';
import api from '../../../config/api';
import { TYPE_OPTIONS, RARITY_OPTIONS, SLOT_OPTIONS, MESSAGES } from '../constants';
import styles from '../styles/ItemModal.module.css';

export default function ItemModal({ isOpen, onClose, onSave, onIconDeleted, initialData = {} }) {
  const { enqueueSnackbar } = useSnackbar();
  const { baseStatus, derivedStatus } = useStatus();

  const [form, setForm] = useState({
    _id: '',
    name: '',
    description: '',
    type: '',
    rarity: '',
    buyPrice: 0,
    sellPrice: 0,
    stackable: false,
    maxStack: 1,
    requirements: { level: 1, classes: [] },
    consumable: { hpRestore: 0, mpRestore: 0, buff: '', buffDuration: 0 },
    equipment: {
      slot: '',
      durability: { current: 0, max: 0 },
      isPrimary: true,
      hands: 1,
      ammoCurrent: 0,
      ammoMax: 0,
      combatStats: {}
    },
    tags: [],
    isInitial: false,
    iconUrl: ''
  });

  const [allClasses, setAllClasses] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [iconFile, setIconFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  // Estados para consumível dinâmico
  const [consumableStats, setConsumableStats] = useState(new Map());
  const [consumableAfflictions, setConsumableAfflictions] = useState([]);

  useEffect(() => {
    if (!isOpen) return;

    // Inicializar combatStats baseado nos Status dinâmicos (base + derivados)
    const initCombatStats = () => {
      const stats = {};
      // Apenas stats base são inicializados
      baseStatus.forEach(status => {
        stats[status.nome] = initialData.equipment?.combatStats?.[status.nome] ?? 0;
      });
      // Stats derivados são calculados apenas se houver dados iniciais
      if (initialData.equipment?.combatStats) {
        derivedStatus.forEach(status => {
          stats[status.nome] = initialData.equipment?.combatStats?.[status.nome] ?? 0;
        });
      }
      return stats;
    };

    setForm({
      _id: initialData._id || '',
      name: initialData.name || '',
      description: initialData.description || '',
      type: initialData.type || '',
      rarity: initialData.rarity || '',
      buyPrice: initialData.buyPrice ?? 0,
      sellPrice: initialData.sellPrice ?? 0,
      stackable: initialData.stackable ?? false,
      maxStack: initialData.maxStack ?? 1,
      requirements: {
        level: initialData.requirements?.level ?? 1,
        classes: initialData.requirements?.classes?.map(c =>
          typeof c === 'string' ? c : c._id?.toString()) || []
      },
      consumable: {
        hpRestore: initialData.consumable?.hpRestore ?? 0,
        mpRestore: initialData.consumable?.mpRestore ?? 0,
        buff: initialData.consumable?.buff || '',
        buffDuration: initialData.consumable?.buffDuration ?? 0
      },
      equipment: {
        slot: initialData.equipment?.slot || '',
        durability: {
          current: initialData.equipment?.durability?.current ?? 0,
          max: initialData.equipment?.durability?.max ?? 0
        },
        isPrimary: initialData.equipment?.isPrimary ?? true,
        hands: initialData.equipment?.hands ?? 1,
        ammoCurrent: initialData.equipment?.ammoCurrent ?? 0,
        ammoMax: initialData.equipment?.ammoMax ?? 0,
        combatStats: initCombatStats()
      },
      tags: initialData.tags || [],
      isInitial: initialData.isInitial ?? false,
      iconUrl: initialData.iconUrl || ''
    });
    setIconFile(null);
    setPreviewUrl(initialData.iconUrl || '');

    // Inicializar estados de consumível
    if (initialData.type === 'consumable') {
      setConsumableStats(initialData.consumable?.statsModifiers || new Map());
      setConsumableAfflictions(initialData.consumable?.afflictionEffects || []);
    } else {
      setConsumableStats(new Map());
      setConsumableAfflictions([]);
    }

    api.get('/classes')
      .then(r => setAllClasses(r.data))
      .catch(() => setAllClasses([]));
    
    api.get('/status')
      .then(r => setStatusList(r.data))
      .catch(() => setStatusList([]));
  }, [initialData, isOpen, baseStatus, derivedStatus]);

  const changeField = (field, value) => setForm(f => ({ ...f, [field]: value }));
  const changeReqField = (key, value) => setForm(f => ({ ...f, requirements: { ...f.requirements, [key]: value } }));
  const changeConField = (key, value) => setForm(f => ({ ...f, consumable: { ...f.consumable, [key]: value } }));
  const changeEquipField = (key, value) => setForm(f => ({ ...f, equipment: { ...f.equipment, [key]: value } }));
  const changeDurability = (sub, value) => setForm(f => ({ ...f, equipment: { ...f.equipment, durability: { ...f.equipment.durability, [sub]: value } } }));
  
  const changeCombatStat = (stat, value) => {
    setForm(f => {
      const newStats = { ...f.equipment.combatStats, [stat]: value };
      
      // Verifica se há algum stat base diferente de 0
      const hasAnyBaseStat = baseStatus.some(baseStat => {
        return newStats[baseStat.nome] && newStats[baseStat.nome] !== 0;
      });
      
      // Recalcula stats derivados quando um stat base muda
      derivedStatus.forEach(derivedStat => {
        if (derivedStat.formula) {
          // Se não há nenhum stat base, zera os derivados
          if (!hasAnyBaseStat) {
            newStats[derivedStat.nome] = 0;
            return;
          }
          
          try {
            let formula = derivedStat.formula;
            
            // Substitui variáveis na fórmula pelos valores atuais
            baseStatus.forEach(baseStat => {
              const regex = new RegExp(`\\b${baseStat.nome}\\b`, 'g');
              const val = newStats[baseStat.nome] || 0;
              formula = formula.replace(regex, val);
            });
            
            // Para itens, level não se aplica (usa 0)
            formula = formula.replace(/\blevel\b/g, '0');
            
            // Calcula o valor (usando Function ao invés de eval para segurança)
            const calcValue = new Function('return ' + formula)();
            newStats[derivedStat.nome] = Number(calcValue.toFixed(2));
          } catch (err) {
            console.error(`Erro ao calcular ${derivedStat.nome}:`, err);
            newStats[derivedStat.nome] = 0;
          }
        }
      });
      
      return { ...f, equipment: { ...f.equipment, combatStats: newStats } };
    });
  };

  const handleStackableToggle = () => setForm(f => ({ ...f, stackable: !f.stackable, maxStack: f.stackable ? 1 : f.maxStack }));

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
      await api.delete(`/items/${form._id}/icon`);
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
    setSaving(true);
    try {
      if (!form.type || !form.rarity) {
        enqueueSnackbar(MESSAGES.VALIDATION_ERROR, { variant: 'error' });
        setSaving(false);
        return;
      }

      const fd = new FormData();
      if (form._id) fd.append('_id', form._id);
      fd.append('name', form.name);
      fd.append('description', form.description);
      fd.append('type', form.type);
      fd.append('rarity', form.rarity);
      fd.append('buyPrice', form.buyPrice);
      fd.append('sellPrice', form.sellPrice);
      fd.append('stackable', form.stackable);
      if (form.stackable) fd.append('maxStack', form.maxStack);

      fd.append('requirements', JSON.stringify(form.requirements));
      if (form.type === 'consumable') {
        const consumableData = {
          ...form.consumable,
          statsModifiers: consumableStats,
          afflictionEffects: consumableAfflictions
        };
        fd.append('consumable', JSON.stringify(consumableData));
      }
      if (form.type === 'equipment') {
        fd.append('equipment', JSON.stringify({
          slot: form.equipment.slot,
          durability: form.equipment.durability,
          isPrimary: form.equipment.isPrimary,
          hands: form.equipment.hands,
          ammoCurrent: form.equipment.ammoCurrent,
          ammoMax: form.equipment.ammoMax,
          combatStats: form.equipment.combatStats
        }));
      }
      if (form.type === 'material' && form.tags.length) {
        fd.append('tags', JSON.stringify(form.tags));
      }

      fd.append('isInitial', form.isInitial);

      if (iconFile) {
        fd.append('icon', iconFile);
      }

      await onSave(fd, form._id);
      onClose();
    } catch (err) {
      // Error handled in hook
    } finally {
      setSaving(false);
    }
  };

  const classOptions = allClasses.map(c => ({ value: c._id.toString(), label: c.name }));

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
        title={form._id ? 'Editar Item' : 'Novo Item'}
        size={MODAL_SIZES.FULL}
        closeOnOverlayClick
      >
        <form onSubmit={handleSubmit}>
          <Modal.Body columns={COLUMN_LAYOUTS.DOUBLE}>
            {/* Coluna Esquerda */}
            <div className={styles.column}>
              {/* Identidade */}
              <div className={styles.section}>
                <span className={styles.sectionTitle}>Identidade</span>
                <div className={styles.field}>
                  <label>Nome</label>
                  <TextInput value={form.name} onChange={e => changeField('name', e.target.value)} placeholder="Nome do item" required disabled={saving} />
                </div>
                <div className={styles.field}>
                  <label>Descrição</label>
                  <TextArea value={form.description} onChange={e => changeField('description', e.target.value)} placeholder="Breve descrição" rows={6} disabled={saving} style={{ resize: 'vertical' }} />
                </div>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label>Tipo</label>
                    <Select options={TYPE_OPTIONS} value={form.type} onChange={val => changeField('type', val)} disabled={saving} required />
                  </div>
                  <div className={styles.field}>
                    <label>Raridade</label>
                    <Select options={RARITY_OPTIONS} value={form.rarity} onChange={val => changeField('rarity', val)} disabled={saving} required />
                  </div>
                </div>
              </div>

              {/* Visuais */}
              <div className={styles.section}>
                <span className={styles.sectionTitle}>Visuais</span>
                <div className={styles.field}>
                  <label>Ícone do Item</label>
                  <PhotoInput file={iconFile} previewUrl={previewUrl} onFileChange={handleFileChange} onRemove={() => setConfirmOpen(true)} placeholderLabel="Escolher ícone" disabled={saving} />
                </div>
              </div>

              {/* Propriedades */}
              <div className={styles.section}>
                <span className={styles.sectionTitle}>Propriedades</span>
                <div className={styles.field}>
                  <label>
                    <input type="checkbox" checked={form.stackable} onChange={handleStackableToggle} disabled={saving} />{' '}
                    Empilhável
                  </label>
                </div>
                {form.stackable && (
                  <div className={styles.field}>
                    <label>Máx. por pilha</label>
                    <TextInput type="number" min={1} value={form.maxStack} onChange={e => changeField('maxStack', +e.target.value)} disabled={saving} />
                  </div>
                )}
                <div className={styles.field}>
                  <label>
                    <input type="checkbox" checked={form.isInitial} onChange={e => changeField('isInitial', e.target.checked)} disabled={saving} />{' '}
                    Item Inicial
                  </label>
                </div>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label>Preço de compra</label>
                    <TextInput type="number" min={0} value={form.buyPrice} onChange={e => changeField('buyPrice', +e.target.value)} disabled={saving} />
                  </div>
                  <div className={styles.field}>
                    <label>Preço de venda</label>
                    <TextInput type="number" min={0} value={form.sellPrice} onChange={e => changeField('sellPrice', +e.target.value)} disabled={saving} />
                  </div>
                </div>
              </div>

              {/* Requisitos */}
              <div className={styles.section}>
                <span className={styles.sectionTitle}>Requisitos</span>
                <div className={styles.field}>
                  <label>Nível mínimo</label>
                  <TextInput type="number" min={1} value={form.requirements.level} onChange={e => changeReqField('level', +e.target.value)} disabled={saving} />
                </div>
                <div className={styles.field}>
                  <label>Classes Permitidas</label>
                  <div className={styles.classesCheckboxes}>
                    {allClasses.map(cls => (
                      <label key={cls._id} className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={form.requirements.classes.includes(cls._id.toString())}
                          onChange={e => {
                            const id = cls._id.toString();
                            if (e.target.checked) {
                              changeReqField('classes', [...form.requirements.classes, id]);
                            } else {
                              changeReqField('classes', form.requirements.classes.filter(c => c !== id));
                            }
                          }}
                          disabled={saving}
                        />
                        {cls.name}
                      </label>
                    ))}
                  </div>
                  {allClasses.length > 0 && (
                    <button
                      type="button"
                      className={styles.selectAllBtn}
                      onClick={() => {
                        if (form.requirements.classes.length === allClasses.length) {
                          changeReqField('classes', []);
                        } else {
                          changeReqField('classes', allClasses.map(c => c._id.toString()));
                        }
                      }}
                      disabled={saving}
                    >
                      {form.requirements.classes.length === allClasses.length ? 'Desmarcar Todas' : 'Selecionar Todas'}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Coluna Direita */}
            <div className={styles.column}>
              {/* Consumível */}
              {form.type === 'consumable' && (
                <>
                  <div className={styles.section}>
                    <ConsumableStatsEditor
                      statsModifiers={consumableStats}
                      onChange={setConsumableStats}
                      disabled={saving}
                      statusList={statusList}
                    />
                  </div>

                  <div className={styles.section}>
                    <ConsumableAfflictionsEditor
                      afflictionEffects={consumableAfflictions}
                      onChange={setConsumableAfflictions}
                      disabled={saving}
                    />
                  </div>

                  {/* Campos legados (apenas leitura para migração) */}
                  {(form.consumable.hpRestore > 0 || form.consumable.mpRestore > 0 || form.consumable.buff) && (
                    <div className={styles.section}>
                      <span className={styles.sectionTitle}>Dados Legados (Migrar)</span>
                      <div className={styles.row}>
                        <div className={styles.field}>
                          <label>HP restaurado (antigo)</label>
                          <TextInput type="number" value={form.consumable.hpRestore} disabled />
                        </div>
                        <div className={styles.field}>
                          <label>MP restaurado (antigo)</label>
                          <TextInput type="number" value={form.consumable.mpRestore} disabled />
                        </div>
                      </div>
                      {form.consumable.buff && (
                        <div className={styles.row}>
                          <div className={styles.field}>
                            <label>Buff (antigo)</label>
                            <TextInput value={form.consumable.buff} disabled />
                          </div>
                          <div className={styles.field}>
                            <label>Duração (s) (antigo)</label>
                            <TextInput type="number" value={form.consumable.buffDuration} disabled />
                          </div>
                        </div>
                      )}
                      <div className={styles.migrationHint}>
                        ℹ️ Use os editores dinâmicos acima para configurar. Os campos antigos serão removidos.
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Equipamento */}
              {form.type === 'equipment' && (
                <div className={styles.section}>
                  <span className={styles.sectionTitle}>Equipamento</span>
                  <div className={styles.row}>
                    <div className={styles.field}>
                      <label>Slot</label>
                      <Select options={SLOT_OPTIONS} value={form.equipment.slot} onChange={val => changeEquipField('slot', val)} disabled={saving} />
                    </div>
                    <div className={styles.field}>
                      <label>Durabilidade atual</label>
                      <TextInput type="number" min={0} value={form.equipment.durability.current} onChange={e => changeDurability('current', +e.target.value)} disabled={saving} />
                    </div>
                    <div className={styles.field}>
                      <label>Durabilidade máx.</label>
                      <TextInput type="number" min={0} value={form.equipment.durability.max} onChange={e => changeDurability('max', +e.target.value)} disabled={saving} />
                    </div>
                  </div>

                  {form.equipment.slot === 'weapon' && (
                    <>
                      <div className={styles.row}>
                        <div className={styles.field}>
                          <label>Tipo de arma</label>
                          <Select options={[{ value: true, label: 'Primária' }, { value: false, label: 'Secundária' }]} value={form.equipment.isPrimary} onChange={val => changeEquipField('isPrimary', val)} disabled={saving} />
                        </div>
                        <div className={styles.field}>
                          <label>Mãos</label>
                          <TextInput type="number" min={1} value={form.equipment.hands} onChange={e => changeEquipField('hands', +e.target.value)} disabled={saving} />
                        </div>
                      </div>
                      <div className={styles.row}>
                        <div className={styles.field}>
                          <label>Munição atual</label>
                          <TextInput type="number" min={0} value={form.equipment.ammoCurrent} onChange={e => changeEquipField('ammoCurrent', +e.target.value)} disabled={saving} />
                        </div>
                        <div className={styles.field}>
                          <label>Munição máx.</label>
                          <TextInput type="number" min={0} value={form.equipment.ammoMax} onChange={e => changeEquipField('ammoMax', +e.target.value)} disabled={saving} />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Bônus de stats - dinâmicos baseados em useStatus */}
                  <div className={styles.subsection}>
                    <h4 className={styles.subsectionTitle}>Bônus de Atributos</h4>
                    <div className={styles.statsGrid}>
                      {baseStatus.map(status => {
                        const value = Number(form.equipment.combatStats[status.nome]) || 0;
                        return (
                          <div key={status.nome} className={styles.statControl}>
                            <label>
                              {status.iconeUrl && (
                                <img src={status.iconeUrl} alt={status.label} className={styles.statIcon} />
                              )}
                              {status.label}
                            </label>
                            <TextInput
                              type="number"
                              value={value}
                              onChange={e => changeCombatStat(status.nome, +e.target.value)}
                              disabled={saving}
                              className={styles.smallInput}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Stats Derivados (calculados, apenas visualização) */}
                  {derivedStatus.length > 0 && (
                    <div className={styles.subsection}>
                      <h4 className={styles.subsectionTitle}>Atributos Derivados (Calculados)</h4>
                      <div className={styles.statsGrid}>
                        {derivedStatus.map(status => {
                          const value = Number(form.equipment.combatStats[status.nome]) || 0;
                          return (
                            <div key={status.nome} className={styles.statControl}>
                              <label>
                                {status.iconeUrl && (
                                  <img src={status.iconeUrl} alt={status.label} className={styles.statIcon} />
                                )}
                                {status.label}
                              </label>
                              <input
                                type="number"
                                value={value}
                                disabled
                                readOnly
                                className={styles.smallInput}
                                style={{
                                  color: value > 0 ? '#ff9800' : value < 0 ? '#f44336' : 'inherit',
                                  fontWeight: value !== 0 ? 600 : 'normal'
                                }}
                              />
                            </div>
                          );
                        })}
                      </div>
                      <p className={styles.derivedNote}>
                        💡 Stats derivados são calculados automaticamente pelo sistema
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Tags (material) */}
              {form.type === 'material' && (
                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>Material</h3>
                  <div className={styles.field}>
                    <label>Tags (vírgula separadas)</label>
                    <TextInput value={form.tags.join(', ')} onChange={e => changeField('tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))} disabled={saving} />
                  </div>
                </div>
              )}
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
