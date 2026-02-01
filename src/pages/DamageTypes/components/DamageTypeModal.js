import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import Modal, { MODAL_SIZES } from '../../../shared/components/Modal';
import TextInput from '../../../shared/components/TextInput';
import TextArea from '../../../shared/components/TextArea';
import Select from '../../../shared/components/Select';
import Button from '../../../shared/components/Button';
import PhotoInput from '../../../shared/components/PhotoInput';
import api from '../../../config/api';
import { COLOR_PRESETS } from '../constants';
import { buildImageSrc } from '../utils';
import styles from '../styles/DamageTypeModal.module.css';

export default function DamageTypeModal({ isOpen, onClose, onSave, initialData = {} }) {
  const { enqueueSnackbar } = useSnackbar();
  const [form, setForm] = useState({
    nome: '',
    label: '',
    descricao: '',
    cor: '#888888',
    formula: '',
    ordem: 0,
    ativo: true
  });
  const [saving, setSaving] = useState(false);
  const [iconeFile, setIconeFile] = useState(null);
  const [iconePreview, setIconePreview] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Preencher formulário
      if (initialData._id) {
        setForm({
          nome: initialData.nome || '',
          label: initialData.label || '',
          descricao: initialData.descricao || '',
          cor: initialData.cor || '#888888',
          formula: initialData.formula || '',
          ordem: initialData.ordem || 0,
          ativo: initialData.ativo !== undefined ? initialData.ativo : true
        });

        if (initialData.iconeUrl) {
          setIconePreview(buildImageSrc(initialData.iconeUrl));
        } else {
          setIconePreview('');
        }
      } else {
        setForm({
          nome: '',
          label: '',
          descricao: '',
          cor: '#888888',
          formula: '',
          ordem: 0,
          ativo: true
        });
        setIconePreview('');
      }
      setIconeFile(null);
    }
  }, [initialData, isOpen]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleIconeChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setIconeFile(file);
      setIconePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveIcone = async () => {
    if (initialData._id && initialData.iconeUrl) {
      try {
        await api.delete(`/damage-types/${initialData._id}/icon`);
        enqueueSnackbar('Ícone removido', { variant: 'success' });
      } catch {
        enqueueSnackbar('Erro ao remover ícone', { variant: 'error' });
      }
    }
    setIconeFile(null);
    setIconePreview('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append('nome', form.nome.trim().toLowerCase());
      formData.append('label', form.label.trim());
      formData.append('descricao', form.descricao.trim());
      formData.append('cor', form.cor);
      formData.append('formula', form.formula.trim());
      formData.append('ordem', form.ordem);
      formData.append('ativo', form.ativo);

      if (iconeFile) {
        formData.append('icone', iconeFile);
      }

      await onSave(formData, initialData._id);
      onClose();
    } catch (err) {
      // Erro já tratado no hook
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData._id ? 'Editar Tipo de Dano' : 'Novo Tipo de Dano'}
      size={MODAL_SIZES.MEDIUM}
      closeOnOverlayClick
    >
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          <div className={styles.modalBody}>
            {/* Identificação */}
            <div className={styles.row}>
              <div className={styles.field}>
                <label>Nome (slug)</label>
                <TextInput
                  value={form.nome}
                  onChange={(e) => handleChange('nome', e.target.value)}
                  placeholder="ex: fire, ice, poison"
                  required
                  disabled={saving}
                />
              </div>

              <div className={styles.field}>
                <label>Label (exibição)</label>
                <TextInput
                  value={form.label}
                  onChange={(e) => handleChange('label', e.target.value)}
                  placeholder="ex: Fogo, Gelo, Veneno"
                  required
                  disabled={saving}
                />
              </div>
            </div>

            {/* Descrição */}
            <div className={styles.field}>
              <label>Descrição</label>
              <TextArea
                value={form.descricao}
                onChange={(e) => handleChange('descricao', e.target.value)}
                placeholder="Descrição do tipo de dano..."
                rows={3}
                disabled={saving}
              />
            </div>

            {/* Cor */}
            <div className={styles.section}>
              <div className={styles.sectionTitle}>Aparência</div>

              <div className={styles.field}>
                <label>Cor</label>
                <div className={styles.colorPickerWrapper}>
                  <input
                    type="color"
                    className={styles.colorPicker}
                    value={form.cor}
                    onChange={(e) => handleChange('cor', e.target.value)}
                    disabled={saving}
                  />
                  <div className={styles.colorPreview}>
                    <span 
                      className={styles.colorDot}
                      style={{ backgroundColor: form.cor }}
                    />
                    <span className={styles.colorHex}>{form.cor}</span>
                  </div>
                </div>
                <div className={styles.presetColors}>
                  {COLOR_PRESETS.map(preset => (
                    <button
                      key={preset.value}
                      type="button"
                      className={`${styles.presetColor} ${form.cor === preset.value ? styles.selected : ''}`}
                      style={{ backgroundColor: preset.value }}
                      onClick={() => handleChange('cor', preset.value)}
                      title={preset.label}
                      disabled={saving}
                    />
                  ))}
                </div>
              </div>

              {/* Ícone */}
              <div className={styles.field}>
                <label>Ícone</label>
                <PhotoInput
                  file={iconeFile}
                  previewUrl={iconePreview}
                  onFileChange={handleIconeChange}
                  onRemove={handleRemoveIcone}
                  disabled={saving}
                  placeholderLabel="Escolher ícone"
                />
              </div>
            </div>

            {/* Fórmula de Cálculo */}
            <div className={styles.section}>
              <div className={styles.sectionTitle}>Fórmula de Cálculo de Dano</div>

              <div className={styles.field}>
                <label>Fórmula</label>
                <TextInput
                  value={form.formula}
                  onChange={(e) => handleChange('formula', e.target.value)}
                  placeholder="ex: p_atk - target.p_def"
                  disabled={saving}
                />
                <p style={{ fontSize: '0.75rem', color: 'var(--light-1)', marginTop: '0.25rem', lineHeight: '1.4' }}>
                  Fórmula completa de dano. Use <code style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 4px', borderRadius: '2px' }}>base_damage</code> para dano da skill, stats do atacante (STR, p_atk) e do defensor com <code style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 4px', borderRadius: '2px' }}>target.</code> (target.p_def, target.CON).
                </p>
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--light)', marginTop: '0.5rem', padding: '0.75rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px', lineHeight: '1.6' }}>
                <strong style={{ color: 'var(--gold)' }}>Exemplos:</strong><br/>
                • <strong>Físico:</strong> <code style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '2px', color: 'var(--light)' }}>p_atk - target.p_def</code><br/>
                • <strong>Mágico:</strong> <code style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '2px', color: 'var(--light)' }}>m_atk - target.m_def</code><br/>
                • <strong>Verdadeiro:</strong> <code style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '2px', color: 'var(--light)' }}>base_damage</code><br/>
                • <strong>Fogo:</strong> <code style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '2px', color: 'var(--light)' }}>(m_atk + (INT * 0.5)) - (target.m_def * 0.8)</code>
              </div>
            </div>

            {/* Configurações */}
            <div className={styles.section}>
              <div className={styles.sectionTitle}>Configurações</div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label>Ordem de exibição</label>
                  <TextInput
                    type="number"
                    value={form.ordem}
                    onChange={(e) => handleChange('ordem', parseInt(e.target.value) || 0)}
                    disabled={saving}
                  />
                </div>

                <div className={styles.checkboxField}>
                  <input
                    type="checkbox"
                    id="ativo"
                    checked={form.ativo}
                    onChange={(e) => handleChange('ativo', e.target.checked)}
                    disabled={saving}
                  />
                  <label htmlFor="ativo">Ativo</label>
                </div>
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
            type="button"
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
            {saving ? 'Salvando...' : 'Salvar'}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
