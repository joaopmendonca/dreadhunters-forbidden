import { useState } from 'react';
import { FaBolt, FaPlus } from 'react-icons/fa';
import BaseLayout from '../../../shared/components/BaseLayout';
import Card from '../../../shared/components/Card';
import EmptyState from '../../../shared/components/EmptyState';
import PageHeader from '../../../shared/components/PageHeader';
import Button from '../../../shared/components/Button';
import TextInput from '../../../shared/components/TextInput';
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

  const [search, setSearch] = useState('');

  const filtered = actionTypes.filter(at =>
    at.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <BaseLayout title="Tipos de Ação">
      <PageHeader
        statsCounters={[
          { icon: <FaBolt />, value: actionTypes.length, label: 'Total' }
        ]}
        controls={
          <>
            <Button
              backgroundColor="var(--maroon)"
              textColor="var(--light)"
              hoverColor="var(--gold)"
              onClick={handleNew}
              icon={<FaPlus />}
            >
              Novo Tipo de Ação
            </Button>
            <TextInput
              placeholder="🔍 Buscar por nome…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </>
        }
      />

      {loading ? (
        <EmptyState icon="⚙️" message="Carregando tipos de ação…" />
      ) : actionTypes.length === 0 ? (
        <EmptyState
          icon={<FaBolt />}
          title="Nenhum tipo de ação cadastrado"
          message="Crie tipos como Investigar, Caçar ou Conversar para associar às quests."
          action={
            <Button
              backgroundColor="var(--maroon)"
              textColor="var(--light)"
              hoverColor="var(--gold)"
              onClick={handleNew}
              icon={<FaPlus />}
            >
              Criar
            </Button>
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="Nenhum resultado"
          message={`Nenhum tipo de ação encontrado para "${search}".`}
        />
      ) : (
        <Card.Grid minWidth="300px">
          {filtered.map(item => (
            <QuestActionTypeCard
              key={item._id}
              actionType={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </Card.Grid>
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

