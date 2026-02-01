import React, { useState, useEffect } from 'react';
import Modal, { MODAL_SIZES, COLUMN_LAYOUTS } from '../../../shared/components/Modal';
import TextInput from '../../../shared/components/TextInput';
import TextArea from '../../../shared/components/TextArea';
import Button from '../../../shared/components/Button';
import { useStatus } from '../../../shared/hooks/useStatus';
import StatsRadarChart from './StatsRadarChart';
import styles from '../styles/RoleModal.module.css';

export default function RoleModal({ isOpen, onClose, onSave, initialData = {} }) {
  const { baseStatus } = useStatus();
  const [form, setForm] = useState({
    name: '',
    description: ''
  });
  const [statsDistribution, setStatsDistribution] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm({
      name: initialData.name || '',
      description: initialData.description || ''
    });

    // Inicializar statsDistribution
    if (initialData.statsDistribution) {
      // Converter Map para Object se necessário
      const dist = initialData.statsDistribution instanceof Map 
        ? Object.fromEntries(initialData.statsDistribution) 
        : initialData.statsDistribution;
      setStatsDistribution(dist);
    } else {
      // Inicializar com 0% para cada stat base
      const initialDist = {};
      baseStatus.forEach(stat => {
        initialDist[stat.nome] = 0;
      });
      setStatsDistribution(initialDist);
    }
  }, [initialData, isOpen, baseStatus]);

  const handleChange = (field, value) =>
    setForm(f => ({ ...f, [field]: value }));

  const handleStatDistributionChange = (statNome, value) => {
    const numValue = parseFloat(value) || 0;
    
    // Calcular soma dos outros stats (excluindo o atual)
    const otherStatsTotal = Object.entries(statsDistribution)
      .filter(([key]) => key !== statNome)
      .reduce((sum, [, val]) => sum + val, 0);
    
    // Espaço disponível para este stat
    const maxAllowed = 100 - otherStatsTotal;
    
    // Limitar entre 0 e o máximo permitido para não ultrapassar 100% total
    const finalValue = Math.max(0, Math.min(maxAllowed, numValue));
    
    setStatsDistribution(prev => ({
      ...prev,
      [statNome]: finalValue
    }));
  };

  // Calcular total da distribuição
  const totalDistribution = Object.values(statsDistribution).reduce((sum, val) => sum + val, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        name: form.name.trim(),
        description: form.description.trim(),
        statsDistribution: statsDistribution
      }, initialData._id);
      onClose();
    } catch {
      // Error handled in hook
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData._id ? 'Editar Role' : 'Nova Role'}
      size={MODAL_SIZES.MEDIUM}
      closeOnOverlayClick
    >
      <form onSubmit={handleSubmit}>
        <Modal.Body columns={COLUMN_LAYOUTS.SINGLE}>
          <div className={styles.column}>
            <div className={styles.field}>
              <label>Nome</label>
              <TextInput
                value={form.name}
                onChange={e => handleChange('name', e.target.value)}
                placeholder="Nome da Role"
                required
                disabled={saving}
              />
            </div>

            <div className={styles.field}>
              <label>Descrição</label>
              <TextArea
                value={form.description}
                onChange={e => handleChange('description', e.target.value)}
                placeholder="Breve descrição"
                disabled={saving}
                rows={3}
              />
            </div>

            <div className={styles.section}>
              <div className={styles.sectionTitle}>
                Distribuição de Stats por Porcentagem
                <span className={styles.totalBadge} style={{ 
                  color: totalDistribution === 100 ? 'var(--green)' : totalDistribution > 100 ? 'var(--red)' : 'var(--gold)'
                }}>
                  Total: {totalDistribution.toFixed(0)}%
                </span>
              </div>
              <p className={styles.hint}>
                Configure a distribuição padrão de pontos de stats para esta role. O total deve somar 100%.
              </p>

              <div className={styles.chartContainer}>
                <StatsRadarChart 
                  statsDistribution={statsDistribution}
                  baseStatus={baseStatus}
                />
              </div>

              <div className={styles.statsGrid}>
                {baseStatus.map(stat => (
                  <div key={stat._id} className={styles.statField}>
                    <label>
                      <span className={styles.statIcon}>{stat.icone || '🎯'}</span>
                      {stat.label || stat.nome}
                    </label>
                    <div className={styles.percentInput}>
                      <TextInput
                        type="number"
                        min="0"
                        max="100"
                        step="1"
                        value={statsDistribution[stat.nome] || 0}
                        onChange={e => handleStatDistributionChange(stat.nome, e.target.value)}
                        disabled={saving}
                      />
                      <span className={styles.percentSymbol}>%</span>
                    </div>
                  </div>
                ))}
              </div>

              {totalDistribution !== 100 && (
                <p className={styles.warning} style={{ color: totalDistribution > 100 ? 'var(--red)' : 'var(--gold)' }}>
                  {totalDistribution > 100 
                    ? `⚠️ Total acima de 100% (excesso de ${(totalDistribution - 100).toFixed(0)}%)`
                    : `⚠️ Faltam ${(100 - totalDistribution).toFixed(0)}% para completar 100%`
                  }
                </p>
              )}
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
  );
}
