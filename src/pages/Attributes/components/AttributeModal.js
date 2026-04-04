import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import Modal, { MODAL_SIZES, COLUMN_LAYOUTS } from '../../../shared/components/Modal';
import TextInput from '../../../shared/components/TextInput';
import TextArea from '../../../shared/components/TextArea';
import Select from '../../../shared/components/Select';
import PhotoInput from '../../../shared/components/PhotoInput';
import Button from '../../../shared/components/Button';
import api from '../../../config/api';
import { TIPO_OPTIONS } from '../constants';
import styles from '../styles/AttributeModal.module.css';

export function AttributeModal({
  isOpen,
  onClose,
  onSave,
  initialData = {}
}) {
  const { enqueueSnackbar } = useSnackbar();
  const [form, setForm] = useState({
    nome: '',
    label: '',
    tipo: 'base',
    descricao: '',
    unidade: 'pontos',
    formula: '',
    corHex: '#BCBCBC',
    iconeUrl: '',
    visivel: true,
    ordem: 0
  });
  const [iconFile, setIconFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm({
      nome: initialData.nome || '',
      label: initialData.label || '',
      tipo: initialData.tipo || 'base',
      descricao: initialData.descricao || '',
      unidade: initialData.unidade || 'pontos',
      formula: initialData.formula || '',
      corHex: initialData.corHex || '#BCBCBC',
      iconeUrl: initialData.iconeUrl || '',
      visivel: initialData.visivel !== undefined ? initialData.visivel : true,
      ordem: initialData.ordem || 0
    });
    
    if (initialData.iconeUrl) {
      const baseURL = api.defaults.baseURL.replace(/\/api\/?$/, '');
      const url = initialData.iconeUrl.startsWith('http') 
        ? initialData.iconeUrl 
        : `${baseURL}${initialData.iconeUrl}`;
      setPreviewUrl(url);
    } else {
      setPreviewUrl('');
      setIconFile(null);
    }
  }, [initialData, isOpen]);

  const handleChange = (field, val) =>
    setForm(prev => ({ ...prev, [field]: val }));

  const handleFileChange = e => {
    const f = e.target.files[0];
    if (f) {
      setIconFile(f);
      setPreviewUrl(URL.createObjectURL(f));
    }
  };

  const handleRemoveIcon = () => {
    setIconFile(null);
    setPreviewUrl('');
    handleChange('iconeUrl', '');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('nome', form.nome.trim());
      fd.append('label', form.label.trim() || form.nome.trim());
      fd.append('tipo', form.tipo);
      fd.append('descricao', form.descricao.trim());
      fd.append('unidade', form.unidade);
      fd.append('formula', form.formula);
      fd.append('corHex', (form.corHex || '#BCBCBC').toUpperCase());
      fd.append('visivel', form.visivel);
      fd.append('ordem', form.ordem);
      if (iconFile) fd.append('icone', iconFile);

      await onSave(fd, initialData._id);
      onClose();
    } catch {
      enqueueSnackbar('Falha ao salvar atributo', { variant: 'error' });
    } finally {
      setSaving(false);
      if (previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData._id ? 'Editar Atributo' : 'Novo Atributo'}
      size={MODAL_SIZES.FULL}
      closeOnOverlayClick
    >
      <form onSubmit={handleSubmit}>
        <Modal.Body columns={COLUMN_LAYOUTS.DOUBLE}>
          {/* Coluna Esquerda - Informações Básicas */}
          <div className={styles.column}>
            <div className={styles.section}>
              <span className={styles.sectionTitle}>Identidade</span>

              <div className={styles.field}>
                <label>Nome (interno)</label>
                <TextInput
                  value={form.nome}
                  onChange={e => handleChange('nome', e.target.value)}
                  placeholder="Ex: vida, forca, defesa"
                  required
                  disabled={saving}
                />
              </div>

              <div className={styles.field}>
                <label>Label (exibição)</label>
                <TextInput
                  value={form.label}
                  onChange={e => handleChange('label', e.target.value)}
                  placeholder="Ex: Vida, Força, Defesa"
                  required
                  disabled={saving}
                />
              </div>

              <div className={styles.field}>
                <label>Tipo</label>
                <Select
                  value={form.tipo}
                  onChange={val => handleChange('tipo', val)}
                  options={TIPO_OPTIONS}
                  disabled={saving}
                />
              </div>

              <div className={styles.field}>
                <label>Descrição</label>
                <TextArea
                  value={form.descricao}
                  onChange={e => handleChange('descricao', e.target.value)}
                  placeholder="Descrição do atributo"
                  rows={4}
                  disabled={saving}
                />
              </div>
            </div>

            <div className={styles.section}>
              <span className={styles.sectionTitle}>Configuração</span>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label>Unidade</label>
                  <TextInput
                    value={form.unidade}
                    onChange={e => handleChange('unidade', e.target.value)}
                    placeholder="Ex: pontos, %"
                    disabled={saving}
                  />
                </div>

                <div className={styles.field}>
                  <label>Ordem</label>
                  <TextInput
                    type="number"
                    min={0}
                    value={form.ordem}
                    onChange={e => handleChange('ordem', +e.target.value)}
                    disabled={saving}
                  />
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label>Cor (picker)</label>
                  <input
                    type="color"
                    value={form.corHex || '#BCBCBC'}
                    onChange={e => handleChange('corHex', (e.target.value || '#BCBCBC').toUpperCase())}
                    disabled={saving}
                  />
                </div>

                <div className={styles.field}>
                  <label>Cor HEX</label>
                  <TextInput
                    value={form.corHex || ''}
                    onChange={e => handleChange('corHex', e.target.value.toUpperCase())}
                    placeholder="#BCBCBC"
                    disabled={saving}
                  />
                </div>
              </div>

              <label className={styles.checkField}>
                <input
                  type="checkbox"
                  checked={form.visivel}
                  onChange={e => handleChange('visivel', e.target.checked)}
                  disabled={saving}
                />
                Visível
              </label>
            </div>
          </div>

          {/* Coluna Direita - Visuais */}
          <div className={styles.column}>
            <div className={styles.section}>
              <span className={styles.sectionTitle}>Visuais</span>

              <div className={styles.field}>
                <label>Ícone do Atributo</label>
                <PhotoInput
                  file={iconFile}
                  previewUrl={previewUrl}
                  onFileChange={handleFileChange}
                  onRemove={handleRemoveIcon}
                  disabled={saving}
                  placeholderLabel="Escolher imagem"
                />
              </div>
            </div>

            {form.tipo === 'derivado' && (
              <div className={styles.section}>
                <span className={styles.sectionTitle}>Fórmula</span>

                <div className={styles.field}>
                  <label>Fórmula de Cálculo (opcional)</label>
                  <TextArea
                    value={form.formula}
                    onChange={e => handleChange('formula', e.target.value)}
                    placeholder="Ex: forca * 2 + nivel"
                    rows={4}
                    disabled={saving}
                  />
                </div>
              </div>
            )}
          </div>
        </Modal.Body>
      </form>

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
          onClick={handleSubmit}
        >
          {saving ? 'Salvando…' : 'Salvar'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
