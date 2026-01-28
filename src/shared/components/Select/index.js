// src/components/Select.jsx
import React from 'react';
import PropTypes from 'prop-types';
import styles from './Select.module.css';

/**
 * Select com suporte a ícone na opção selecionada.
 * - Por padrão, onChange envia apenas o valor primitivo (`option.value`).
 * - Se returnObject for true, onChange envia o objeto option completo.
 */
export default function Select({
  value,
  onChange,
  options,
  className = '',
  returnObject = false,
  ...rest
}) {
  // A opção atualmente selecionada (pode ser undefined)
  const selected = options.find(opt => opt.value === value);

  const handleChange = (e) => {
    // Se vier um evento de <select>, usamos e.target.value; 
    // senão, assumimos que 'e' já é o próprio valor/válo do <option>.
    const raw = e?.target?.value ?? e;

    // Procura o objeto de opção cujo value (string) bate com raw (string)
    const opt = options.find(o => String(o.value) === String(raw));

    // Dispara onChange com o objeto (ou apenas com o value), conforme flag:
    if (returnObject) {
      onChange(opt);
    } else {
      onChange(opt?.value ?? null);
    }
  };

  return (
    <div className={`${styles.wrapper} ${className}`}>
      {/* Se a opção atual tiver iconUrl, exibe ao lado */}
      {selected?.iconUrl && (
        <img
          src={selected.iconUrl}
          alt=""
          className={styles.selectedIcon}
        />
      )}

      <select
        value={value}
        onChange={handleChange}
        className={styles.select}
        {...rest}
      >
        {options.map(opt => (
          <option key={opt.value ?? opt.label} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <span className={styles.arrow} />
    </div>
  );
}

Select.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value:    PropTypes.any,
      label:    PropTypes.string.isRequired,
      iconUrl:  PropTypes.string,
    })
  ).isRequired,
  className: PropTypes.string,
  /** Se true, onChange recebe o objeto option completo. */
  returnObject: PropTypes.bool,
};
