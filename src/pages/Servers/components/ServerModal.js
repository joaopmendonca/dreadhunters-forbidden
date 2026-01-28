import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useSnackbar } from 'notistack';
import Modal, { MODAL_SIZES, COLUMN_LAYOUTS } from '../../../shared/components/Modal';
import TextInput from '../../../shared/components/TextInput';
import Select from '../../../shared/components/Select';
import Button from '../../../shared/components/Button';
import { STATUS_OPTIONS } from '../constants';
import styles from '../styles/ServerModal.module.css';

const emptyForm = {
  _id: '',
  name: '',
  slug: '',
  secret: '',
  maxPlayers: 100,
  region: '',
  status: 'online',
};

export const ServerModal = ({ isOpen, onClose, onSave, initialData = null }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) setForm({ ...initialData });
      else setForm(emptyForm);
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={form._id ? 'Editar Servidor' : 'Novo Servidor'}
      size={MODAL_SIZES.LARGE}
    >
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          <div className={styles.field}>
            <label>Nome</label>
            <TextInput
              value={form.name}
              onChange={(e) => changeField('name', e.target.value)}
              placeholder="Nome do servidor"
              disabled={saving}
              required
            />
          </div>

          <div className={styles.field}>
            <label>Slug</label>
            <TextInput
              value={form.slug}
              onChange={(e) => changeField('slug', e.target.value)}
              placeholder="Identificador único"
              disabled={!!form._id || saving}
              required
            />
          </div>

          <div className={styles.field}>
            <label>Secret</label>
            <TextInput
              type="password"
              value={form.secret}
              onChange={(e) => changeField('secret', e.target.value)}
              placeholder="Senha de acesso"
              disabled={saving}
              required
            />
          </div>

          <div className={styles.field}>
            <label>Status</label>
            <Select
              value={form.status}
              onChange={(e) => changeField('status', e.target.value)}
              options={STATUS_OPTIONS}
              disabled={saving}
            />
          </div>

          <div className={styles.field}>
            <label>Máx. Jogadores</label>
            <TextInput
              type="number"
              value={form.maxPlayers}
              onChange={(e) => changeField('maxPlayers', +e.target.value)}
              min={1}
              disabled={saving}
              required
            />
          </div>

          <div className={styles.field}>
            <label>Região</label>
            <TextInput
              value={form.region}
              onChange={(e) => changeField('region', e.target.value)}
              placeholder="Região do servidor"
              disabled={saving}
            />
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button
            type="button"
            backgroundColor="var(--dark-200)"
            textColor="var(--light)"
            hoverColor="var(--dark-100)"
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
            {saving ? 'Salvando…' : 'Salvar'}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};
