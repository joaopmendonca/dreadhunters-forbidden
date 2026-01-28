// src/pages/Users/components/RoleEditor.js

import React from 'react';
import Card from '../../../shared/components/Card';
import styles from '../styles/UserDetail.module.css';

export default function RoleEditor({ 
  roles, 
  savingRoles, 
  onToggleAdmin 
}) {
  const isAdmin = roles.includes('admin');

  return (
    <Card>
      <Card.Header title="Permissões" />
      <Card.Body>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={isAdmin}
            onChange={onToggleAdmin}
            disabled={savingRoles}
          />
          <span>Administrador</span>
        </label>
        <p className={styles.hint}>
          Clique para {isAdmin ? 'remover' : 'conceder'} permissão de administrador.
        </p>
      </Card.Body>
    </Card>
  );
}
