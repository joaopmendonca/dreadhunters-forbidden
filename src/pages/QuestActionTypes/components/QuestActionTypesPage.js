import React from 'react';
import { FaPlus } from 'react-icons/fa';
import BaseLayout from '../../../shared/components/BaseLayout';
import EmptyState from '../../../shared/components/EmptyState';
import Button from '../../../shared/components/Button';
import { useQuestActionTypes } from '../hooks/useQuestActionTypes';
import { QuestActionTypeCard } from './QuestActionTypeCard';
import { QuestActionTypeModal } from './QuestActionTypeModal';

export function QuestActionTypesPage() {
  const {
    actionTypes,
    loading,
    modalOpen,
    setModalOpen,
    editingItem,
    handleNew,
    handleEdit,
    handleDelete,
    handleSave
  } = useQuestActionTypes();

  return (
    <BaseLayout title="Tipos de Ação de Quest">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <Button onClick={handleNew}>
          <FaPlus style={{ marginRight: 6 }} />
          Novo Tipo de Ação
        </Button>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : actionTypes.length === 0 ? (
        <EmptyState
          title="Nenhum tipo de ação cadastrado"
          description="Crie tipos como Investigar, Caçar ou Conversar para associar às quests."
          action={<Button onClick={handleNew}><FaPlus /> Criar</Button>}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {actionTypes.map(item => (
            <QuestActionTypeCard
              key={item._id}
              actionType={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <QuestActionTypeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={editingItem}
      />
    </BaseLayout>
  );
}
