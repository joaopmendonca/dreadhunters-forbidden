import React, { useContext } from 'react';
import { useSnackbar } from 'notistack';
import { AuthContext } from '../../../shared/contexts/AuthContext';
import { useSettings } from '../hooks/useSettings';
import { CONFIG_DEFAULTS, MESSAGES } from '../constants';
import { SettingsPage } from './index';

// Config global única do jogo (ver docs/prd-migracao-equipes.md [R12]).
export default function Settings() {
  const { logout } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const { state, functions } = useSettings({ onLogout: logout });

  const handleConfigChange = (key, value) => {
    functions.setConfig({
      ...state.config,
      [key]: value,
    });
  };

  const handleSave = async () => {
    try {
      await functions.saveConfig(state.config);
      enqueueSnackbar(MESSAGES.SAVE_SUCCESS, { variant: 'success' });
    } catch {
      enqueueSnackbar(MESSAGES.ERROR_SAVE, { variant: 'error' });
    }
  };

  const handleResetToDefaults = () => {
    functions.setConfig({ ...state.config, ...CONFIG_DEFAULTS });
    enqueueSnackbar('Valores resetados para os padrões. Clique em Salvar para aplicar.', { variant: 'info' });
  };

  return (
    <SettingsPage
      config={state.config}
      loading={state.loading}
      saving={state.saving}
      onConfigChange={handleConfigChange}
      onSave={handleSave}
      onResetToDefaults={handleResetToDefaults}
    />
  );
}
