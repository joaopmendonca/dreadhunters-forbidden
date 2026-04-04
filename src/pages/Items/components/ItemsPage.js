import { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import BaseLayout from '../../../shared/components/BaseLayout';
import Card from '../../../shared/components/Card';
import EmptyState from '../../../shared/components/EmptyState';
import Pagination from '../../../shared/components/Pagination';
import Button from '../../../shared/components/Button';
import GenericCSVImport from '../../../shared/components/GenericCSVImport';
import useItems from '../hooks/useItems';
import { useItemsImport } from '../hooks/useItemsImport';
import ItemCard from './ItemCard';
import ItemModal from './ItemModal';
import ItemsHeader from './ItemsHeader';
import LoadingState from './LoadingState';

const ITEMS_PER_PAGE = 10;

export default function ItemsPage() {
  const {
    itemsList,
    loading,
    fetchItems,
    handleDelete,
    handleSave,
    handleDeleteIcon,
    handleImportItems,
    handleExportCSV,
    handleDownloadTemplate
  } = useItems();

  const {
    fields,
    autoMapping,
    transformDataForAPI,
    isDuplicate,
    entityNamePlural
  } = useItemsImport();

  const [searchName, setSearchName] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [page, setPage] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const handleNew = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleEdit = item => {
    setEditing(item);
    setModalOpen(true);
  };

  const filtered = itemsList.filter(i => {
    const matchName = i.name?.toLowerCase().includes(searchName.toLowerCase());
    const isWeapon = i.type === 'equipment' && i.equipment?.slot === 'weapon';
    const matchType =
      filterType === 'all' ||
      (filterType === 'weapon' ? isWeapon : i.type === filterType);
    return matchName && matchType;
  });

  const totalCount = itemsList.length;
  const consumableCount = itemsList.filter(i => i.type === 'consumable').length;
  const weaponCount = itemsList.filter(i => i.type === 'equipment' && i.equipment?.slot === 'weapon').length;
  const equipmentCount = itemsList.filter(i => i.type === 'equipment').length;
  const materialCount = itemsList.filter(i => i.type === 'material').length;
  const keyCount = itemsList.filter(i => i.type === 'key').length;
  const questCount = itemsList.filter(i => i.type === 'quest').length;
  const pageCount = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const pageItems = filtered.slice(
    page * ITEMS_PER_PAGE,
    (page + 1) * ITEMS_PER_PAGE
  );

  return (
    <BaseLayout title="Itens">
      <ItemsHeader
        totalCount={totalCount}
        consumableCount={consumableCount}
        weaponCount={weaponCount}
        equipmentCount={equipmentCount}
        materialCount={materialCount}
        keyCount={keyCount}
        questCount={questCount}
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
        onImport={() => setImportModalOpen(true)}
        onExport={handleExportCSV}
        onDownloadTemplate={handleDownloadTemplate}
      />

      {loading ? (
        <LoadingState />
      ) : (
        <>
          {pageItems.length === 0 && searchName === '' ? (
            <EmptyState
              icon="🎒"
              title="Nenhum item encontrado"
              message="Crie um novo item para começar"
              action={
                <Button
                  backgroundColor="var(--maroon)"
                  textColor="var(--light)"
                  hoverColor="var(--gold)"
                  icon={<FaPlus />}
                  onClick={handleNew}
                >
                  Criar Item
                </Button>
              }
            />
          ) : pageItems.length === 0 ? (
            <EmptyState
              icon="🔍"
              title="Nenhum item encontrado"
              message="Tente ajustar sua busca"
            />
          ) : (
            <Card.Grid minWidth="320px">
              {pageItems.map(item => (
                <ItemCard
                  key={item._id}
                  item={item}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </Card.Grid>
          )}

          <Pagination
            pageCount={pageCount}
            currentPage={page}
            onPageChange={setPage}
          />

          <ItemModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onSave={handleSave}
            onIconDeleted={handleDeleteIcon}
            initialData={editing || {}}
          />

          {importModalOpen && (
            <GenericCSVImport
              isOpen={importModalOpen}
              fieldDefinitions={fields}
              autoMapping={autoMapping}
              onImport={async (items) => {
                await handleImportItems(items.map(transformDataForAPI));
                setImportModalOpen(false);
                fetchItems();
              }}
              onClose={() => setImportModalOpen(false)}
              existingData={itemsList}
              isDuplicate={isDuplicate}
              entityNamePlural={entityNamePlural}
            />
          )}
        </>
      )}
    </BaseLayout>
  );
}
