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

  const handleResetToDefaults = () => {
    const defaultConfig = {
      ...state.config,
      maxCharactersPerUser: 3,
      allowDuplicateNames: false,
      initialStatPoints: 6,
      maxStatPointsPerClass: 18,
      baselinePerStat: 1,
      minStatValue: 1,
      maxStatValue: 24,
      statPointsPerLevel: 1,
      statPointsLevelInterval: 2,
      maxLevel: 99,
      minutesPerUnit: 1,
      questQueueSize: 3,
      movementSpeedStatKey: 'dex',
    };
    functions.setConfig(defaultConfig);
    enqueueSnackbar('Valores resetados para os padrões recomendados. Clique em Salvar para aplicar.', { variant: 'info' });
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
      onResetToDefaults={handleResetToDefaults}
    />
  );
}
