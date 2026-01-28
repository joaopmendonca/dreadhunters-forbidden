import React, { useContext } from 'react';
import { useSnackbar } from 'notistack';
import { AuthContext } from '../../../shared/contexts/AuthContext';
import { useSettings } from '../hooks/useSettings';
import { MESSAGES } from '../constants';
import { SettingsPage } from './index';

export default function Settings() {
  const { logout } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const { state, functions } = useSettings({ onLogout: logout });

  console.log('Settings state:', state);

  const handleServerChange = async (slug) => {
    if (!slug) {
      functions.setSelectedSlug('');
      return;
    }
    try {
      functions.setSelectedSlug(slug);
      await functions.loadConfig(slug);
    } catch {
      enqueueSnackbar(MESSAGES.ERROR_LOAD, { variant: 'error' });
    }
  };

  const handleConfigChange = (key, value) => {
    functions.setConfig({
      ...state.config,
      [key]: value,
    });
  };

  const handleSave = async () => {
    if (!state.selectedSlug) {
      enqueueSnackbar(MESSAGES.SELECT_PROMPT, { variant: 'warning' });
      return;
    }
    try {
      await functions.saveConfig(state.selectedSlug, state.config);
      enqueueSnackbar(MESSAGES.SAVE_SUCCESS, { variant: 'success' });
    } catch {
      enqueueSnackbar(MESSAGES.ERROR_SAVE, { variant: 'error' });
    }
  };

  return (
    <SettingsPage
      servers={state.servers}
      config={state.config}
      loadingServers={state.loadingServers}
      loading={state.loading}
      saving={state.saving}
      selectedSlug={state.selectedSlug}
      onServerChange={handleServerChange}
      onConfigChange={handleConfigChange}
      onSave={handleSave}
    />
  );
}
