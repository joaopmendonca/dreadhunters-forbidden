import { useEffect, useState } from 'react';
import BaseLayout from '../../../shared/components/BaseLayout';
import Card from '../../../shared/components/Card';
import EmptyState from '../../../shared/components/EmptyState';
import Pagination from '../../../shared/components/Pagination';
import useQuests from '../hooks/useQuests';
import QuestsHeader from './QuestsHeader';
import QuestCard from './QuestCard';
import QuestModal from './QuestModal';
import LoadingState from './LoadingState';

const ITEMS_PER_PAGE = 10;

export default function QuestsPage() {
  const {
    questsList,
    itemsList,
    enemiesList,
    npcsList,
    locationsList,
    currenciesList,
    loading,
    loadingMeta,
    fetchQuests,
    fetchMeta,
    handleDelete,
    handleSave,
    handleDeleteIcon
  } = useQuests();

  const [searchTitle, setSearchTitle] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [page, setPage] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchQuests();
    fetchMeta();
  }, []);

  const handleNew = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleEdit = quest => {
    setEditing(quest);
    setModalOpen(true);
  };

  const handleSaveQuest = async fd => {
    await handleSave(fd, editing?._id);
    setModalOpen(false);
    setEditing(null);
    fetchQuests();
  };

  const handleDeleteQuest = async id => {
    await handleDelete(id);
    fetchQuests();
  };

  const handleDeleteIconInModal = async id => {
    await handleDeleteIcon(id);
    fetchQuests();
  };

  const filtered = questsList.filter(q => {
    const matchTitle = q.title?.toLowerCase().includes(searchTitle.toLowerCase());
    const matchType = filterType === 'all' || q.type === filterType;
    return matchTitle && matchType;
  });

  const totalCount = questsList.length;
  const mainCount = questsList.filter(q => q.type === 'main').length;
  const sideCount = questsList.filter(q => q.type === 'side').length;
  const dailyCount = questsList.filter(q => q.type === 'daily').length;

  const pageCount = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const pageItems = filtered.slice(
    page * ITEMS_PER_PAGE,
    (page + 1) * ITEMS_PER_PAGE
  );

  return (
    <BaseLayout title="Quests">
      <QuestsHeader
        totalCount={totalCount}
        mainCount={mainCount}
        sideCount={sideCount}
        dailyCount={dailyCount}
        searchTitle={searchTitle}
        onSearchChange={value => {
          setSearchTitle(value);
          setPage(0);
        }}
        filterType={filterType}
        onFilterChange={type => {
          setFilterType(type);
          setPage(0);
        }}
        onNew={handleNew}
      />

      {loading || loadingMeta ? (
        <LoadingState />
      ) : (
        <>
          {pageItems.length === 0 && searchTitle === '' && filterType === 'all' ? (
            <EmptyState
              icon="📜"
              title="Nenhuma quest encontrada"
              message="Crie uma nova quest para começar"
            />
          ) : pageItems.length === 0 ? (
            <EmptyState
              icon="🔍"
              title="Nenhuma quest encontrada"
              message="Tente ajustar sua busca ou filtros"
            />
          ) : (
            <>
              <Card.Grid minWidth="340px">
                {pageItems.map(quest => (
                  <QuestCard
                    key={quest._id}
                    quest={quest}
                    items={itemsList}
                    currencies={currenciesList}
                    locations={locationsList}
                    onEdit={() => handleEdit(quest)}
                    onDelete={() => handleDeleteQuest(quest._id)}
                  />
                ))}
              </Card.Grid>

              {pageCount > 1 && (
                <Pagination
                  currentPage={page}
                  totalPages={pageCount}
                  onPageChange={setPage}
                />
              )}
            </>
          )}

          <QuestModal
            isOpen={modalOpen}
            onClose={() => {
              setModalOpen(false);
              setEditing(null);
            }}
            onSave={handleSaveQuest}
            onIconDeleted={handleDeleteIconInModal}
            initialData={editing || {}}
            quests={questsList}
            items={itemsList}
            enemies={enemiesList}
            npcs={npcsList}
            locations={locationsList}
            currencies={currenciesList}
          />
        </>
      )}
    </BaseLayout>
  );
}
