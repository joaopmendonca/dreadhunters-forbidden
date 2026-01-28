// src/pages/Users/components/UserDetailPage.js

import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import BaseLayout from '../../../shared/components/BaseLayout';
import Button from '../../../shared/components/Button';
import ConfirmationModal from '../../../shared/components/ConfirmationModal';
import { useUserDetail } from '../hooks/useUserDetail';
import UserInfo from './UserInfo';
import RoleEditor from './RoleEditor';
import CharactersList from './CharactersList';
import PlayerCharacterModal from './PlayerCharacterModal';
import styles from '../styles/UserDetail.module.css';

export default function UserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    user,
    loading,
    classes,
    servers,
    fetchServerName,
    roles,
    savingRoles,
    isRoleModalOpen,
    setIsRoleModalOpen,
    handleToggleAdmin,
    confirmToggleAdmin,
    charModalOpen,
    editingChar,
    deleteCharId,
    setDeleteCharId,
    handleEditCharacter,
    handleSaveCharacter,
    handleDeleteCharacterIcon,
    handleDeleteCharacter,
    closeCharModal,
  } = useUserDetail(id);

  if (loading) {
    return (
      <BaseLayout title="Carregando...">
        <div className={styles.loading}>
          <p>Carregando usuário...</p>
        </div>
      </BaseLayout>
    );
  }

  if (!user) {
    return (
      <BaseLayout title="Erro">
        <div className={styles.error}>
          <p>Usuário não encontrado.</p>
          <Button onClick={() => navigate('/users')}>
            <FaArrowLeft /> Voltar
          </Button>
        </div>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout title={user.username}>
      <div className={styles.header}>
        <Button 
          onClick={() => navigate('/users')}
          backgroundColor="var(--dark-3)"
          textColor="var(--light)"
          hoverColor="var(--dark-4)"
          icon={<FaArrowLeft />}
        >
          Voltar
        </Button>
      </div>

      <div className={styles.container}>
        <UserInfo user={user} />

        <RoleEditor
          roles={roles}
          savingRoles={savingRoles}
          onToggleAdmin={handleToggleAdmin}
        />

        <CharactersList
          characters={user.characters || []}
          classes={classes}
          fetchServerName={fetchServerName}
          onEditCharacter={handleEditCharacter}
          onDeleteCharacter={(charId) => setDeleteCharId(charId)}
        />
      </div>

      {/* Modal de edição de personagem */}
      <PlayerCharacterModal
        isOpen={charModalOpen}
        onClose={closeCharModal}
        onSave={handleSaveCharacter}
        onIconDeleted={handleDeleteCharacterIcon}
        initialData={editingChar}
        classes={classes}
        servers={servers}
      />

      {/* Modal de confirmação de alteração de admin */}
      <ConfirmationModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        onConfirm={confirmToggleAdmin}
        title="Alterar Permissões"
        message={
          roles.includes('admin')
            ? 'Tem certeza que deseja remover a permissão de administrador deste usuário?'
            : 'Tem certeza que deseja conceder permissão de administrador a este usuário?'
        }
        confirmText={roles.includes('admin') ? 'Remover Admin' : 'Conceder Admin'}
        cancelText="Cancelar"
        variant={roles.includes('admin') ? 'danger' : 'warning'}
        loading={savingRoles}
      />

      {/* Modal de confirmação de exclusão de personagem */}
      <ConfirmationModal
        isOpen={!!deleteCharId}
        onClose={() => setDeleteCharId(null)}
        onConfirm={handleDeleteCharacter}
        title="Excluir Personagem"
        message="Tem certeza que deseja excluir este personagem? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="danger"
      />
    </BaseLayout>
  );
}
