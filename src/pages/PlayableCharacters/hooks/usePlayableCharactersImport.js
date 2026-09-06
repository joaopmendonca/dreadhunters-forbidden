// src/pages/PlayableCharacters/hooks/usePlayableCharactersImport.js

import { useFieldDefinitions } from '../../../shared/components/GenericCSVImport/hooks';

export function usePlayableCharactersImport() {
  const { createField } = useFieldDefinitions();

  const fieldDefinitions = [
    createField('name', 'Nome', 'string', { required: true, unique: true, example: 'Bermond' }),
    createField('class', 'Classe', 'string', { required: true, example: 'Vigilante' }),
    createField('baseLevel', 'Nível Base', 'number', { required: false, example: '1' }),
    createField('gender', 'Gênero', 'string', { required: false, example: 'male' }),
    createField('unlockType', 'Desbloqueio', 'string', { required: false, example: 'starter' }),
    createField('description', 'Descrição', 'string', { required: false, example: 'Investigador veterano.' }),
    createField('history', 'História', 'string', { required: false, example: 'Ex-policial que abandonou o distintivo.' }),
  ];

  const autoMapping = {
    name: 'name', nome: 'name',
    class: 'class', classe: 'class',
    baselevel: 'baseLevel', 'nível base': 'baseLevel', nivel: 'baseLevel',
    gender: 'gender', genero: 'gender', 'gênero': 'gender',
    unlocktype: 'unlockType', desbloqueio: 'unlockType', unlock: 'unlockType',
    description: 'description', descricao: 'description', 'descrição': 'description',
    history: 'history', historia: 'history', 'história': 'history', lore: 'history',
  };

  const transformDataForAPI = (row) => ({
    name: row.name?.trim(),
    class: row.class?.trim(),
    baseLevel: parseInt(row.baseLevel, 10) || 1,
    gender: row.gender?.trim() || 'male',
    unlockType: row.unlockType?.trim() || 'starter',
    description: row.description?.trim() || '',
    history: row.history?.trim() || '',
  });

  const isDuplicate = (row, existing) =>
    existing.some((e) => e.name?.toLowerCase() === row.name?.toLowerCase());

  return {
    fieldDefinitions,
    autoMapping,
    transformDataForAPI,
    isDuplicate,
    entityName: 'Personagem Jogável',
    entityNamePlural: 'Personagens Jogáveis',
  };
}
