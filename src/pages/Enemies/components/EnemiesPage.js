import { useEffect, useState } from 'react';
import BaseLayout from '../../../shared/components/BaseLayout';
import Pagination from '../../../shared/components/Pagination';
import EmptyState from '../../../shared/components/EmptyState';
import useEnemies from '../hooks/useEnemies';
import EnemiesHeader from './EnemiesHeader';
import EnemyCard from './EnemyCard';
import EnemyModal from './EnemyModal';
import LoadingState from './LoadingState';
import styles from '../styles/Enemies.module.css';

const ITEMS_PER_PAGE = 10;

export default function EnemiesPage() {
  const {
    enemiesList,
    itemsList,
    currenciesList,
    loading,
    loadingMeta,
    fetchEnemies,
    fetchMeta,
    handleSave,
    handleDelete,
    handleDeleteIcon
  } = useEnemies();

  const [searchName, setSearchName] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [page, setPage] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchEnemies();
    fetchMeta();
  }, []);

  const handleNew = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleEdit = enemy => {
    setEditing(enemy);
    setModalOpen(true);
  };

  const handleSaveEnemy = async fd => {
    await handleSave(fd);
    setModalOpen(false);
    setEditing(null);
    fetchEnemies();
  };

  const handleDeleteEnemy = async id => {
    await handleDelete(id);
    fetchEnemies();
  };

  const handleDeleteIconInModal = () => {
    handleDeleteIcon();
    fetchEnemies();
  };

  const filtered = enemiesList.filter(e => {
    const matchName = e.name?.toLowerCase().includes(searchName.toLowerCase());
    const matchType = filterType === 'all' || e.type === filterType;
    return matchName && matchType;
  });

  const totalCount = enemiesList.length;
  const normalCount = enemiesList.filter(e => e.type === 'normal').length;
  const eliteCount = enemiesList.filter(e => e.type === 'elite').length;
  const bossCount = enemiesList.filter(e => e.type === 'boss').length;

  const pageCount = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const pageItems = filtered.slice(
    page * ITEMS_PER_PAGE,
    (page + 1) * ITEMS_PER_PAGE
  );

  return (
    <BaseLayout title="Inimigos">
      <EnemiesHeader
        totalCount={totalCount}
        normalCount={normalCount}
        eliteCount={eliteCount}
        bossCount={bossCount}
        searchName={searchName}
        onSearchChange={(value) => {
          setSearchName(value);
          setPage(0);
        }}
        filterType={filterType}
        onFilterChange={(type) => {
          setFilterType(type);
          setPage(0);
        }}
        onNew={handleNew}
      />

      {loading || loadingMeta ? (
        <LoadingState />
      ) : (
        <>
          {pageItems.length === 0 && searchName === '' ? (
            <EmptyState
              message="Nenhum inimigo cadastrado ainda."
              buttonText="Adicionar Inimigo"
              onClick={handleNew}
            />
          ) : pageItems.length === 0 ? (
            <EmptyState
              message="Nenhum inimigo encontrado para essa busca."
              buttonText="Limpar Busca"
              onClick={() => {
                setSearchName('');
                setPage(0);
              }}
            />
          ) : (
            <>
              <div className={styles.grid}>
                {pageItems.map(enemy => (
                  <EnemyCard
                    key={enemy._id}
                    enemy={enemy}
                    items={itemsList}
                    currencies={currenciesList}
                    onEdit={() => handleEdit(enemy)}
                    onDelete={() => handleDeleteEnemy(enemy._id)}
                  />
                ))}
              </div>

              {pageCount > 1 && (
                <Pagination
                  currentPage={page}
                  totalPages={pageCount}
                  onPageChange={setPage}
                />
              )}
            </>
          )}
        </>
      )}

      <EnemyModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSave={handleSaveEnemy}
        onIconDeleted={handleDeleteIconInModal}
        initialData={editing || {}}
        items={itemsList}
        currencies={currenciesList}
      />
    </BaseLayout>
  );
}
