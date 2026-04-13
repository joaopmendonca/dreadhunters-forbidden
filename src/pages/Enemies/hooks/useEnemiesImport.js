// ============================================================================
// Enemies CSV Import - Hook customizado para importação de inimigos
// ============================================================================

import { useFieldDefinitions } from '../../../shared/components/GenericCSVImport/hooks';
import { isInEnum } from '../../../shared/components/GenericCSVImport/utils';
import { useStatus } from '../../../shared/hooks/useStatus';

/**
 * Hook que define a configuração de importação para Inimigos
 */
export function useEnemiesImport() {
  const { createField } = useFieldDefinitions();
  const { baseStatus } = useStatus();

  const fallbackBaseStatusNames = ['str', 'dex', 'con', 'int', 'wis', 'luk'];
  const resolvedBaseStatusNames = baseStatus.length
    ? baseStatus.map(status => status.nome)
    : fallbackBaseStatusNames;

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

    // Stats base dinâmicos
    ...resolvedBaseStatusNames.map(statusName =>
      createField(statusName, `Status Base (${String(statusName).toUpperCase()})`, 'number', { example: '5' })
    )
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
    'men': 'luk',
    'MEN': 'luk',
    'mentalidade': 'luk'
  };

  resolvedBaseStatusNames.forEach(statusName => {
    ENEMY_AUTO_MAPPING[String(statusName)] = String(statusName);
    ENEMY_AUTO_MAPPING[String(statusName).toLowerCase()] = String(statusName);
    ENEMY_AUTO_MAPPING[String(statusName).toUpperCase()] = String(statusName);
  });

  if (resolvedBaseStatusNames.includes('wis')) {
    ENEMY_AUTO_MAPPING.wit = 'wis';
    ENEMY_AUTO_MAPPING.WIT = 'wis';
  }

  if (resolvedBaseStatusNames.includes('luk')) {
    ENEMY_AUTO_MAPPING.men = 'luk';
    ENEMY_AUTO_MAPPING.MEN = 'luk';
  }

  /**
   * Transforma os dados do CSV para o formato esperado pela API
   */
  const transformDataForAPI = (enemy) => {
    // Monta stats base
    const stats = {};

    resolvedBaseStatusNames.forEach(statusName => {
      stats[statusName] = parseInt(enemy[statusName], 10) || 0;
    });

    // Compatibilidade para planilhas legadas
    if (resolvedBaseStatusNames.includes('wis')) {
      stats.wis = (parseInt(enemy.wis, 10) || 0) + (parseInt(enemy.wit, 10) || 0);
    }

    if (resolvedBaseStatusNames.includes('luk')) {
      stats.luk = (parseInt(enemy.luk, 10) || 0) + (parseInt(enemy.men, 10) || 0);
    }

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
