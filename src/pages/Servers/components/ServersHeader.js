import React from 'react';
import { FaPlus, FaServer } from 'react-icons/fa';
import Button from '../../../shared/components/Button';
import TextInput from '../../../shared/components/TextInput';
import PageHeader from '../../../shared/components/PageHeader';
import styles from '../styles/ServersHeader.module.css';

export const ServersHeader = ({
  totalServers,
  onlineCount = 0,
  offlineCount = 0,
  searchSlug,
  onSearchChange,
  onNew,
}) => {
  return (
    <PageHeader
      statsCounters={[
        { icon: <FaServer />, value: totalServers, label: 'Total' },
        { icon: '🟢', value: onlineCount, label: 'Online', variant: 'counterGreen' },
        { icon: '🔴', value: offlineCount, label: 'Offline', variant: 'counterMaroon' },
      ]}
      controls={
        <>
          <TextInput
            value={searchSlug}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="🔍 Buscar por slug…"
            className={styles.searchInput}
          />

          <Button
            backgroundColor="var(--maroon)"
            textColor="var(--light)"
            hoverColor="var(--gold)"
            icon={<FaPlus />}
            onClick={onNew}
          >
            Novo Servidor
          </Button>
        </>
      }
    />
  );
};
