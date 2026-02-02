// src/pages/Characters/hooks/useCharactersImport.js

import { useFieldDefinitions } from '../../../shared/components/GenericCSVImport/hooks';

export function useCharactersImport() {
  const { createField } = useFieldDefinitions();

  const fieldDefinitions = [
    createField('name', 'Nome', 'string', {
      required: true,
      unique: true,
      example: 'Mestre Alaric'
    }),
    createField('class', 'Classe', 'string', {
      required: false,
      example: 'Hermenêuta'
    }),
    createField('gender', 'Gênero', 'string', {
      required: false,
      example: 'male'
    }),
    createField('description', 'Descrição', 'string', {
      required: false,
      example: 'Sábio ancião que domina os segredos do conhecimento arcano'
    }),
    createField('hp', 'HP', 'number', {
      required: false,
      example: '150'
    }),
    createField('mp', 'MP', 'number', {
      required: false,
      example: '200'
    })
  ];

  const autoMapping = {
    'name': 'name',
    'nome': 'name',
    'class': 'class',
    'classe': 'class',
    'gender': 'gender',
    'genero': 'gender',
    'gênero': 'gender',
    'description': 'description',
    'descricao': 'description',
    'descrição': 'description',
    'hp': 'hp',
    'vida': 'hp',
    'health': 'hp',
    'mp': 'mp',
    'mana': 'mp'
  };

  const transformDataForAPI = (npc) => {
    return {
      name: npc.name?.trim(),
      class: npc.class?.trim(),
      gender: npc.gender?.trim() || 'male',
      description: npc.description?.trim() || '',
      type: 'npc',
      hp: parseInt(npc.hp) || 100,
      mp: parseInt(npc.mp) || 50
    };
  };

  const isDuplicate = (npc, existingData) => {
    return existingData.some(existing => 
      existing.name?.toLowerCase() === npc.name?.toLowerCase()
    );
  };

  return {
    fieldDefinitions,
    autoMapping,
    transformDataForAPI,
    isDuplicate,
    entityName: 'NPC',
    entityNamePlural: 'NPCs'
  };
}
