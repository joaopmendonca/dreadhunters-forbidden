import React from 'react';
import { FaSave } from 'react-icons/fa';
import Button from '../../../shared/components/Button';
import styles from '../styles/SettingsActions.module.css';

export const SettingsActions = ({ onSave, disabled }) => {
  return (
    <div className={styles.actions}>
      <Button
        backgroundColor="var(--maroon)"
        textColor="var(--light)"
        hoverColor="var(--gold)"
        icon={<FaSave />}
        onClick={onSave}
        disabled={disabled}
        className={styles.saveButton}
      >
        {disabled ? 'Salvando...' : 'Salvar Configurações'}
      </Button>
    </div>
  );
};
