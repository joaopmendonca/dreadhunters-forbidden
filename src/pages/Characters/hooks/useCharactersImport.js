// src/pages/Characters/hooks/useCharactersImport.js

import { useCallback } from 'react';

export function useCharactersImport() {
  const fieldDefinitions = [
    { 
      name: 'name', 
      label: 'Nome', 
      required: true, 
      type: 'text',
      description: 'Nome do NPC'
    },
    { 
      name: 'class', 
      label: 'Classe', 
      required: true, 
      type: 'text',
      description: 'Nome da classe do NPC'
    },
    { 
      name: 'gender', 
      label: 'Gênero', 
      required: false, 
      type: 'select',
      description: 'Gênero do NPC',
      options: ['male', 'female', 'other']
    },
    { 
      name: 'description', 
      label: 'Descrição', 
      required: false, 
      type: 'text',
      description: 'Descrição do NPC'
    },
    { 
      name: 'hp', 
      label: 'HP', 
      required: false, 
      type: 'number',
      description: 'Pontos de vida'
    },
    { 
      name: 'mp', 
      label: 'MP', 
      required: false, 
      type: 'number',
      description: 'Pontos de mana'
    }
  ];

  const autoMapping = {
    'name': ['name', 'nome', 'Name', 'Nome'],
    'class': ['class', 'classe', 'Class', 'Classe'],
    'gender': ['gender', 'genero', 'gênero', 'Gender', 'Gênero'],
    'description': ['description', 'descricao', 'descrição', 'Description', 'Descrição'],
    'hp': ['hp', 'HP', 'vida', 'health'],
    'mp': ['mp', 'MP', 'mana']
  };

  const transformDataForAPI = useCallback((npc) => {
    return {
      name: npc.name?.trim(),
      class: npc.class?.trim(),
      gender: npc.gender?.trim() || 'male',
      description: npc.description?.trim() || '',
      hp: parseInt(npc.hp) || 100,
      mp: parseInt(npc.mp) || 50
    };
  }, []);

  const isDuplicate = useCallback((npc, existingData) => {
    return existingData.some(existing => 
      existing.name?.toLowerCase() === npc.name?.toLowerCase()
    );
  }, []);

  return {
    fieldDefinitions,
    autoMapping,
    transformDataForAPI,
    isDuplicate,
    entityNamePlural: 'NPCs'
  };
}
