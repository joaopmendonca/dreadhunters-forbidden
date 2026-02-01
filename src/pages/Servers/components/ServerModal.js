import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import Modal, { MODAL_SIZES } from '../../../shared/components/Modal';
import TextInput from '../../../shared/components/TextInput';
import TextArea from '../../../shared/components/TextArea';
import Select from '../../../shared/components/Select';
import Button from '../../../shared/components/Button';
import { STATUS_OPTIONS, REGION_OPTIONS } from '../constants';
import styles from '../styles/ServerModal.module.css';

const emptyForm = {
  _id: '',
  name: '',
  slug: '',
  secret: '',
  description: '',
  maxPlayers: 100,
  region: 'sa',
  status: 'online',
};

export const ServerModal = ({ isOpen, onClose, onSave, initialData = null }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setForm({
          ...emptyForm,
          ...initialData,
        });
      } else {
        setForm(emptyForm);
      }
    }
  }, [isOpen, initialData]);

  const changeField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      enqueueSnackbar(
        err.response?.data?.message || 'Falha ao salvar servidor.',
        { variant: 'error' }
      );
    } finally {
      setSaving(false);
    }
  };

  const isEditing = !!form._id;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar Servidor' : 'Novo Servidor'}
      size={MODAL_SIZES.MEDIUM}
      closeOnOverlayClick
    >
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          {/* Seção: Identificação */}
          <div className={styles.section}>
            <span className={styles.sectionTitle}>Identificação</span>
            
            <div className={styles.field}>
              <label>Nome do Servidor</label>
              <TextInput
                value={form.name}
                onChange={(e) => changeField('name', e.target.value)}
                placeholder="Ex: Servidor Principal"
                disabled={saving}
                required
              />
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label>Slug (identificador único)</label>
                <TextInput
                  value={form.slug}
                  onChange={(e) => changeField('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  placeholder="ex: servidor-principal"
                  disabled={isEditing || saving}
                  required
                />
              </div>
              
              <div className={styles.field}>
                <label>Status</label>
                <Select
                  value={form.status}
                  onChange={(val) => changeField('status', val)}
                  options={STATUS_OPTIONS}
                  disabled={saving}
                />
              </div>
            </div>

            <div className={styles.field}>
              <label>Descrição</label>
              <TextArea
                value={form.description}
                onChange={(e) => changeField('description', e.target.value)}
                placeholder="Descrição breve do servidor"
                rows={3}
                disabled={saving}
              />
            </div>
          </div>

          {/* Seção: Segurança */}
          <div className={styles.section}>
            <span className={styles.sectionTitle}>Segurança</span>
            
            <div className={styles.field}>
              <label>Secret (chave de autenticação)</label>
              <TextInput
                type="password"
                value={form.secret}
                onChange={(e) => changeField('secret', e.target.value)}
                placeholder={isEditing ? '••••••••' : 'Chave secreta para autenticação'}
                disabled={saving}
                required={!isEditing}
              />
              {isEditing && (
                <span className={styles.hint}>
                  Deixe em branco para manter a senha atual
                </span>
              )}
            </div>
          </div>

          {/* Seção: Configurações */}
          <div className={styles.section}>
            <span className={styles.sectionTitle}>Configurações</span>
            
            <div className={styles.row}>
              <div className={styles.field}>
                <label>Máx. Jogadores</label>
                <TextInput
                  type="number"
                  value={form.maxPlayers}
                  onChange={(e) => changeField('maxPlayers', Math.max(1, +e.target.value))}
                  min={1}
                  max={10000}
                  disabled={saving}
                  required
                />
              </div>

              <div className={styles.field}>
                <label>Região</label>
                <Select
                  value={form.region}
                  onChange={(val) => changeField('region', val)}
                  options={REGION_OPTIONS}
                  disabled={saving}
                />
              </div>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button
            type="button"
            backgroundColor="var(--dark-3)"
            textColor="var(--light)"
            hoverColor="var(--dark-4)"
            onClick={onClose}
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
            {saving ? 'Salvando…' : (isEditing ? 'Salvar Alterações' : 'Criar Servidor')}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};
