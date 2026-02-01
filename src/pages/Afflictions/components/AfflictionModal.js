import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { useSnackbar } from 'notistack';
import Modal, { MODAL_SIZES, COLUMN_LAYOUTS } from '../../../shared/components/Modal';
import TextInput from '../../../shared/components/TextInput';
import TextArea from '../../../shared/components/TextArea';
import Select from '../../../shared/components/Select';
import Button from '../../../shared/components/Button';
import IconButton from '../../../shared/components/IconButton';
import PhotoInput from '../../../shared/components/PhotoInput';
import api from '../../../config/api';
import { TIPO_OPTIONS } from '../constants';
import styles from '../styles/AfflictionModal.module.css';

export default function AfflictionModal({ isOpen, onClose, onSave, initialData = {} }) {
  const { enqueueSnackbar } = useSnackbar();
  const [form, setForm] = useState({
    nome: '',
    tipo: 'mental',
    descricao: '',
    imagemUrl: '',
    niveis: [
      { severidade: 'leve', penalidades: [] },
      { severidade: 'media', penalidades: [] },
      { severidade: 'grave', penalidades: [] }
    ],
    ordem: 0,
    ativo: true
  });
  const [saving, setSaving] = useState(false);
  const [imagemFile, setImagemFile] = useState(null);
  const [imagemPreview, setImagemPreview] = useState('');
  const [statusList, setStatusList] = useState([]);

  useEffect(() => {
    if (isOpen) {
      api.get('/status').then(({ data }) => {
        setStatusList(data.map(s => ({
          value: s._id,
          label: s.label || s.nome
        })));
      }).catch(() => {
        setStatusList([]);
      });

      if (initialData._id) {
        setForm({
          nome: initialData.nome || '',
          tipo: initialData.tipo || 'mental',
          descricao: initialData.descricao || '',
          imagemUrl: initialData.imagemUrl || '',
          niveis: (initialData.niveis || [
            { severidade: 'leve', penalidades: [] },
            { severidade: 'media', penalidades: [] },
            { severidade: 'grave', penalidades: [] }
          ]).map(n => ({
            severidade: n.severidade,
            penalidades: (n.penalidades || []).map(p => ({
              status: typeof p.status === 'object' ? p.status._id : p.status,
              modificador: p.modificador || ''
            }))
          })),
          ordem: initialData.ordem || 0,
          ativo: initialData.ativo !== undefined ? initialData.ativo : true
        });

        if (initialData.imagemUrl) {
          const baseURL = api.defaults.baseURL.replace(/\/api\/?$/, '');
          setImagemPreview(initialData.imagemUrl.startsWith('http') ? initialData.imagemUrl : `${baseURL}${initialData.imagemUrl}`);
        } else {
          setImagemPreview('');
        }
      } else {
        setForm({
          nome: '',
          tipo: 'mental',
          descricao: '',
          imagemUrl: '',
          niveis: [
            { severidade: 'leve', penalidades: [] },
            { severidade: 'media', penalidades: [] },
            { severidade: 'grave', penalidades: [] }
          ],
          ordem: 0,
          ativo: true
        });
        setImagemPreview('');
      }
      setImagemFile(null);
    }
  }, [initialData, isOpen]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleImagemChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagemFile(file);
      setImagemPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImagem = () => {
    setImagemFile(null);
    setImagemPreview('');
    handleChange('imagemUrl', '');
  };

  const adicionarPenalidade = (severidade) => {
    setForm(prev => ({
      ...prev,
      niveis: prev.niveis.map(nivel =>
        nivel.severidade === severidade
          ? {
              ...nivel,
              penalidades: [...nivel.penalidades, { status: '', modificador: '' }]
            }
          : nivel
      )
    }));
  };

  const removerPenalidade = (severidade, index) => {
    setForm(prev => ({
      ...prev,
      niveis: prev.niveis.map(nivel =>
        nivel.severidade === severidade
          ? {
              ...nivel,
              penalidades: nivel.penalidades.filter((_, i) => i !== index)
            }
          : nivel
      )
    }));
  };

  const atualizarPenalidade = (severidade, index, campo, valor) => {
    setForm(prev => ({
      ...prev,
      niveis: prev.niveis.map(nivel =>
        nivel.severidade === severidade
          ? {
              ...nivel,
              penalidades: nivel.penalidades.map((pen, i) =>
                i === index ? { ...pen, [campo]: valor } : pen
              )
            }
          : nivel
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const niveisLimpos = form.niveis.map(n => ({
        severidade: n.severidade,
        penalidades: n.penalidades
          .filter(p => p.status && p.status !== '' && p.modificador && p.modificador.trim() !== '')
          .map(p => ({
            status: p.status,
            modificador: p.modificador.trim()
          }))
      }));

      const dadosParaEnviar = {
        nome: form.nome,
        tipo: form.tipo,
        descricao: form.descricao,
        niveis: niveisLimpos,
        ordem: form.ordem,
        ativo: form.ativo
      };

      let dataToSend;

      if (imagemFile) {
        const formData = new FormData();
        formData.append('nome', dadosParaEnviar.nome);
        formData.append('tipo', dadosParaEnviar.tipo);
        formData.append('descricao', dadosParaEnviar.descricao);
        formData.append('niveis', JSON.stringify(dadosParaEnviar.niveis));
        formData.append('ordem', dadosParaEnviar.ordem);
        formData.append('ativo', dadosParaEnviar.ativo);
        formData.append('imagem', imagemFile);
        dataToSend = formData;
      } else {
        dataToSend = form.imagemUrl ? { ...dadosParaEnviar, imagemUrl: form.imagemUrl } : dadosParaEnviar;
      }

      await onSave(dataToSend, initialData._id);
      onClose();
    } catch (err) {
      enqueueSnackbar('Falha ao salvar aflição', { variant: 'error' });
    } finally {
      setSaving(false);
      if (imagemPreview.startsWith('blob:')) URL.revokeObjectURL(imagemPreview);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData._id ? 'Editar Aflição' : 'Nova Aflição'}
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
                <label>Nome da Aflição</label>
                <TextInput
                  value={form.nome}
                  onChange={e => handleChange('nome', e.target.value)}
                  placeholder="Ex: Paranoia, Visão turva"
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
                  placeholder="Descrição detalhada da aflição"
                  rows={4}
                  required
                  disabled={saving}
                />
              </div>
            </div>

            <div className={styles.section}>
              <span className={styles.sectionTitle}>Visuais</span>

              <div className={styles.field}>
                <label>Imagem da Aflição</label>
                <PhotoInput
                  file={imagemFile}
                  previewUrl={imagemPreview}
                  onFileChange={handleImagemChange}
                  onRemove={handleRemoveImagem}
                  accept="image/*"
                  disabled={saving}
                  placeholderLabel="Escolher imagem"
                />
              </div>
            </div>

            <div className={styles.section}>
              <span className={styles.sectionTitle}>Configuração</span>

              <div className={styles.row}>
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

                <label className={styles.checkField}>
                  <input
                    type="checkbox"
                    checked={form.ativo}
                    onChange={e => handleChange('ativo', e.target.checked)}
                    disabled={saving}
                  />
                  Ativa
                </label>
              </div>
            </div>
          </div>

          {/* Coluna Direita - Níveis de Severidade */}
          <div className={styles.column}>

            <div className={styles.section}>
              <span className={styles.sectionTitle}>Níveis de Severidade</span>
              <small className={styles.fieldHint}>Configure as penalidades para cada nível</small>

              <div className={styles.nivelContainer}>
                {form.niveis.map(nivel => {
                  const configs = {
                    leve: { icon: '🟢', nome: 'Leve', cor: 'nivelLeve' },
                    media: { icon: '🟡', nome: 'Médio', cor: 'nivelMedia' },
                    grave: { icon: '🔴', nome: 'Grave', cor: 'nivelGrave' }
                  };
                  const config = configs[nivel.severidade];

                  return (
                    <div key={nivel.severidade} className={`${styles.nivelCard} ${styles[config.cor]}`}>
                      <div className={styles.nivelHeader}>
                        {config.icon} {config.nome}
                      </div>

                      <div className={styles.nivelBody}>
                        {nivel.penalidades.length === 0 ? (
                          <p className={styles.emptyMessage}>Sem penalidades</p>
                        ) : (
                          nivel.penalidades.map((pen, idx) => (
                            <div key={idx} className={styles.penaltyRow}>
                              <div className={styles.penaltySelect}>
                                <Select
                                  value={pen.status || ''}
                                  onChange={val => atualizarPenalidade(nivel.severidade, idx, 'status', val)}
                                  options={[
                                    { value: '', label: '-- Status --' },
                                    ...statusList
                                  ]}
                                  disabled={saving}
                                />
                              </div>
                              <div className={styles.penaltyInput}>
                                <TextInput
                                  value={pen.modificador || ''}
                                  onChange={e => atualizarPenalidade(nivel.severidade, idx, 'modificador', e.target.value)}
                                  placeholder="-20"
                                  disabled={saving}
                                />
                              </div>
                              <IconButton
                                icon={<FaTrash />}
                                onClick={() => removerPenalidade(nivel.severidade, idx)}
                                disabled={saving}
                                hoverColor="#ef4444"
                                title="Remover"
                              />
                            </div>
                          ))
                        )}

                        <Button
                          type="button"
                          onClick={() => adicionarPenalidade(nivel.severidade)}
                          disabled={saving}
                          backgroundColor="transparent"
                          textColor="var(--light)"
                          className={styles.addPenaltyBtn}
                          icon={<FaPlus />}
                        >
                          Adicionar
                        </Button>
                      </div>
                    </div>
                  );
                })}
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
  );
}
