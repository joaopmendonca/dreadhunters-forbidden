import React from 'react';
import { FaSave, FaUndo } from 'react-icons/fa';
import Button from '../../../shared/components/Button';
import styles from '../styles/SettingsActions.module.css';

export const SettingsActions = ({ onSave, onResetToDefaults, disabled }) => {
  return (
    <div className={styles.actions}>
      <Button
        backgroundColor="var(--dark-3)"
        textColor="var(--light-1)"
        hoverColor="var(--dark-2)"
        icon={<FaUndo />}
        onClick={onResetToDefaults}
        disabled={disabled}
        className={styles.resetButton}
      >
        Resetar Padrões
      </Button>
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
