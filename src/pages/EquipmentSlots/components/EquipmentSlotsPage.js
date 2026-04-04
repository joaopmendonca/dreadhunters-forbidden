import { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import BaseLayout from '../../../shared/components/BaseLayout';
import Card from '../../../shared/components/Card';
import EmptyState from '../../../shared/components/EmptyState';
import Pagination from '../../../shared/components/Pagination';
import Button from '../../../shared/components/Button';
import GenericCSVImport from '../../../shared/components/GenericCSVImport';
import useEquipmentSlots from '../hooks/useEquipmentSlots';
import { useEquipmentSlotsImport } from '../hooks/useEquipmentSlotsImport';
import EquipmentSlotCard from './EquipmentSlotCard';
import EquipmentSlotModal from './EquipmentSlotModal';
import EquipmentSlotsHeader from './EquipmentSlotsHeader';
import LoadingState from './LoadingState';

const ITEMS_PER_PAGE = 12;

export default function EquipmentSlotsPage() {
  const {
    equipmentSlots,
    loading,
    fetchData,
    handleDelete,
    handleSave,
    handleImport,
    handleExportCSV,
    handleDownloadTemplate
  } = useEquipmentSlots();

  const {
    fields,
    autoMapping,
    transformDataForAPI,
    isDuplicate,
    entityNamePlural
  } = useEquipmentSlotsImport();

  const [searchName, setSearchName] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNew = () => {
    setEditingSlot(null);
    setModalOpen(true);
  };

  const handleEdit = (slot) => {
    setEditingSlot(slot);
    setModalOpen(true);
  };

  const totalCount = equipmentSlots.length;
  const activeCount = equipmentSlots.filter(slot => slot.active === true).length;
  const inactiveCount = equipmentSlots.filter(slot => slot.active === false).length;

  const filtered = equipmentSlots.filter(slot => {
    const term = searchName.toLowerCase();
    const matchName = slot.name?.toLowerCase().includes(term) || slot.key?.toLowerCase().includes(term);
    const matchStatus =
      filterStatus === 'all'
      || (filterStatus === 'active' && slot.active === true)
      || (filterStatus === 'inactive' && slot.active === false);

    return matchName && matchStatus;
  });

  const pageCount = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const pageItems = filtered.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  return (
    <BaseLayout title="Slots de Equipamento">
      <EquipmentSlotsHeader
        totalCount={totalCount}
        activeCount={activeCount}
        inactiveCount={inactiveCount}
        filterStatus={filterStatus}
        onFilterChange={(status) => {
          setFilterStatus(status);
          setPage(0);
        }}
        searchName={searchName}
        onSearchChange={(value) => {
          setSearchName(value);
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
              icon="🧩"
              title="Nenhum slot encontrado"
              message="Crie um slot para começar"
              action={
                <Button
                  backgroundColor="var(--maroon)"
                  textColor="var(--light)"
                  hoverColor="var(--gold)"
                  icon={<FaPlus />}
                  onClick={handleNew}
                >
                  Criar Slot
                </Button>
              }
            />
          ) : pageItems.length === 0 ? (
            <EmptyState
              icon="🔍"
              title="Nenhum slot encontrado"
              message="Tente ajustar sua busca"
            />
          ) : (
            <Card.Grid minWidth="280px">
              {pageItems.map(slot => (
                <EquipmentSlotCard
                  key={slot._id}
                  equipmentSlot={slot}
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

          <EquipmentSlotModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onSave={handleSave}
            initialData={editingSlot || {}}
          />

          {importModalOpen && (
            <GenericCSVImport
              isOpen={importModalOpen}
              fieldDefinitions={fields}
              autoMapping={autoMapping}
              onImport={(mappedData) => {
                const transformedData = transformDataForAPI(mappedData);
                handleImport(transformedData);
                setImportModalOpen(false);
              }}
              onClose={() => setImportModalOpen(false)}
              existingData={equipmentSlots}
              isDuplicate={isDuplicate}
              entityNamePlural={entityNamePlural}
            />
          )}
        </>
      )}
    </BaseLayout>
  );
}
