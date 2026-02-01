import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { FaUser, FaPlus, FaMinus } from 'react-icons/fa';
import Modal, { MODAL_SIZES, COLUMN_LAYOUTS } from '../../../shared/components/Modal';
import Button from '../../../shared/components/Button';
import IconButton from '../../../shared/components/IconButton';
import PhotoInput from '../../../shared/components/PhotoInput';
import Select from '../../../shared/components/Select';
import TextArea from '../../../shared/components/TextArea';
import TextInput from '../../../shared/components/TextInput';
import ConfirmationModal from '../../../shared/components/ConfirmationModal';
import useServerConfig from '../../../shared/hooks/useServerConfig';
import useStatus from '../../../shared/hooks/useStatus';
import styles from '../styles/CharacterModal.module.css';

const emptyForm = {
  _id: '',
  name: '',
  description: '',
  classId: '',
  gender: 'male',
  level: 1,
  xp: 0,
  nextLevelXp: 100,
  currency: 0,
  iconUrl: '',
  stats: {}
};

export default function CharacterModal({
  isOpen,
  onClose,
  onSave,
  onIconDeleted,
  initialData = null,
  classes = []
}) {
  const { enqueueSnackbar } = useSnackbar();
  const { config: serverConfig } = useServerConfig();
  const { baseStatus } = useStatus();
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const statsEnabled = Boolean(form.classId);

  // Calcula pontos totais disponíveis: pontos iniciais + (1 por nível acima de 1)
  const totalAvailablePoints = serverConfig
    ? serverConfig.initialStatPoints + Math.max(0, (form.level - 1))
    : 6;

  // Calcula pontos usados
  const usedPoints = baseStatus.reduce((sum, status) => {
    const value = Number(form.stats[status.nome]) || 0;
    return sum + value;
  }, 0);

  const remainingPoints = totalAvailablePoints - usedPoints;

  // Calcula os stats derivados baseado nos stats base e level
  const calculateDerivedStats = () => {
    const stats = form.stats;
    const level = form.level || 1;
    
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
      const classVal = initialData.classId || (initialData.class ? (typeof initialData.class === 'object' ? initialData.class._id : initialData.class) : '');
      
      // Inicializa stats
      const initStats = {};
      if (baseStatus.length) {
        baseStatus.forEach(status => {
          const statsObj = initialData.stats instanceof Map 
            ? Object.fromEntries(initialData.stats) 
            : (initialData.stats || {});
          initStats[status.nome] = statsObj[status.nome] || 0;
        });
      }
      
      setForm({
        _id: initialData._id || '',
        name: initialData.name || '',
        description: initialData.description || '',
        classId: classVal || '',
        gender: initialData.gender || 'male',
        level: initialData.level || 1,
        xp: initialData.xp || 0,
        nextLevelXp: initialData.nextLevelXp || 100,
        currency: initialData.currency || 0,
        iconUrl: initialData.iconUrl || '',
        stats: initStats
      });
      setFile(null);
      setPreview(initialData.iconUrl || '');
      setConfirmDelete(false);
    }
  }, [initialData, baseStatus]);

  const handleFileChange = (fileInput) => {
    // Se não veio arquivo, limpa estado e revoga preview anterior
    if (!fileInput) {
      if (preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
      setFile(null);
      setPreview('');
      return;
    }

    let selectedFile;

    // 1) Recebeu diretamente um File?
    if (fileInput instanceof File) {
      selectedFile = fileInput;

      // 2) Recebeu um array ou FileList?
    } else if (fileInput.length && fileInput[0] instanceof File) {
      selectedFile = fileInput[0];

      // 3) Recebeu evento do input <input type="file" />?
    } else if (fileInput.target && fileInput.target.files) {
      selectedFile = fileInput.target.files[0];

    } else {
      console.error('handleFileChange: formato de arquivo não reconhecido', fileInput);
      return;
    }

    // Revoga URL antiga, se existir
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }

    // Atualiza estado com o novo File e gera o preview
    setFile(selectedFile);
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
  };


  const handleStatDelta = (statName, delta) => {
    const currentValue = Number(form.stats[statName]) || 0;
    const newValue = Math.max(0, Math.min(serverConfig?.maxStatValue || 99, currentValue + delta));
    setForm(prev => ({
      ...prev,
      stats: { ...prev.stats, [statName]: newValue }
    }));
  };

  const handleRemoveIcon = async () => {
    setSaving(true);
    try {
      if (form._id && onIconDeleted) {
        await onIconDeleted(form._id);
      }
      setForm((f) => ({ ...f, iconUrl: '' }));
      setFile(null);
      setPreview('');
      enqueueSnackbar('Ícone removido', { variant: 'success' });
    } catch {
      enqueueSnackbar('Erro ao remover ícone', { variant: 'error' });
    } finally {
      setSaving(false);
      setConfirmDelete(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let payload;
      if (file) {
        payload = new FormData();
        Object.entries(form).forEach(([key, val]) => {
          if (key === 'iconUrl') return;
          if (key === 'classId') {
            if (val) payload.append('class', val);
            return;
          }
          if (key === 'stats') {
            payload.append('stats', JSON.stringify(val));
            return;
          }
          payload.append(key, val);
        });
        payload.append('type', 'npc');
        payload.append('icon', file);
      } else {
        payload = {
          ...form,
          type: 'npc',
          ...(form.classId ? { class: form.classId } : {})
        };
        delete payload.classId;
      }
      await onSave(payload);
      onClose();
    } catch {
      // Erro já tratado pelo hook useCharacters
    } finally {
      setSaving(false);
      if (preview.startsWith('blob:')) URL.revokeObjectURL(preview);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={form._id ? 'Editar NPC' : 'Novo NPC'}
        icon={<FaUser />}
        size={MODAL_SIZES.XLARGE}
        closeOnOverlayClick={!saving}
      >
        <form onSubmit={handleSubmit}>
          <Modal.Body columns={COLUMN_LAYOUTS.DOUBLE}>
            {/* Coluna 1 - Informações Básicas */}
            <div className={styles.column}>
              {/* Identidade */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Identidade</h3>
                <div className={styles.field}>
                  <label>Nome do NPC</label>
                  <TextInput
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Nome"
                    disabled={saving}
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label>Descrição</label>
                  <TextArea
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    rows={3}
                    disabled={saving}
                    placeholder="Descrição"
                  />
                </div>
              </div>

              {/* Características */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Características</h3>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label>Classe</label>
                    <Select
                      value={form.classId}
                      onChange={(val) => setForm({ ...form, classId: val })}
                      options={[
                        { value: '', label: 'Selecione a classe' },
                        ...classes.map((c) => ({ value: c._id, label: c.name }))
                      ]}
                      disabled={saving}
                    />
                  </div>

                  <div className={styles.field}>
                    <label>Gênero</label>
                    <Select
                      value={form.gender}
                      onChange={(val) => setForm({ ...form, gender: val })}
                      options={[
                        { value: 'male', label: 'Masculino' },
                        { value: 'female', label: 'Feminino' },
                        { value: 'other', label: 'Outro' }
                      ]}
                      disabled={saving}
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label>Nível</label>
                  <TextInput
                    type="number"
                    value={form.level}
                    onChange={(e) =>
                      setForm({ ...form, level: Math.min(serverConfig.maxLevel, Math.max(1, +e.target.value)) })
                    }
                    disabled={saving}
                    min={1}
                    max={serverConfig.maxLevel}
                  />
                </div>
              </div>

              {/* Visuais */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Visuais</h3>
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
              </div>
            </div>

            {/* Coluna 2 - Estatísticas */}
            <div className={styles.column}>
              {/* Pontos Restantes */}
              {totalAvailablePoints > 0 && (
                <div className={styles.pointsInfo}>
                  ⚔ Pontos Restantes: <strong>{remainingPoints}</strong> / {totalAvailablePoints}
                </div>
              )}

              {/* Distribuição de Stats */}
              {totalAvailablePoints > 0 && baseStatus.length > 0 && (
                <fieldset className={styles.statsFieldset}>
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
                            <IconButton 
                              icon={<FaMinus />} 
                              onClick={() => handleStatDelta(status.nome, -1)} 
                              disabled={saving || value <= 0}
                              hoverColor="var(--dark-2)"
                            />
                            <IconButton 
                              icon={<FaPlus />} 
                              onClick={() => handleStatDelta(status.nome, 1)} 
                              disabled={saving || remainingPoints <= 0 || value >= (serverConfig?.maxStatValue || 99)}
                              hoverColor="var(--dark-2)"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </fieldset>
              )}

              {/* Atributos Derivados (Calculados) */}
              {totalAvailablePoints > 0 && Object.keys(derivedStats).length > 0 && (
                <fieldset className={styles.statsFieldset}>
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
              )}
            </div>
          </Modal.Body>

          <Modal.Footer alignment="between">
            <Button
              type="button"
              onClick={onClose}
              variant="secondary"
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              backgroundColor="var(--maroon)"
              textColor="var(--light)"
              hoverColor="var(--gold)"
              disabled={saving}
            >
              {saving ? 'Salvando…' : 'Salvar'}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>

      <ConfirmationModal
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleRemoveIcon}
        title="Excluir Ícone"
        message="Tem certeza que deseja excluir o ícone do NPC?"
        confirmText="Sim, excluir"
        cancelText="Cancelar"
        isLoading={saving}
      />
    </>
  );
}
