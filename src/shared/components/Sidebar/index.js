// src/components/Sidebar.jsx

import { useContext, useState } from 'react';
import {
    FaBolt,
    FaBook,
    FaBoxOpen,
    FaChalkboardTeacher,
    FaClipboardList,
    FaCoins,
    FaCrosshairs,
    FaHeart,
    FaMapMarkedAlt,
    FaMapMarkerAlt,
    FaServer, // ícone para Servidores
    FaSignOutAlt,
    FaSkull,
    FaSkullCrossbones,
    FaTachometerAlt,
    FaThLarge,
    FaTimes,
    FaUser,
    FaUsers,
    FaUserShield
} from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import gameLogo from '../../../assets/game-logo-label.png';
import { AuthContext } from '../../contexts/AuthContext';
import ConfirmationModal from '../ConfirmationModal';
import styles from './Sidebar.module.css';

export default function Sidebar({ isOpen = true, onClose }) {
  const { user, logout } = useContext(AuthContext);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const links = [
    { to: '/dashboard',   label: 'Dashboard',    icon: <FaTachometerAlt /> },
    { to: '/users',       label: 'Usuários',     icon: <FaUsers /> },
    { to: '/characters',  label: 'NPCs',         icon: <FaUser /> },
    { to: '/classes',     label: 'Classes',      icon: <FaChalkboardTeacher /> },
    { to: '/skills',      label: 'Skills',       icon: <FaBolt /> },
    { to: '/attributes',  label: 'Atributos',    icon: <FaHeart /> },
    { to: '/afflictions', label: 'Aflições',     icon: <FaSkullCrossbones /> },
    { to: '/damage-types', label: 'Tipos de Dano', icon: <FaCrosshairs /> },
    { to: '/equipment-slots', label: 'Slots de Equipamento', icon: <FaThLarge /> },
    { to: '/roles',       label: 'Roles',        icon: <FaUserShield /> },
    { to: '/items',       label: 'Itens',        icon: <FaBoxOpen /> },
    { to: '/currency',    label: 'Moedas',       icon: <FaCoins /> },
    { to: '/enemies',     label: 'Inimigos',     icon: <FaSkull /> },
    { to: '/quests',      label: 'Quests',       icon: <FaMapMarkedAlt /> },
    { to: '/quest-action-types', label: 'Tipos de Ação', icon: <FaBolt /> },
    { to: '/locations',   label: 'Locais',       icon: <FaMapMarkerAlt /> },
    { to: '/logs',        label: 'Logs',         icon: <FaClipboardList /> },
    { to: '/servers',     label: 'Servidores',   icon: <FaServer /> },
    { to: '/forbidden-book', label: 'Forbidden Book', icon: <FaBook /> },
    { to: '/settings',    label: 'Configurações', icon: <FaUserShield /> }
  ];

  const handleLogoutClick = () => setConfirmOpen(true);
  const handleConfirmLogout = () => {
    logout();
    setConfirmOpen(false);
    onClose?.();
  };

  return (
    <>
      {/* Modal de confirmação de logout */}
      <ConfirmationModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        icon={FaSignOutAlt}
        iconColor="#d92828"
        message="Tem certeza que deseja sair?"
        buttons={[
          {
            text: 'Cancelar',
            onClick: () => setConfirmOpen(false),
            buttonColor: 'transparent',
            textColor: '#fff'
          },
          {
            text: 'Sair',
            onClick: handleConfirmLogout,
            buttonColor: '#d92828',
            textColor: '#fff'
          }
        ]}
      />

      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        {isOpen && onClose && (
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Fechar menu"
          >
            <FaTimes size={20} />
          </button>
        )}

        <div className={styles.logoWrapper}>
          <img src={gameLogo} alt="Logo do Jogo" className={styles.logo} />
        </div>

        <div className={styles.userInfo}>
          <h2 className={styles.greeting}>Olá, {user.username}!</h2>
          <span className={styles.userRole}>{user.roles.join(', ')}</span>
        </div>

        <nav className={styles.nav}>
          {links.map(({ to, label, icon }) => (
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
        </nav>

        <button onClick={handleLogoutClick} className={styles.logoutButton}>
          <FaSignOutAlt className={styles.icon} />
          <span className={styles.labelText}>Sair</span>
        </button>
      </aside>
    </>
  );
}
