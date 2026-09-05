// src/components/Sidebar.jsx

import { useContext, useState } from 'react';
import {
    FaBolt,
    FaBook,
    FaBoxOpen,
    FaChalkboardTeacher,
    FaChevronDown,
    FaClipboardList,
    FaCoins,
    FaCrosshairs,
    FaHeart,
    FaMapMarkedAlt,
    FaMapMarkerAlt,
    FaServer,
    FaSignOutAlt,
    FaSkull,
    FaSkullCrossbones,
    FaTachometerAlt,
    FaThLarge,
    FaTimes,
    FaUser,
    FaUserAstronaut,
    FaUsers,
    FaUserShield
} from 'react-icons/fa';
import { NavLink, useLocation } from 'react-router-dom';
import gameLogo from '../../../assets/game-logo-label.png';
import { AuthContext } from '../../contexts/AuthContext';
import ConfirmationModal from '../ConfirmationModal';
import styles from './Sidebar.module.css';

const GROUPS = [
  {
    id: 'geral',
    label: 'Geral',
    links: [
      { to: '/dashboard',      label: 'Dashboard',    icon: <FaTachometerAlt /> },
      { to: '/users',          label: 'Usuários',     icon: <FaUsers /> },
      { to: '/roles',          label: 'Roles',        icon: <FaUserShield /> },
    ]
  },
  {
    id: 'mecanicas',
    label: 'Mecânicas',
    links: [
      { to: '/classes',        label: 'Classes',      icon: <FaChalkboardTeacher /> },
      { to: '/attributes',     label: 'Atributos',    icon: <FaHeart /> },
      { to: '/skills',         label: 'Skills',       icon: <FaBolt /> },
      { to: '/afflictions',    label: 'Aflições',     icon: <FaSkullCrossbones /> },
      { to: '/damage-types',   label: 'Tipos de Dano', icon: <FaCrosshairs /> },
      { to: '/equipment-slots', label: 'Slots de Equipamento', icon: <FaThLarge /> },
    ]
  },
  {
    id: 'jogo',
    label: 'Jogo',
    links: [
      { to: '/playable-characters', label: 'Personagens Jogáveis', icon: <FaUserAstronaut /> },
      { to: '/characters',     label: 'NPCs',         icon: <FaUser /> },
      { to: '/enemies',        label: 'Inimigos',     icon: <FaSkull /> },
      { to: '/items',          label: 'Itens',        icon: <FaBoxOpen /> },
      { to: '/currency',       label: 'Moedas',       icon: <FaCoins /> },
      { to: '/locations',      label: 'Locais',       icon: <FaMapMarkerAlt /> },
      { to: '/quests',         label: 'Quests',       icon: <FaMapMarkedAlt /> },
      { to: '/quest-action-types', label: 'Tipos de Ação de Quest', icon: <FaClipboardList /> },
    ]
  },
  {
    id: 'sistema',
    label: 'Sistema',
    links: [
      { to: '/settings',       label: 'Configurações', icon: <FaUserShield /> },
      { to: '/forbidden-book', label: 'Forbidden Book', icon: <FaBook /> },
      { to: '/logs',           label: 'Logs',         icon: <FaClipboardList /> },
      { to: '/servers',        label: 'Servidores',   icon: <FaServer /> },
    ]
  }
];

function groupIdForPath(pathname) {
  for (const group of GROUPS) {
    if (group.links.some(link => pathname.startsWith(link.to))) {
      return group.id;
    }
  }
  return GROUPS[0].id;
}

export default function Sidebar({ isOpen = true, onClose }) {
  const { user, logout } = useContext(AuthContext);
  const { pathname } = useLocation();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState(() => groupIdForPath(pathname));

  const handleLogoutClick = () => setConfirmOpen(true);
  const handleConfirmLogout = () => {
    logout();
    setConfirmOpen(false);
    onClose?.();
  };

  const toggleGroup = id => {
    setOpenGroup(prev => (prev === id ? null : id));
  };

  return (
    <>
      <ConfirmationModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        icon={FaSignOutAlt}
        iconColor="#d92828"
        message="Tem certeza que deseja sair?"
        buttons={[
          { text: 'Cancelar', onClick: () => setConfirmOpen(false), buttonColor: 'transparent', textColor: '#fff' },
          { text: 'Sair', onClick: handleConfirmLogout, buttonColor: '#d92828', textColor: '#fff' }
        ]}
      />

      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        {isOpen && onClose && (
          <button className={styles.closeButton} onClick={onClose} aria-label="Fechar menu">
            <FaTimes size={20} />
          </button>
        )}

        <div className={styles.brandBlock}>
          <img src={gameLogo} alt="Dread Hunters" className={styles.logo} />
        </div>

        <div className={styles.userInfo}>
          <p className={styles.greeting}>Olá, {user.username}!</p>
          <span className={styles.userRole}>{user.roles.join(', ')}</span>
        </div>

        <nav className={styles.nav}>
          {GROUPS.map(group => {
            const isExpanded = openGroup === group.id;
            const hasActiveLink = group.links.some(link => pathname.startsWith(link.to));

            return (
              <div key={group.id} className={styles.group}>
                <button
                  className={`${styles.groupHeader} ${hasActiveLink ? styles.groupHeaderActive : ''}`}
                  onClick={() => toggleGroup(group.id)}
                  aria-expanded={isExpanded}
                >
                  <span className={styles.groupLabel}>{group.label}</span>
                  <FaChevronDown
                    className={`${styles.groupChevron} ${isExpanded ? styles.groupChevronOpen : ''}`}
                  />
                </button>

                {isExpanded && (
                  <div className={styles.groupLinks}>
                    {group.links.map(({ to, label, icon }) => (
                      <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                          `${styles.navLink} ${isActive ? styles.active : ''}`
                        }
                        onClick={() => onClose?.()}
                      >
                        <span className={styles.icon}>{icon}</span>
                        <span className={styles.labelText}>{label}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <button onClick={handleLogoutClick} className={styles.logoutButton}>
          <FaSignOutAlt className={styles.icon} />
          <span className={styles.labelText}>Sair</span>
        </button>
      </aside>
    </>
  );
}



