import React from 'react';
import { FaServer } from 'react-icons/fa';
import { BeatLoader } from 'react-spinners';
import styles from '../styles/ServerSelector.module.css';

export const ServerSelector = ({
  servers,
  selectedSlug,
  onServerChange,
  loading,
  disabled,
}) => {
  return (
    <div className={styles.container}>
      <label>
        <FaServer className={styles.icon} />
        Servidor:
      </label>
      <select
        value={selectedSlug}
        onChange={(e) => onServerChange(e.target.value)}
        disabled={disabled}
        className={styles.select}
      >
        <option value="">— selecione um servidor —</option>
        {servers.map((s) => (
          <option key={s.slug} value={s.slug}>
            {s.name} ({s.slug})
          </option>
        ))}
      </select>
      {loading && <BeatLoader size={8} color="var(--gold)" />}
    </div>
  );
};
