import React, { useEffect, useMemo, useRef, useState } from 'react';
import { buildImgSrc } from '../utils';
import styles from '../styles/PlayableCharacters.module.css';

const mapToObj = (m) => (m instanceof Map ? Object.fromEntries(m) : m || {});

// Linha de detalhe curta por tipo de item.
function describeItem(item) {
  if (!item) return '';
  if (item.type === 'equipment') {
    const eq = item.equipment || {};
    const stats = mapToObj(eq.combatStats);
    const top = Object.entries(stats)
      .filter(([, v]) => Number(v))
      .slice(0, 3)
      .map(([k, v]) => `${k} ${v > 0 ? '+' : ''}${v}`)
      .join('  ');
    const bits = [eq.slot && eq.slot !== 'none' ? eq.slot : null, eq.hands ? `${eq.hands}m` : null, eq.ammoMax ? `mun ${eq.ammoMax}` : null]
      .filter(Boolean)
      .join(' · ');
    return [bits, top].filter(Boolean).join('  —  ');
  }
  if (item.type === 'consumable') {
    const c = item.consumable || {};
    const parts = [];
    if (c.hpRestore) parts.push(`+${c.hpRestore} HP`);
    if (c.mpRestore) parts.push(`+${c.mpRestore} SP`);
    const mods = mapToObj(c.statsModifiers);
    Object.entries(mods).slice(0, 2).forEach(([k, v]) => {
      const val = v && typeof v === 'object' ? v.value : v;
      if (val) parts.push(`${k} ${val > 0 ? '+' : ''}${val}${v?.type === 'percent' ? '%' : ''}`);
    });
    if (c.revivesIncapacitated) parts.push('revive incapacitado');
    return parts.join('  ·  ');
  }
  return item.rarity || '';
}

export default function ItemPicker({ value, items = [], onChange, placeholder = '— nenhum —', disabled = false }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const rootRef = useRef(null);

  const selected = useMemo(() => items.find((i) => String(i._id) === String(value)) || null, [items, value]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? items.filter((i) => (i.name || '').toLowerCase().includes(q)) : items;
  }, [items, query]);

  useEffect(() => {
    if (!open) return undefined;
    const onDocClick = (e) => { if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const pick = (id) => { onChange(id || ''); setOpen(false); setQuery(''); };

  return (
    <div className={styles.itemPicker} ref={rootRef}>
      <button
        type="button"
        className={styles.itemPickerTrigger}
        onClick={() => !disabled && setOpen((o) => !o)}
        disabled={disabled}
      >
        {selected ? (
          <>
            <span className={styles.itemThumb}>
              {selected.iconUrl
                ? <img src={buildImgSrc(selected.iconUrl)} alt="" />
                : <span className={styles.itemThumbFallback}>{selected.type === 'consumable' ? '🧪' : '🗡️'}</span>}
            </span>
            <span className={styles.itemMeta}>
              <span className={styles.itemName}>{selected.name}</span>
              <span className={styles.itemDetail}>{describeItem(selected)}</span>
            </span>
          </>
        ) : (
          <span className={styles.itemPlaceholder}>{placeholder}</span>
        )}
        <span className={styles.itemArrow} />
      </button>

      {open && (
        <div className={styles.itemPickerPanel}>
          <input
            className={styles.itemSearch}
            autoFocus
            placeholder="🔍 buscar item…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className={styles.itemList}>
            <button type="button" className={styles.itemRow} onClick={() => pick('')}>
              <span className={styles.itemThumb}><span className={styles.itemThumbFallback}>∅</span></span>
              <span className={styles.itemMeta}><span className={styles.itemName}>{placeholder}</span></span>
            </button>
            {filtered.map((it) => (
              <button
                type="button"
                key={it._id}
                className={`${styles.itemRow} ${String(it._id) === String(value) ? styles.itemRowActive : ''}`}
                onClick={() => pick(it._id)}
              >
                <span className={styles.itemThumb}>
                  {it.iconUrl
                    ? <img src={buildImgSrc(it.iconUrl)} alt="" />
                    : <span className={styles.itemThumbFallback}>{it.type === 'consumable' ? '🧪' : '🗡️'}</span>}
                </span>
                <span className={styles.itemMeta}>
                  <span className={styles.itemName}>{it.name}</span>
                  <span className={styles.itemDetail}>{describeItem(it)}</span>
                </span>
              </button>
            ))}
            {filtered.length === 0 && <div className={styles.itemEmpty}>nada encontrado</div>}
          </div>
        </div>
      )}
    </div>
  );
}
