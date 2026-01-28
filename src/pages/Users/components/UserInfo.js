// src/pages/Users/components/UserInfo.js

import React from 'react';
import { FaUser } from 'react-icons/fa';
import Card from '../../../shared/components/Card';
import { USER_STATUS_LABELS } from '../constants';
import { formatDate } from '../utils';
import styles from '../styles/UserDetail.module.css';

export default function UserInfo({ user }) {
  if (!user) return null;

  return (
    <Card>
      <Card.Header title="Informações do Usuário" />
      <Card.Body>
        <div className={styles.userInfoGrid}>
          <div className={styles.avatarSection}>
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.username} className={styles.avatar} />
            ) : (
              <div className={styles.avatarPlaceholder}>
                <FaUser size={48} />
              </div>
            )}
          </div>
          
          <div className={styles.infoGrid}>
            <Card.Section title="Username">
              <span>{user.username}</span>
            </Card.Section>
            
            <Card.Section title="E-mail">
              <span>{user.email}</span>
            </Card.Section>
            
            <Card.Section title="Status">
              <span className={styles.statusBadge} data-status={user.status}>
                {USER_STATUS_LABELS[user.status] || user.status}
              </span>
            </Card.Section>
            
            <Card.Section title="País">
              <span>{user.country || '—'}</span>
            </Card.Section>
            
            <Card.Section title="Funções">
              <div className={styles.rolesList}>
                {user.roles && user.roles.length > 0 ? (
                  user.roles.map(role => (
                    <span 
                      key={role} 
                      className={`${styles.roleBadge} ${role === 'admin' ? styles.roleBadgeAdmin : ''}`}
                    >
                      {role}
                    </span>
                  ))
                ) : (
                  <span>—</span>
                )}
              </div>
            </Card.Section>
            
            <Card.Section title="Criado em">
              <span>{formatDate(user.createdAt)}</span>
            </Card.Section>
            
            <Card.Section title="Último login">
              <span>{formatDate(user.lastLogin)}</span>
            </Card.Section>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
