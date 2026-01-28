import React from 'react';
import BaseLayout from '../../../shared/components/BaseLayout';
import FullScreenLoader from '../../../shared/components/FullScreenLoader';
import { ServerSelector } from './ServerSelector';
import { SettingsHint } from './SettingsHint';
import { SettingsSection } from './SettingsSection';
import { SettingsActions } from './SettingsActions';
import { SETTINGS_SECTIONS, MESSAGES } from '../constants';
import styles from '../styles/Settings.module.css';

export const SettingsPage = ({
  servers,
  config,
  loadingServers,
  loading,
  saving,
  selectedSlug,
  onServerChange,
  onConfigChange,
  onSave,
}) => {
  const isLoading = loadingServers || loading || saving;
  const loadingMessage = loadingServers
    ? MESSAGES.LOADING_SERVERS
    : loading
    ? MESSAGES.LOADING_CONFIG
    : MESSAGES.SAVING;

  return (
    <BaseLayout title="Configurações do Servidor">
      <FullScreenLoader visible={isLoading} message={loadingMessage} />

      <div className={styles.container}>
        <ServerSelector
          servers={servers}
          selectedSlug={selectedSlug}
          onServerChange={onServerChange}
          loading={loading}
          disabled={saving}
        />

        {!selectedSlug ? (
          <SettingsHint message={MESSAGES.SELECT_SERVER} />
        ) : (
          <>
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
              disabled={loading || saving}
            />
          </>
        )}
      </div>
    </BaseLayout>
  );
};
