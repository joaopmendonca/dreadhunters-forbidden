import React from 'react';
import { NavLink } from 'react-router-dom';
import Card from '../../../shared/components/Card';
import { USER_STATUS_LABELS, USER_STATUS_VARIANTS } from '../constants';
import { formatDate } from '../utils';
import styles from '../styles/Users.module.css';

export default function UserCard({ user, onDelete }) {
  const variant = USER_STATUS_VARIANTS[user.status];
  const statusLabel = USER_STATUS_LABELS[user.status];

  return (
    <NavLink
      key={user._id}
      to={`/users/${user._id}`}
      className={styles.cardLink}
    >
      <Card variant={variant}>
        <Card.TopBar
          badge={
            <Card.Badge variant={variant}>
              {statusLabel}
            </Card.Badge>
          }
        >
          <Card.Actions onDelete={(e) => onDelete(e, user._id)} />
        </Card.TopBar>

        <Card.Header
          title={user.username}
          subtitle={user.email}
        />

        <Card.Body>
          <Card.Section title="País">
            <span>{user.country || '—'}</span>
          </Card.Section>

          <Card.Section title="Funções">
            <div className={styles.rolesList}>
              {user.roles.map((role) => (
                <span
                  key={role}
                  className={`${styles.roleBadge} ${role === 'admin' ? styles.roleBadgeAdmin : ''}`}
                >
                  {role}
                </span>
              ))}
            </div>
          </Card.Section>

          <Card.Section title="Criado em">
            <span>{formatDate(user.createdAt)}</span>
          </Card.Section>

          <Card.Section title="Último login">
            <span>{formatDate(user.lastLogin)}</span>
          </Card.Section>
        </Card.Body>
      </Card>
    </NavLink>
  );
}
