// src/pages/ForbiddenBook/components/TechnicalDetails.js

import styles from '../styles/TechnicalDetails.module.css';

/**
 * Componente para exibir detalhes técnicos de forma organizada
 * @param {Object} props
 * @param {Array} props.sections - Array de seções com { title, items: [{ label, value, hint? }] }
 */
export default function TechnicalDetails({ sections }) {
  if (!sections || sections.length === 0) return null;

  const formatValue = (value) => {
    if (value === null || value === undefined) return '—';
    if (typeof value === 'boolean') return value ? '✓ Sim' : '✗ Não';
    if (Array.isArray(value)) {
      if (value.length === 0) return '—';
      return value.join(', ');
    }
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.headerIcon}>⚙️</span>
        <h5 className={styles.headerTitle}>Detalhes Técnicos</h5>
      </div>

      <div className={styles.sections}>
        {sections.map((section, idx) => (
          <div key={idx} className={styles.section}>
            {section.title && (
              <span className={styles.sectionTitle}>{section.title}</span>
            )}
            <div className={styles.items}>
              {section.items.map((item, itemIdx) => (
                <div key={itemIdx} className={styles.item}>
                  <span className={styles.label}>{item.label}</span>
                  <span className={styles.value}>
                    {item.isCode ? (
                      <code className={styles.code}>{formatValue(item.value)}</code>
                    ) : item.isFormula ? (
                      <code className={styles.formula}>{formatValue(item.value)}</code>
                    ) : item.color ? (
                      <span className={styles.colorValue}>
                        <span 
                          className={styles.colorSwatch} 
                          style={{ backgroundColor: item.value }}
                        />
                        {item.value}
                      </span>
                    ) : (
                      formatValue(item.value)
                    )}
                  </span>
                  {item.hint && (
                    <span className={styles.hint}>{item.hint}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Helpers para construir seções técnicas por tipo de entidade
 */
export const buildClassTechnicalDetails = (item) => [
  {
    title: 'Identificação',
    items: [
      { label: 'ID', value: item._id, isCode: true },
      { label: 'Nome', value: item.name },
      { label: 'Role', value: item.role?.name || '—' },
    ]
  },
  {
    title: 'Recursos',
    items: [
      { label: 'Tipo de Recurso', value: item.resourceType || 'none', hint: 'mana, energy, rage ou none' },
      { label: 'Recurso Base', value: item.resourceBase || 0 },
      { label: 'Regeneração', value: item.resourceRegen || 0, hint: 'por segundo' },
    ]
  },
  {
    title: 'Equipamentos',
    items: [
      { label: 'Slots de Skill', value: item.skillSlots || 3 },
      { label: 'Armas Permitidas', value: item.allowedWeapons || [] },
      { label: 'Armaduras Permitidas', value: item.allowedArmor || [] },
    ]
  },
  {
    title: 'Stats Base',
    items: item.baseStats 
      ? Object.entries(
          item.baseStats instanceof Map ? Object.fromEntries(item.baseStats) : item.baseStats
        ).map(([key, val]) => ({ label: key.toUpperCase(), value: val }))
      : [{ label: 'Nenhum', value: '—' }]
  }
];

export const buildSkillTechnicalDetails = (item) => {
  const sections = [
    {
      title: 'Identificação',
      items: [
        { label: 'ID', value: item._id, isCode: true },
        { label: 'Nome', value: item.name },
        { label: 'Tipo', value: item.type === 'active' ? 'Ativa' : 'Passiva' },
      ]
    },
    {
      title: 'Mecânicas',
      items: [
        { label: 'Cooldown', value: item.cooldown ? `${item.cooldown}s` : 'Nenhum' },
        { label: 'Alvos', value: item.targets || ['enemy'] },
      ]
    }
  ];

  // Custos
  const costItems = [];
  if (item.cost?.resources?.length > 0) {
    item.cost.resources.forEach(r => {
      costItems.push({
        label: r.resource?.toUpperCase() || 'Recurso',
        value: r.type === 'percent' ? `${r.value}%` : r.value,
        hint: r.type === 'percent' ? 'percentual' : 'valor fixo'
      });
    });
  }
  if (costItems.length > 0) {
    sections.push({ title: 'Custos', items: costItems });
  }

  // Dano
  if (item.damage?.formula) {
    sections.push({
      title: 'Sistema de Dano',
      items: [
        { label: 'Tipo de Dano', value: item.damage.type || 'none' },
        { label: 'Fórmula', value: item.damage.formula, isFormula: true },
      ]
    });
  }

  // Efeitos
  const effectItems = [];
  if (item.effects?.hpRestore) effectItems.push({ label: 'Restaura HP', value: item.effects.hpRestore });
  if (item.effects?.mpRestore) effectItems.push({ label: 'Restaura MP', value: item.effects.mpRestore });
  if (item.effects?.buff) {
    effectItems.push({ label: 'Buff', value: item.effects.buff });
    if (item.effects.buffDuration) {
      effectItems.push({ label: 'Duração do Buff', value: `${item.effects.buffDuration}s` });
    }
  }
  if (effectItems.length > 0) {
    sections.push({ title: 'Efeitos', items: effectItems });
  }

  // Duração
  if (item.duration?.type && item.duration.type !== 'instant') {
    sections.push({
      title: 'Duração',
      items: [
        { label: 'Tipo', value: item.duration.type },
        { label: 'Valor', value: item.duration.value || 0 },
      ]
    });
  }

  return sections;
};

export const buildAttributeTechnicalDetails = (item) => [
  {
    title: 'Identificação',
    items: [
      { label: 'ID', value: item._id, isCode: true },
      { label: 'Código', value: item.nome?.toUpperCase(), isCode: true },
      { label: 'Nome de Exibição', value: item.label },
    ]
  },
  {
    title: 'Configuração',
    items: [
      { label: 'Tipo', value: item.tipo === 'base' ? 'Base (primário)' : 'Derivado (calculado)' },
      { label: 'Unidade', value: item.unidade || 'pontos' },
      { label: 'Ordem de Exibição', value: item.ordem || 0 },
      { label: 'Visível', value: item.visivel !== false },
    ]
  },
  ...(item.formula ? [{
    title: 'Cálculo',
    items: [
      { label: 'Fórmula', value: item.formula, isFormula: true, hint: 'Usada para calcular o valor final' },
    ]
  }] : [])
];

export const buildAfflictionTechnicalDetails = (item) => {
  const sections = [
    {
      title: 'Identificação',
      items: [
        { label: 'ID', value: item._id, isCode: true },
        { label: 'Nome', value: item.nome },
        { label: 'Tipo', value: item.tipo === 'mental' ? 'Mental' : 'Física' },
      ]
    },
    {
      title: 'Configuração',
      items: [
        { label: 'Ordem', value: item.ordem || 0 },
        { label: 'Ativo', value: item.ativo !== false },
      ]
    }
  ];

  // Níveis de severidade
  if (item.niveis?.length > 0) {
    item.niveis.forEach(nivel => {
      const penItems = nivel.penalidades?.map(p => ({
        label: p.status?.label || p.status?.nome || 'Status',
        value: p.modificador,
        isCode: true
      })) || [];
      
      if (penItems.length > 0) {
        sections.push({
          title: `Penalidades - ${nivel.severidade === 'leve' ? 'Leve' : nivel.severidade === 'media' ? 'Média' : 'Grave'}`,
          items: penItems
        });
      }
    });
  }

  return sections;
};

export const buildDamageTypeTechnicalDetails = (item) => [
  {
    title: 'Identificação',
    items: [
      { label: 'ID', value: item._id, isCode: true },
      { label: 'Código', value: item.nome?.toUpperCase(), isCode: true },
      { label: 'Nome de Exibição', value: item.label },
    ]
  },
  {
    title: 'Visual',
    items: [
      { label: 'Cor', value: item.cor || '#ffffff', color: true },
      { label: 'Ícone URL', value: item.iconeUrl || '—' },
    ]
  },
  {
    title: 'Configuração',
    items: [
      { label: 'Ordem', value: item.ordem || 0 },
      { label: 'Ativo', value: item.ativo !== false },
    ]
  },
  ...(item.formula ? [{
    title: 'Cálculo de Dano',
    items: [
      { label: 'Fórmula', value: item.formula, isFormula: true, hint: 'Variáveis: p_atk, m_atk, target.p_def, target.m_def, etc.' },
    ]
  }] : [])
];

export const buildItemTechnicalDetails = (item) => {
  const sections = [
    {
      title: 'Identificação',
      items: [
        { label: 'ID', value: item._id, isCode: true },
        { label: 'Nome', value: item.name },
        { label: 'Tipo', value: item.type },
        { label: 'Raridade', value: item.rarity },
      ]
    },
    {
      title: 'Economia',
      items: [
        { label: 'Preço de Compra', value: item.buyPrice || 0 },
        { label: 'Preço de Venda', value: item.sellPrice || 0 },
        { label: 'Empilhável', value: item.stackable !== false },
        { label: 'Pilha Máxima', value: item.maxStack || 99 },
      ]
    },
    {
      title: 'Requisitos',
      items: [
        { label: 'Nível Mínimo', value: item.requirements?.level || 1 },
        { label: 'Classes', value: item.requirements?.classes?.map(c => c.name || c).join(', ') || 'Todas' },
      ]
    }
  ];

  // Consumíveis
  if (item.type === 'consumable' && item.consumable) {
    const modItems = [];
    if (item.consumable.statsModifiers) {
      const mods = item.consumable.statsModifiers instanceof Map 
        ? Object.fromEntries(item.consumable.statsModifiers)
        : item.consumable.statsModifiers;
      Object.entries(mods).forEach(([key, mod]) => {
        modItems.push({
          label: key.toUpperCase(),
          value: mod.type === 'percent' ? `${mod.value}%` : `+${mod.value}`,
        });
      });
    }
    if (modItems.length > 0) {
      sections.push({ title: 'Modificadores', items: modItems });
    }
  }

  // Equipamentos
  if (item.type === 'equipment' && item.equipment) {
    sections.push({
      title: 'Equipamento',
      items: [
        { label: 'Slot', value: item.equipment.slot || '—' },
        { label: 'Tipo de Arma', value: item.equipment.weaponType || '—' },
        { label: 'Mãos', value: item.equipment.hands || 1 },
      ]
    });
  }

  return sections;
};

export const buildEnemyTechnicalDetails = (item) => {
  const sections = [
    {
      title: 'Identificação',
      items: [
        { label: 'ID', value: item._id, isCode: true },
        { label: 'Nome', value: item.name },
        { label: 'Tipo', value: item.type === 'normal' ? 'Normal' : item.type === 'elite' ? 'Elite' : 'Boss' },
        { label: 'Nível', value: item.level || 1 },
      ]
    },
    {
      title: 'Comportamento',
      items: [
        { label: 'IA', value: item.aiType === 'passive' ? 'Passivo' : item.aiType === 'defensive' ? 'Defensivo' : 'Agressivo' },
        { label: 'Taxa de Spawn', value: `${(item.spawnRate || 1) * 100}%` },
      ]
    },
    {
      title: 'Recompensas',
      items: [
        { label: 'XP', value: item.xpReward || 0 },
        { label: 'Itens no Loot', value: item.lootTable?.length || 0 },
        { label: 'Moedas no Loot', value: item.currencyLoot?.length || 0 },
      ]
    }
  ];

  // Stats
  if (item.stats) {
    const statsObj = item.stats instanceof Map ? Object.fromEntries(item.stats) : item.stats;
    const statsItems = Object.entries(statsObj).map(([key, val]) => ({
      label: key.toUpperCase(),
      value: val
    }));
    if (statsItems.length > 0) {
      sections.push({ title: 'Estatísticas', items: statsItems });
    }
  }

  return sections;
};

export const buildQuestTechnicalDetails = (item) => {
  const sections = [
    {
      title: 'Identificação',
      items: [
        { label: 'ID', value: item._id, isCode: true },
        { label: 'Título', value: item.title || item.name },
        { label: 'Tipo', value: item.type === 'main' ? 'Principal' : item.type === 'daily' ? 'Diária' : item.type === 'event' ? 'Evento' : 'Secundária' },
        { label: 'Status', value: item.status || 'active' },
      ]
    },
    {
      title: 'Requisitos',
      items: [
        { label: 'Nível Mínimo', value: item.minLevel || '—' },
        { label: 'Nível Máximo', value: item.maxLevel || '—' },
        { label: 'Pré-requisitos', value: item.prerequisites?.length || 0, hint: 'quests anteriores' },
        { label: 'Localização', value: item.location?.name || '—' },
      ]
    },
    {
      title: 'Objetivos',
      items: item.objectives?.map((obj, i) => ({
        label: `#${i + 1} ${obj.type}`,
        value: `${obj.description} (x${obj.quantity || 1})`,
      })) || [{ label: 'Nenhum', value: '—' }]
    },
    {
      title: 'Recompensas',
      items: [
        { label: 'XP', value: item.rewards?.xp || 0 },
        { label: 'Itens', value: item.rewards?.items?.length || 0 },
        { label: 'Moedas', value: item.rewards?.currencies?.length || 0 },
      ]
    }
  ];

  return sections;
};

export const buildLocationTechnicalDetails = (item) => [
  {
    title: 'Identificação',
    items: [
      { label: 'ID', value: item._id, isCode: true },
      { label: 'Nome', value: item.name },
    ]
  },
  {
    title: 'Posição no Mapa',
    items: [
      { label: 'Coordenada X', value: item.position?.x ?? '—' },
      { label: 'Coordenada Y', value: item.position?.y ?? '—' },
    ]
  },
  {
    title: 'Metadados',
    items: [
      { label: 'Criado em', value: item.createdAt ? new Date(item.createdAt).toLocaleDateString('pt-BR') : '—' },
      { label: 'Atualizado em', value: item.updatedAt ? new Date(item.updatedAt).toLocaleDateString('pt-BR') : '—' },
    ]
  }
];

export const buildRoleTechnicalDetails = (item) => [
  {
    title: 'Identificação',
    items: [
      { label: 'ID', value: item._id, isCode: true },
      { label: 'Nome', value: item.name },
    ]
  },
  {
    title: 'Visual',
    items: [
      { label: 'Cor', value: item.color || '#ffffff', color: true },
    ]
  },
  {
    title: 'Metadados',
    items: [
      { label: 'Criado em', value: item.createdAt ? new Date(item.createdAt).toLocaleDateString('pt-BR') : '—' },
      { label: 'Atualizado em', value: item.updatedAt ? new Date(item.updatedAt).toLocaleDateString('pt-BR') : '—' },
    ]
  }
];
