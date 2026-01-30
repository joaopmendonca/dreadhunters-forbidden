import React from 'react';
import { FaUsers, FaGamepad, FaDice, FaMap } from 'react-icons/fa';
import styles from '../styles/SettingsSection.module.css';

const SECTION_ICONS = {
  FaUsers: <FaUsers className={styles.sectionIcon} />,
  FaGamepad: <FaGamepad className={styles.sectionIcon} />,
  FaDice: <FaDice className={styles.sectionIcon} />,
  FaMap: <FaMap className={styles.sectionIcon} />,
};

export const SettingsSection = ({ section, config, onConfigChange, disabled }) => {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        {SECTION_ICONS[section.icon]}
        <h3 className={styles.sectionTitle}>{section.title}</h3>
      </div>
      <div className={styles.sectionBody}>
        {section.fields.map((field) => (
          <div
            key={field.key}
            className={
              field.type === 'checkbox'
                ? styles.checkboxRow
                : styles.formRow
            }
          >
            {field.type === 'checkbox' ? (
              <>
                <label>{field.label}</label>
                <label className={styles.toggle}>
                  <input
                    type="checkbox"
                    checked={!!config[field.key]}
                    onChange={(e) =>
                      onConfigChange(field.key, e.target.checked)
                    }
                    disabled={disabled}
                  />
                  <span className={styles.toggleSlider}></span>
                </label>
              </>
            ) : (
              <>
                <label>{field.label}</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
                  <input
                    type={field.type}
                    value={config[field.key] !== undefined && config[field.key] !== null ? config[field.key] : (field.type === 'number' ? 0 : '')}
                    onChange={(e) => {
                      const val =
                        field.type === 'number'
                          ? field.step
                            ? parseFloat(e.target.value || '0')
                            : parseInt(e.target.value || '0', 10)
                          : e.target.value;
                      onConfigChange(field.key, val);
                    }}
                    disabled={disabled}
                    min={field.min}
                    step={field.step}
                    className={styles.input}
                  />
                  {field.helpText && (
                    <small style={{ fontSize: '0.75rem', color: 'var(--light-1)', opacity: 0.8 }}>
                      {field.helpText}
                    </small>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
