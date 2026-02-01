// src/AppRoutes.jsx

import { useContext, useEffect, useState } from 'react';
import { FaBars } from 'react-icons/fa';
import {
    Navigate,
    Route,
    Routes,
    useLocation
} from 'react-router-dom';

import { AuthContext } from './shared/contexts/AuthContext';

// TODO: Importar páginas conforme forem sendo migradas
import Afflictions from './pages/Afflictions';
import Attributes from './pages/Attributes';
import Characters from './pages/Characters';
import Classes from './pages/Classes';
import Currency from './pages/Currency';
import DamageTypes from './pages/DamageTypes';
import Dashboard from './pages/Dashboard';
import Enemies from './pages/Enemies';
import ForbiddenBook from './pages/ForbiddenBook';
import Items from './pages/Items';
import Locations from './pages/Locations';
import Login from './pages/Login';
import Logs from './pages/Logs';
import Quests from './pages/Quests';
import Roles from './pages/Roles';
import Servers from './pages/Servers';
import Settings from './pages/Settings';
import Skills from './pages/Skills';
import Users from './pages/Users';
import UserDetail from './pages/Users/UserDetail';

import styles from './AppRoutes.module.css';
// TODO: Importar componentes conforme forem sendo migrados
import BaseLayout from './shared/components/BaseLayout';
import Sidebar from './shared/components/Sidebar';

export default function AppRoutes() {
  const { user, loading, logout } = useContext(AuthContext);
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // controla abertura/fechamento da sidebar conforme largura da janela
  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth > 640);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // enquanto carrega estado de autenticação, não renderiza nada
  if (loading) return null;

  // se não autenticado, só rota de login está disponível
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="*"
          element={<Navigate to="/login" state={{ from: location.pathname }} replace />}
        />
      </Routes>
    );
  }

  // só administradores acessam o painel
  if (!Array.isArray(user.roles) || !user.roles.includes('admin')) {
    logout();
    return <Navigate to="/login" replace />;
  }

  // usuário é admin: renderiza toda a UI interna
  return (
    <div className={styles.container}>
      {/* Botão hamburger para abrir sidebar em telas pequenas */}
      {!sidebarOpen && (
        <button
          className={styles.menuButton}
          onClick={() => setSidebarOpen(true)}
          aria-label="Abrir menu lateral"
        >
          <FaBars size={20} />
        </button>
      )}

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        className={sidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}
      />

      {/* Conteúdo principal */}
      <div className={styles.main}>
        <BaseLayout>
          <Routes>
            {/* TODO: Descomentar rotas conforme páginas forem migradas */}
            <Route path="/dashboard"   element={<Dashboard />} />
            <Route path="/users"       element={<Users />} />
            <Route path="/characters"  element={<Characters />} />
            <Route path="/classes"     element={<Classes />} />
            <Route path="/skills"      element={<Skills />} />
            <Route path="/attributes"  element={<Attributes />} />
            <Route path="/afflictions" element={<Afflictions />} />
            <Route path="/damage-types" element={<DamageTypes />} />
            <Route path="/roles"       element={<Roles />} />
            <Route path="/items"       element={<Items />} />
            <Route path="/currency"    element={<Currency />} />
            <Route path="/enemies"     element={<Enemies />} />
            <Route path="/quests"      element={<Quests />} />
            <Route path="/locations"   element={<Locations />} />
            <Route path="/logs"        element={<Logs />} />
            <Route path="/servers"     element={<Servers />} />
            <Route path="/forbidden-book" element={<ForbiddenBook />} />
            <Route path="/settings"    element={<Settings />} />
            <Route path="/users/:id"   element={<UserDetail />} />

            {/* Rota fallback: redireciona ao dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BaseLayout>
      </div>
    </div>
  );
}
