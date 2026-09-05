import React from 'react';
import BaseLayout from '../../../shared/components/BaseLayout';
import FullScreenLoader from '../../../shared/components/FullScreenLoader';
import { SettingsHint } from './SettingsHint';
import { SettingsSection } from './SettingsSection';
import { SettingsActions } from './SettingsActions';
import { SETTINGS_SECTIONS, MESSAGES } from '../constants';
import styles from '../styles/Settings.module.css';

export const SettingsPage = ({
  config,
  loading,
  saving,
  onConfigChange,
  onSave,
  onResetToDefaults,
}) => {
  const isLoading = loading || saving;
  const loadingMessage = loading ? MESSAGES.LOADING_CONFIG : MESSAGES.SAVING;

  return (
    <BaseLayout title="Configuração do Jogo (global)">
      <FullScreenLoader visible={isLoading} message={loadingMessage} />

      <div className={styles.container}>
        <SettingsHint message="Configuração única e global — vale para todos os servidores." />

        {SETTINGS_SECTIONS.map((section) => (
          <SettingsSection
            key={section.id}
            section={section}
            config={config}
            onConfigChange={onConfigChange}
            disabled={loading || saving}
          />
        ))}

        <SettingsActions
          onSave={onSave}
          onResetToDefaults={onResetToDefaults}
          disabled={loading || saving}
        />
      </div>
    </BaseLayout>
  );
};
