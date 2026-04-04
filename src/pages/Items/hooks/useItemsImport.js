// ============================================================================
// Items CSV Import - Hook customizado para importação de itens
// ============================================================================

import { useFieldDefinitions } from '../../../shared/components/GenericCSVImport/hooks';
import { isInEnum } from '../../../shared/components/GenericCSVImport/utils';

/**
 * Hook que define a configuração de importação para Itens
 */
export function useItemsImport() {
  const { createField } = useFieldDefinitions();

  // Define os campos de acordo com o CSV real
  const ITEM_FIELDS = [
    // Campos básicos
    createField('name', 'Nome', 'string', {
      required: true,
      unique: true,
      example: 'Revólver .38'
    }),
    createField('description', 'Descrição', 'string', {
      required: true,
      example: 'Arma de fogo. Ataque à distância',
      validate: (value) => {
        if (!value || value.length < 5) return 'Descrição deve ter no mínimo 5 caracteres';
        return true;
      }
    }),
    createField('type', 'Tipo', 'string', {
      required: true,
      example: 'equipment',
      validate: (value) => {
        const validTypes = ['equipment', 'consumable', 'material', 'key', 'quest'];
        return isInEnum(value, validTypes) || 'Tipo deve ser: equipment, consumable, material, key, quest';
      }
    }),
    createField('rarity', 'Raridade', 'string', {
      required: true,
      example: 'common',
      validate: (value) => {
        const validRarities = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
        return isInEnum(value, validRarities) || 'Raridade inválida';
      }
    }),
    createField('buyPrice', 'Preço Compra', 'number', { example: '100' }),
    createField('sellPrice', 'Preço Venda', 'number', { example: '50' }),
    createField('stackable', 'Empilhável', 'boolean', { example: 'false' }),
    createField('maxStack', 'Máx. Pilha', 'number', { example: '1' }),
    
    // Campos de equipamento
    createField('equipmentSlot', 'Slot Equipamento', 'string', {
      example: 'cabeca',
      validate: (value) => {
        if (!value) return true;
        return true;
      }
    }),
    createField('durabilityCurrent', 'Durabilidade Atual', 'number', { example: '100' }),
    createField('durabilityMax', 'Durabilidade Máx.', 'number', { example: '100' }),
    createField('isPrimary', 'É Primária', 'boolean', { example: 'true' }),
    createField('hands', 'Mãos', 'number', { example: '1' }),
    
    // Campos de munição (armas)
    createField('ammoCurrent', 'Munição Atual', 'number', { example: '6' }),
    createField('ammoMax', 'Munição Máx.', 'number', { example: '6' }),
    
    // Campos de consumível
    createField('hpRestore', 'Restaura HP', 'number', { example: '10' }),
    createField('mpRestore', 'Restaura MP', 'number', { example: '0' }),
    createField('buff', 'Buff', 'string', { example: 'Recuperação básica' }),
    createField('buffDuration', 'Duração Buff (s)', 'number', { example: '60' }),
    
    // Tags e flags
    createField('tags', 'Tags', 'string', { example: '' }),
    createField('isInitial', 'Item Inicial', 'boolean', { example: 'true' }),
    
    // Stats base
    createField('str', 'Força (STR)', 'number', { example: '0' }),
    createField('dex', 'Destreza (DEX)', 'number', { example: '0' }),
    createField('con', 'Constituição (CON)', 'number', { example: '0' }),
    createField('int', 'Inteligência (INT)', 'number', { example: '0' }),
    createField('wit', 'Sagacidade (WIT)', 'number', { example: '0' }),
    createField('men', 'Mentalidade (MEN)', 'number', { example: '0' }),
    
    // Stats derivados
    createField('max_hp', 'HP Máximo', 'number', { example: '0' }),
    createField('max_sp', 'SP Máximo', 'number', { example: '0' }),
    createField('max_cp', 'CP Máximo', 'number', { example: '0' }),
    createField('hp_regen', 'Regen HP', 'number', { example: '0' }),
    createField('sp_regen', 'Regen SP', 'number', { example: '0' }),
    createField('cp_regen', 'Regen CP', 'number', { example: '0' }),
    createField('p_atk', 'Ataque Físico', 'number', { example: '0' }),
    createField('m_atk', 'Ataque Mágico', 'number', { example: '0' }),
    createField('crit_rate', 'Taxa Crítico', 'number', { example: '0' }),
    createField('crit_dmg', 'Dano Crítico', 'number', { example: '0' }),
    createField('m_crit_rate', 'Taxa Crit. Mág.', 'number', { example: '0' }),
    createField('p_def', 'Defesa Física', 'number', { example: '0' }),
    createField('m_def', 'Defesa Mágica', 'number', { example: '0' }),
    createField('evasion', 'Evasão', 'number', { example: '0' })
  ];

  // Mapeamento automático
  const ITEM_AUTO_MAPPING = {
    'name': 'name',
    'nome': 'name',
    'description': 'description',
    'descrição': 'description',
    'descricao': 'description',
    'type': 'type',
    'tipo': 'type',
    'rarity': 'rarity',
    'raridade': 'rarity',
    'buyprice': 'buyPrice',
    'buy price': 'buyPrice',
    'preço compra': 'buyPrice',
    'sellprice': 'sellPrice',
    'sell price': 'sellPrice',
    'preço venda': 'sellPrice',
    'stackable': 'stackable',
    'empilhável': 'stackable',
    'maxstack': 'maxStack',
    'max stack': 'maxStack',
    'equipmentslot': 'equipmentSlot',
    'slot': 'equipmentSlot',
    'durabilitycurrent': 'durabilityCurrent',
    'durabilitymax': 'durabilityMax',
    'isprimary': 'isPrimary',
    'hands': 'hands',
    'mãos': 'hands',
    'ammocurrent': 'ammoCurrent',
    'ammomax': 'ammoMax',
    'hprestore': 'hpRestore',
    'mprestore': 'mpRestore',
    'buff': 'buff',
    'buffduration': 'buffDuration',
    'tags': 'tags',
    'isinitial': 'isInitial',
    'str': 'str',
    'dex': 'dex',
    'con': 'con',
    'int': 'int',
    'wit': 'wit',
    'men': 'men',
    'max_hp': 'max_hp',
    'max_sp': 'max_sp',
    'max_cp': 'max_cp',
    'hp_regen': 'hp_regen',
    'sp_regen': 'sp_regen',
    'cp_regen': 'cp_regen',
    'p_atk': 'p_atk',
    'm_atk': 'm_atk',
    'crit_rate': 'crit_rate',
    'crit_dmg': 'crit_dmg',
    'm_crit_rate': 'm_crit_rate',
    'p_def': 'p_def',
    'm_def': 'm_def',
    'evasion': 'evasion'
  };

  /**
   * Transforma os dados do CSV para o formato esperado pela API
   */
  const transformDataForAPI = (item) => {
    // Monta stats base
    const baseStats = {
      str: parseInt(item.str) || 0,
      dex: parseInt(item.dex) || 0,
      con: parseInt(item.con) || 0,
      int: parseInt(item.int) || 0,
      wit: parseInt(item.wit) || 0,
      men: parseInt(item.men) || 0
    };

    // Monta stats derivados
    const derivedStats = {
      max_hp: parseInt(item.max_hp) || 0,
      max_sp: parseInt(item.max_sp) || 0,
      max_cp: parseInt(item.max_cp) || 0,
      hp_regen: parseInt(item.hp_regen) || 0,
      sp_regen: parseInt(item.sp_regen) || 0,
      cp_regen: parseInt(item.cp_regen) || 0,
      p_atk: parseInt(item.p_atk) || 0,
      m_atk: parseInt(item.m_atk) || 0,
      crit_rate: parseInt(item.crit_rate) || 0,
      crit_dmg: parseInt(item.crit_dmg) || 0,
      m_crit_rate: parseInt(item.m_crit_rate) || 0,
      p_def: parseInt(item.p_def) || 0,
      m_def: parseInt(item.m_def) || 0,
      evasion: parseInt(item.evasion) || 0
    };

    const transformed = {
      name: item.name,
      description: item.description,
      type: item.type,
      rarity: item.rarity,
      buyPrice: parseInt(item.buyPrice) || 0,
      sellPrice: parseInt(item.sellPrice) || 0,
      stackable: item.stackable === true || item.stackable === 'true',
      maxStack: parseInt(item.maxStack) || 1,
      isInitial: item.isInitial === true || item.isInitial === 'true',
      tags: item.tags ? item.tags.split(',').map(t => t.trim()) : [],
      baseStats,
      derivedStats
    };

    // Campos de equipamento
    if (item.type === 'equipment') {
      transformed.equipmentSlot = item.equipmentSlot;
      transformed.durabilityCurrent = parseInt(item.durabilityCurrent) || 100;
      transformed.durabilityMax = parseInt(item.durabilityMax) || 100;
      transformed.isPrimary = item.isPrimary === true || item.isPrimary === 'true';
      transformed.hands = parseInt(item.hands) || 1;
      
      if (item.equipmentSlot === 'weapon') {
        transformed.ammoCurrent = parseInt(item.ammoCurrent) || 0;
        transformed.ammoMax = parseInt(item.ammoMax) || 0;
      }
    }

    // Campos de consumível
    if (item.type === 'consumable') {
      transformed.hpRestore = parseInt(item.hpRestore) || 0;
      transformed.mpRestore = parseInt(item.mpRestore) || 0;
      transformed.buff = item.buff || '';
      transformed.buffDuration = parseInt(item.buffDuration) || 0;
    }

    return transformed;
  };

  /**
   * Verifica duplicados por nome
   */
  const isDuplicate = (item, existingItems) => {
    return existingItems.some(
      existing => existing.name?.toLowerCase() === item.name?.toLowerCase()
    );
  };

  return {
    fields: ITEM_FIELDS,
    autoMapping: ITEM_AUTO_MAPPING,
    transformDataForAPI,
    isDuplicate,
    entityName: 'Item',
    entityNamePlural: 'Itens'
  };
}
