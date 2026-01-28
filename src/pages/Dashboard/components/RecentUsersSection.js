// src/pages/Dashboard/components/RecentUsersSection.js

import React from 'react';
import { NavLink } from 'react-router-dom';
import { DASHBOARD_SECTIONS } from '../constants';
import styles from '../styles/Dashboard.module.css';

export default function RecentUsersSection({ recentUsers }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{DASHBOARD_SECTIONS.RECENT_USERS}</h2>
      <div className={styles.recentList}>
        {recentUsers.map(user => (
          <NavLink 
            key={user._id} 
            to={`/users/${user._id}`} 
            className={styles.recentCard}
          >
            <div className={styles.recentAvatar}>
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.username} />
              ) : (
                <span>👤</span>
              )}
            </div>
            <div className={styles.recentInfo}>
              <strong>{user.username}</strong>
              <span>{user.email}</span>
            </div>
            <div className={`${styles.recentStatus} ${styles[`status${user.status?.charAt(0).toUpperCase()}${user.status?.slice(1)}`]}`}>
              {user.status === 'active' ? '✅ Ativo' : 
               user.status === 'banned' ? '🚫 Banido' : '⏳ Pendente'}
            </div>
          </NavLink>
        ))}
      </div>
    </section>
  );
}
