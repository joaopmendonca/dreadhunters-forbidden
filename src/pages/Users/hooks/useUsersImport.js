// src/pages/Users/hooks/useUsersImport.js

import { useCallback } from 'react';

export function useUsersImport() {
  const fieldDefinitions = [
    { 
      name: 'username', 
      label: 'Username', 
      required: true, 
      type: 'text',
      description: 'Nome de usuário único (mínimo 3 caracteres)'
    },
    { 
      name: 'email', 
      label: 'Email', 
      required: true, 
      type: 'email',
      description: 'Email válido e único'
    },
    { 
      name: 'password', 
      label: 'Senha', 
      required: true, 
      type: 'password',
      description: 'Senha (mínimo 6 caracteres)'
    },
    { 
      name: 'status', 
      label: 'Status', 
      required: false, 
      type: 'select',
      description: 'Status do usuário',
      options: ['active', 'pending', 'banned']
    },
    { 
      name: 'country', 
      label: 'País', 
      required: false, 
      type: 'text',
      description: 'Código do país (ex: BR, US, PT)'
    },
    { 
      name: 'roles', 
      label: 'Roles', 
      required: false, 
      type: 'text',
      description: 'Roles separadas por pipe (ex: player|admin)'
    }
  ];

  const autoMapping = {
    'username': ['username', 'user', 'usuario', 'nome_usuario', 'login'],
    'email': ['email', 'e-mail', 'mail', 'correio'],
    'password': ['password', 'senha', 'pass', 'pwd'],
    'status': ['status', 'estado', 'state'],
    'country': ['country', 'pais', 'país', 'nation'],
    'roles': ['roles', 'papeis', 'papéis', 'permissions', 'permissoes']
  };

  const transformDataForAPI = useCallback((user) => {
    return {
      username: user.username?.trim(),
      email: user.email?.trim().toLowerCase(),
      password: user.password?.trim(),
      status: user.status?.trim() || 'pending',
      country: user.country?.trim()?.toUpperCase() || '',
      roles: user.roles ? user.roles.split('|').map(r => r.trim()).filter(Boolean) : []
    };
  }, []);

  const isDuplicate = useCallback((user, existingData) => {
    return existingData.some(existing => 
      existing.username?.toLowerCase() === user.username?.toLowerCase() ||
      existing.email?.toLowerCase() === user.email?.toLowerCase()
    );
  }, []);

  return {
    fieldDefinitions,
    autoMapping,
    transformDataForAPI,
    isDuplicate,
    entityNamePlural: 'usuários'
  };
}
