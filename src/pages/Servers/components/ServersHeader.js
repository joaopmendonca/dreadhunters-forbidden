import React from 'react';
import { FaPlus } from 'react-icons/fa';
import Button from '../../../shared/components/Button';
import TextInput from '../../../shared/components/TextInput';
import PageHeader from '../../../shared/components/PageHeader';
import styles from '../styles/ServersHeader.module.css';

export const ServersHeader = ({
  totalServers,
  searchSlug,
  onSearchChange,
  onNew,
}) => {
  return (
    <PageHeader
      statsCounters={[
        { icon: '🖥️', value: totalServers, label: 'Servidores' },
      ]}
      controls={
        <>
          <Button
            backgroundColor="var(--maroon)"
            textColor="var(--light)"
            hoverColor="var(--gold)"
            icon={<FaPlus />}
            onClick={onNew}
          >
            Novo Servidor
          </Button>

          <TextInput
            value={searchSlug}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="🔍 Buscar por slug…"
            className={styles.searchInput}
          />
        </>
      }
    />
  );
};
