// ============================================================================
// Enemies CSV Import - Hook customizado para importação de inimigos
// ============================================================================

import { useFieldDefinitions } from '../../../shared/components/GenericCSVImport/hooks';
import { isInEnum } from '../../../shared/components/GenericCSVImport/utils';

/**
 * Hook que define a configuração de importação para Inimigos
 */
export function useEnemiesImport() {
  const { createField } = useFieldDefinitions();

  // Define os campos de acordo com o modelo Enemy
  const ENEMY_FIELDS = [
    // Campos básicos
    createField('name', 'Nome', 'string', {
      required: true,
      unique: true,
      example: 'Goblin'
    }),
    createField('description', 'Descrição', 'string', {
      required: true,
      example: 'Um pequeno goblin verde',
      validate: (value) => {
        if (!value || value.length < 3) return 'Descrição deve ter no mínimo 3 caracteres';
        return true;
      }
    }),
    createField('type', 'Tipo', 'string', {
      required: true,
      example: 'normal',
      validate: (value) => {
        const validTypes = ['normal', 'elite', 'boss'];
        return isInEnum(value, validTypes) || 'Tipo deve ser: normal, elite, boss';
      }
    }),
    createField('level', 'Nível', 'number', {
      required: true,
      example: '1',
      validate: (value) => {
        const num = parseInt(value);
        if (isNaN(num) || num < 1) return 'Nível deve ser no mínimo 1';
        return true;
      }
    }),
    createField('xpReward', 'XP Recompensa', 'number', { example: '10' }),
    
    // Stats base
    createField('str', 'Força (STR)', 'number', { example: '5' }),
    createField('dex', 'Destreza (DEX)', 'number', { example: '5' }),
    createField('con', 'Constituição (CON)', 'number', { example: '5' }),
    createField('int', 'Inteligência (INT)', 'number', { example: '5' }),
    createField('wit', 'Sagacidade (WIT)', 'number', { example: '5' }),
    createField('men', 'Mentalidade (MEN)', 'number', { example: '5' })
  ];

  // Mapeamento automático
  const ENEMY_AUTO_MAPPING = {
    'name': 'name',
    'nome': 'name',
    'Name': 'name',
    'Nome': 'name',
    'description': 'description',
    'descrição': 'description',
    'descricao': 'description',
    'Descrição': 'description',
    'type': 'type',
    'tipo': 'type',
    'Type': 'type',
    'Tipo': 'type',
    'level': 'level',
    'nivel': 'level',
    'nível': 'level',
    'Level': 'level',
    'Nível': 'level',
    'xpreward': 'xpReward',
    'xp': 'xpReward',
    'XP': 'xpReward',
    'experiencia': 'xpReward',
    'str': 'str',
    'STR': 'str',
    'força': 'str',
    'forca': 'str',
    'dex': 'dex',
    'DEX': 'dex',
    'destreza': 'dex',
    'con': 'con',
    'CON': 'con',
    'constituição': 'con',
    'constituicao': 'con',
    'int': 'int',
    'INT': 'int',
    'inteligência': 'int',
    'inteligencia': 'int',
    'wit': 'wit',
    'WIT': 'wit',
    'sagacidade': 'wit',
    'men': 'men',
    'MEN': 'men',
    'mentalidade': 'men'
  };

  /**
   * Transforma os dados do CSV para o formato esperado pela API
   */
  const transformDataForAPI = (enemy) => {
    // Monta stats base
    const stats = {
      str: parseInt(enemy.str) || 0,
      dex: parseInt(enemy.dex) || 0,
      con: parseInt(enemy.con) || 0,
      int: parseInt(enemy.int) || 0,
      wit: parseInt(enemy.wit) || 0,
      men: parseInt(enemy.men) || 0
    };

    return {
      name: enemy.name,
      description: enemy.description,
      type: enemy.type || 'normal',
      level: parseInt(enemy.level) || 1,
      xpReward: parseInt(enemy.xpReward) || 0,
      stats
    };
  };

  /**
   * Verifica duplicados por nome
   */
  const isDuplicate = (enemy, existingEnemies) => {
    return existingEnemies.some(
      existing => existing.name?.toLowerCase() === enemy.name?.toLowerCase()
    );
  };

  return {
    fields: ENEMY_FIELDS,
    autoMapping: ENEMY_AUTO_MAPPING,
    transformDataForAPI,
    isDuplicate,
    entityName: 'Inimigo',
    entityNamePlural: 'Inimigos'
  };
}

export default useEnemiesImport;
