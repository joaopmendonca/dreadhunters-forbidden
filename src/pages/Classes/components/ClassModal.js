// src/pages/Classes/ClassModal.jsx

import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { FaMinus, FaPlus, FaTrash } from 'react-icons/fa';

import Modal, { MODAL_SIZES, COLUMN_LAYOUTS } from '../../../shared/components/Modal';
import Button from '../../../shared/components/Button';
import ConfirmationModal from '../../../shared/components/ConfirmationModal';
import PhotoInput from '../../../shared/components/PhotoInput';
import Select from '../../../shared/components/Select';
import TextArea from '../../../shared/components/TextArea';
import TextInput from '../../../shared/components/TextInput';
import useStatus from '../../../shared/hooks/useStatus';
import useServerConfig from '../../../shared/hooks/useServerConfig';

import api from '../../../config/api';
import styles from '../styles/ClassModal.module.css';

export default function ClassModal({
  isOpen,
  onClose,
  onSave,
  onIconDeleted,
  initialData = {},
  rolesList = [],
  skillsList = []
}) {
  const { enqueueSnackbar } = useSnackbar();
  const { baseStatus, loading: loadingStatus, normalizeStats } = useStatus();
  const { config: serverConfig, loading: loadingConfig } = useServerConfig();

  const [form, setForm] = useState({
    _id: '',
    name: '',
    description: '',
    role: '',
    baseStats: {},
    skillTreeRoots: [],
    iconUrl: '',
    resourceType: 'none',
    resourceBase: 0,
    resourceRegen: 0,
    skillSlots: 3,
    colorTheme: '#ffffff',
    artworkUrl: ''
  });
  const [iconFile, setIconFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [artworkFile, setArtworkFile] = useState(null);
  const [previewArtworkUrl, setPreviewArtworkUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    
    const normalizePreviewUrl = (u) => {
      if (!u) return '';
      try {
        if (/^https?:\/\//i.test(u) || /^\/\//.test(u)) {
          const basePublic = api.defaults.baseURL.replace(/\/api\/?$/, '');
          try {
            const parsed = new URL(u);
            if (parsed.pathname && parsed.pathname.startsWith('/uploads')) {
              return `${basePublic}${parsed.pathname}${parsed.search || ''}`;
            }
            const publicOrigin = (new URL(basePublic)).origin;
            if (parsed.origin === publicOrigin) return u;
            return u;
          } catch (e) {
            return u;
          }
        }
      } catch (e) {
        // continue para paths relativos
      }
      const path = u.startsWith('/') ? u : `/${u}`;
      return `${api.defaults.baseURL.replace(/\/api\/?$/, '')}${path}`;
    };

    // Inicializar stats baseado nos Status disponíveis
    const initStats = () => {
      if (!baseStatus.length) return {};
      const stats = {};
      baseStatus.forEach(status => {
        stats[status.nome] = 0;
      });
      return stats;
    };

    // Normalizar stats localmente
    const normalizeStatsLocal = (stats) => {
      if (!stats) return {};
      if (stats instanceof Map) {
        return Object.fromEntries(stats);
      }
      return { ...stats };
    };

    console.log('ClassModal - initialData:', initialData);

    // initialize form from initialData
    setForm({
      _id: initialData?._id || '',
      name: initialData?.name || '',
      description: initialData?.description || '',
      role: initialData?.role?._id || '',
      baseStats: initialData?.baseStats
        ? normalizeStatsLocal(initialData.baseStats)
        : initStats(),
      artworkUrl: initialData?.artworkUrl || '',
      skillTreeRoots: (initialData?.skillTree?.roots || []).map(root => ({
        skill: root.skill?._id || root.skill,
        requiredLevel: root.requiredLevel || 1,
        unlocked: root.unlocked || false
      })),
      iconUrl: initialData?.iconUrl || '',
      resourceType: initialData?.resourceType || 'none',
      resourceBase: initialData?.resourceBase || 0,
      resourceRegen: initialData?.resourceRegen || 0,
      skillSlots: initialData?.skillSlots || 3,
      colorTheme: initialData?.colorTheme || '#ffffff'
    });
    setIconFile(null);
    setPreviewUrl(normalizePreviewUrl(initialData?.iconUrl || ''));
    setArtworkFile(null);
    setPreviewArtworkUrl(normalizePreviewUrl(initialData?.artworkUrl || ''));
  }, [initialData?._id, isOpen, baseStatus]);

  if (!isOpen) return null;

  if (loadingStatus || loadingConfig) {
    return (
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  const handleChangeField = (field, value) =>
    setForm(f => ({ ...f, [field]: value }));

  const handleStatChange = (statName, value) => {
    const newValue = Math.max(serverConfig.minStatValue, Number(value) || 0);
    
    // Calcular pontos usados sem este stat
    const otherStats = Object.entries(form.baseStats)
      .filter(([key]) => key !== statName)
      .reduce((sum, [, val]) => sum + (Number(val) || 0), 0);
    
    // Verificar se não excede o máximo
    if (otherStats + newValue <= serverConfig.maxStatPointsPerClass && newValue <= serverConfig.maxStatValue) {
      setForm(f => ({
        ...f,
        baseStats: { ...f.baseStats, [statName]: newValue }
      }));
    }
  };

  const handleStatDelta = (statName, delta) => {
    const currentValue = Number(form.baseStats[statName]) || 0;
    const newValue = Math.max(serverConfig.minStatValue, currentValue + delta);
    handleStatChange(statName, newValue);
  };

  const usedPoints = Object.values(form.baseStats).reduce((sum, val) => sum + (Number(val) || 0), 0);
  const remaining = serverConfig.maxStatPointsPerClass - usedPoints;

  // Calcula os stats derivados baseado nos stats base (level 1)
  const calculateDerivedStats = () => {
    const stats = form.baseStats;
    const level = 1; // Classes sempre usam level 1 como base
    
    const str = Number(stats.str) || 0;
    const dex = Number(stats.dex) || 0;
    const con = Number(stats.con) || 0;
    const int = Number(stats.int) || 0;
    const wit = Number(stats.wit) || 0;
    const men = Number(stats.men) || 0;

    return {
      // Pontos de Vida e Energia
      max_hp: Math.floor((con * 8) + (level * 4.5)),
      max_sp: Math.floor((men * 5) + (level * 2)),
      max_cp: Math.floor((con * 6) + (level * 3.5)),
      hp_regen: ((con * 0.1) + (level * 0.05)).toFixed(2),
      sp_regen: ((men * 0.15) + (level * 0.03)).toFixed(2),
      cp_regen: (con * 0.08).toFixed(2),
      // Poder Ofensivo
      p_atk: Math.floor((str * 1.2) + (level * 0.8)),
      m_atk: Math.floor((int * 1.5) + (wit * 0.5) + (level * 0.7)),
      crit_rate: ((dex * 0.3) + 10).toFixed(1),
      crit_dmg: Math.floor((str * 0.2) + 100),
      m_crit_rate: ((wit * 0.4) + 5).toFixed(1),
      // Poder Defensivo
      p_def: Math.floor((con * 1.5) + (dex * 0.3) + (level * 0.5)),
      m_def: Math.floor((men * 1.3) + (int * 0.4) + (level * 0.4)),
      evasion: ((dex * 0.5) + (level * 0.3)).toFixed(1)
    };
  };

  const derivedStats = calculateDerivedStats();

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

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    setIconFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleArtworkChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    setArtworkFile(file);
    setPreviewArtworkUrl(URL.createObjectURL(file));
  };

  const performDeleteIcon = async () => {
    if (!form._id) {
      setIconFile(null);
      setPreviewUrl('');
      setForm(f => ({ ...f, iconUrl: '' }));
      setConfirmOpen(false);
      return;
    }
    setDeleting(true);
    try {
      await api.delete(`/classes/${form._id}/icon`);
      enqueueSnackbar('Ícone removido', { variant: 'success' });
      setPreviewUrl('');
      setForm(f => ({ ...f, iconUrl: '' }));
      onIconDeleted?.();
    } catch {
      enqueueSnackbar('Erro ao remover ícone', { variant: 'error' });
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);

    try {
      const fd = new FormData();

      // se estiver editando, inclua o _id
      if (form._id) {
        fd.append('_id', form._id);
      }

      // campos básicos
      fd.append('name', form.name);
      fd.append('description', form.description);
      fd.append('role', form.role);

      fd.append('baseStats', JSON.stringify(form.baseStats));
      
      // recursos e metadados adicionais
      fd.append('resourceType', form.resourceType || 'none');
      fd.append('resourceBase', String(form.resourceBase || 0));
      fd.append('resourceRegen', String(form.resourceRegen || 0));
      fd.append('skillSlots', String(form.skillSlots || 0));
      fd.append('colorTheme', form.colorTheme || '#ffffff');
      
      // Skill Tree roots
      const skillTreeRoots = form.skillTreeRoots
        .filter(r => r.skill)
        .map(r => ({
          skill: r.skill,
          requiredLevel: r.requiredLevel || 1,
          unlocked: r.unlocked || false,
          prerequisites: [],
          children: []
        }));
      fd.append('skillTree', JSON.stringify({ roots: skillTreeRoots }));

      // arquivo de ícone, se houver
      if (iconFile) {
        fd.append('icon', iconFile);
      }

      // arquivo de artwork, se houver
      if (artworkFile) {
        fd.append('artwork', artworkFile);
      }

      // chama a função passada via props
      await onSave(fd);

      // fecha o modal se der tudo certo
      onClose();
    } catch (err) {
      enqueueSnackbar(
        err.response?.data?.message || err.message || 'Falha ao salvar classe',
        { variant: 'error' }
      );
    } finally {
      setSaving(false);
    }
  };

  const roleOptions = [
    { value: '', label: '— Selecione a Role —' },
    ...rolesList.map(r => ({ value: r._id, label: r.name }))
  ];

  return (
    <>
      <ConfirmationModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Remover Ícone"
        message="Tem certeza que deseja excluir o ícone da classe?"
        confirmText="Sim, excluir"
        cancelText="Cancelar"
        isLoading={deleting}
        onConfirm={performDeleteIcon}
      />

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={form._id ? 'Editar Classe' : 'Nova Classe'}
        size={MODAL_SIZES.FULL}
        closeOnOverlayClick={!saving}
      >
        <form onSubmit={handleSubmit}>
          <Modal.Body columns={COLUMN_LAYOUTS.DOUBLE}>
            {/* Coluna Esquerda - Informações Básicas */}
            <div className={styles.column}>
              {/* Seção: Identidade */}
              <div className={styles.section}>
                <span className={styles.sectionTitle}>Identidade</span>
                
                <div className={styles.field} style={{ marginTop: '0.5rem' }}>
                  <label>Nome da Classe</label>
                  <TextInput
                    value={form.name}
                    onChange={e => handleChangeField('name', e.target.value)}
                    placeholder="Ex: Guerreiro, Mago, Ladino..."
                    required
                    disabled={saving}
                  />
                </div>

                <div className={styles.field}>
                  <label>Descrição</label>
                  <TextArea
                    value={form.description}
                    onChange={e => handleChangeField('description', e.target.value)}
                    placeholder="Breve descrição da classe e seu papel..."
                    disabled={saving}
                    rows={3}
                  />
                </div>

                <div className={styles.field}>
                  <label>Role</label>
                  <Select
                    options={roleOptions}
                    value={form.role}
                    onChange={val => handleChangeField('role', val)}
                    disabled={saving}
                    className={styles.dropdown}
                  />
                </div>
              </div>

              {/* Seção: Visuais */}
              <div className={styles.section}>
                <span className={styles.sectionTitle}>Visuais</span>
                
                <div className={styles.photosRow} style={{ marginTop: '0.5rem' }}>
                  <div className={styles.field}>
                    <label>Ícone</label>
                    <PhotoInput
                      file={iconFile}
                      previewUrl={previewUrl}
                      onFileChange={handleFileChange}
                      onRemove={() => setConfirmOpen(true)}
                      placeholderLabel="Escolher ícone"
                      disabled={saving}
                    />
                  </div>

                  <div className={styles.field}>
                    <label>Artwork</label>
                    <PhotoInput
                      file={artworkFile}
                      previewUrl={previewArtworkUrl}
                      onFileChange={handleArtworkChange}
                      onRemove={() => { setArtworkFile(null); setPreviewArtworkUrl(''); setForm(f => ({ ...f, artworkUrl: '' })); }}
                      placeholderLabel="Escolher artwork"
                      disabled={saving}
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label>Cor Temática</label>
                  <input
                    type="color"
                    value={form.colorTheme}
                    onChange={e => handleChangeField('colorTheme', e.target.value)}
                    disabled={saving}
                    className={styles.colorInput}
                  />
                </div>
              </div>

              {/* Seção: Recursos */}
              <div className={styles.section}>
                <span className={styles.sectionTitle}>Recursos</span>
                
                <div className={styles.row} style={{ marginTop: '0.5rem' }}>
                  <div className={styles.field}>
                    <label>Tipo</label>
                    <Select
                      options={[
                        { value: 'none', label: 'Nenhum' },
                        { value: 'mana', label: 'Mana' },
                        { value: 'rage', label: 'Fúria' }
                      ]}
                      value={form.resourceType}
                      onChange={val => handleChangeField('resourceType', val)}
                      disabled={saving}
                      className={styles.dropdown}
                    />
                  </div>

                  <div className={styles.field}>
                    <label>Base</label>
                    <TextInput
                      type="number"
                      value={form.resourceBase}
                      onChange={e => handleChangeField('resourceBase', +e.target.value)}
                      disabled={saving || form.resourceType === 'none'}
                    />
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.field}>
                    <label>Regen/Turno</label>
                    <TextInput
                      type="number"
                      value={form.resourceRegen}
                      onChange={e => handleChangeField('resourceRegen', +e.target.value)}
                      disabled={saving || form.resourceType === 'none'}
                    />
                  </div>

                  <div className={styles.field}>
                    <label>Slots de Skill</label>
                    <TextInput
                      type="number"
                      value={form.skillSlots}
                      onChange={e => handleChangeField('skillSlots', +e.target.value)}
                      disabled={saving}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Coluna Direita - Atributos */}
            <div className={styles.column}>
              {/* Pontos Restantes */}
              <div className={styles.pointsInfo}>
                ⚔ Pontos Restantes: <strong>{remaining}</strong> / {serverConfig.maxStatPointsPerClass}
              </div>

              {/* Seção: Atributos Base */}
              <fieldset className={styles.fieldset}>
                <legend>Atributos Base</legend>
                <div className={styles.statsGrid}>
                  {baseStatus.map(status => {
                    const value = Number(form.baseStats[status.nome]) || 0;
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
                          <Button
                            icon={<FaMinus />}
                            onClick={() => handleStatDelta(status.nome, -1)}
                            disabled={saving || value <= serverConfig.minStatValue}
                            style={{ minWidth: '32px', padding: '0.25rem' }}
                          />
                          <Button
                            icon={<FaPlus />}
                            onClick={() => handleStatDelta(status.nome, +1)}
                            disabled={saving || remaining <= 0 || value >= serverConfig.maxStatValue}
                            style={{ minWidth: '32px', padding: '0.25rem' }}
                          />
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

              {/* Skill Tree Roots */}
              <fieldset className={styles.fieldset}>
                <legend>🌳 Skill Tree</legend>
                <p style={{ fontSize: '0.85rem', color: 'var(--light-1)', marginBottom: '1rem' }}>
                  Adicione skills na árvore de progressão. Marque como "Desbloqueada" para que o personagem já comece com ela.
                </p>
              
              <div className={styles.field}>
                <label>Selecionar Skills</label>
                <div 
                  style={{ 
                    maxHeight: '300px', 
                    overflowY: 'auto', 
                    border: '1px solid var(--dark-3)',
                    borderRadius: '4px',
                    padding: '0.5rem',
                    background: 'var(--dark-2)'
                  }}
                >
                  {skillsList.map(s => {
                    const isSelected = form.skillTreeRoots.some(r => r.skill === s._id);
                    return (
                      <label 
                        key={s._id} 
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          padding: '0.5rem',
                          cursor: 'pointer',
                          borderRadius: '4px',
                          marginBottom: '0.25rem',
                          background: isSelected ? 'var(--dark-3)' : 'transparent',
                          border: isSelected ? '1px solid var(--gold)' : '1px solid transparent',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={e => {
                          if (!isSelected) {
                            e.currentTarget.style.background = 'var(--dark-3)';
                          }
                        }}
                        onMouseLeave={e => {
                          if (!isSelected) {
                            e.currentTarget.style.background = 'transparent';
                          }
                        }}
                      >
                        <input
                          type="checkbox"
                          disabled={saving}
                          checked={isSelected}
                          onChange={e => {
                            const newRoots = e.target.checked
                              ? [...form.skillTreeRoots, { skill: s._id, requiredLevel: 1, unlocked: false }]
                              : form.skillTreeRoots.filter(r => r.skill !== s._id);
                            handleChangeField('skillTreeRoots', newRoots);
                          }}
                          style={{ 
                            marginRight: '0.75rem',
                            width: '16px',
                            height: '16px',
                            cursor: 'pointer'
                          }}
                        />
                        {s.iconUrl && (
                          <img 
                            src={s.iconUrl} 
                            alt="" 
                            style={{ 
                              width: '20px', 
                              height: '20px', 
                              marginRight: '0.5rem',
                              objectFit: 'contain'
                            }} 
                          />
                        )}
                        <span style={{ fontSize: '0.85rem', color: 'var(--light-2)' }}>
                          {s.name} (Lv.{s.levelRequirement || 1})
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {form.skillTreeRoots.length > 0 && (
                <div style={{ marginTop: '1rem' }}>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--gold)' }}>
                    Skills Selecionadas ({form.skillTreeRoots.length}):
                  </strong>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {form.skillTreeRoots.map(root => {
                      const skill = skillsList.find(s => s._id === root.skill);
                      return skill ? (
                        <div
                          key={root.skill}
                          style={{
                            padding: '0.5rem',
                            background: 'var(--dark-3)',
                            border: `1px solid ${root.unlocked ? 'var(--gold)' : 'var(--maroon)'}`,
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {skill.iconUrl && (
                              <img src={skill.iconUrl} alt="" style={{ width: '20px', height: '20px' }} />
                            )}
                            <span style={{ fontSize: '0.85rem', color: 'var(--light-2)' }}>
                              {skill.name}
                            </span>
                          </div>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', margin: 0 }}>
                            <input
                              type="checkbox"
                              checked={root.unlocked}
                              onChange={e => {
                                const newRoots = form.skillTreeRoots.map(r =>
                                  r.skill === root.skill ? { ...r, unlocked: e.target.checked } : r
                                );
                                handleChangeField('skillTreeRoots', newRoots);
                              }}
                              style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                            />
                            <span style={{ fontSize: '0.75rem', color: root.unlocked ? 'var(--gold)' : 'var(--light-1)' }}>
                              {root.unlocked ? '✨ Desbloqueada' : 'Bloqueada'}
                            </span>
                          </label>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </fieldset>
            </div>
          </Modal.Body>

          <Modal.Footer alignment="between">
            <Button
              type="button"
              onClick={onClose}
              disabled={saving}
              variant="secondary"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={saving}
              backgroundColor="var(--maroon)"
              textColor="var(--light)"
              hoverColor="var(--gold)"
            >
              {saving ? 'Salvando…' : '✓ Salvar Classe'}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}
