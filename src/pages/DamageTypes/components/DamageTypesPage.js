import { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import BaseLayout from '../../../shared/components/BaseLayout';
import Card from '../../../shared/components/Card';
import EmptyState from '../../../shared/components/EmptyState';
import Pagination from '../../../shared/components/Pagination';
import Button from '../../../shared/components/Button';
import GenericCSVImport from '../../../shared/components/GenericCSVImport';
import useDamageTypes from '../hooks/useDamageTypes';
import { useDamageTypesImport } from '../hooks/useDamageTypesImport';
import DamageTypeCard from './DamageTypeCard';
import DamageTypeModal from './DamageTypeModal';
import DamageTypesHeader from './DamageTypesHeader';
import LoadingState from './LoadingState';

const ITEMS_PER_PAGE = 12;

export default function DamageTypesPage() {
  const {
    damageTypes,
    loading,
    fetchData,
    handleDelete,
    handleSave,
    handleImport,
    handleExportCSV,
    handleDownloadTemplate
  } = useDamageTypes();

  const {
    fields,
    autoMapping,
    transformDataForAPI,
    isDuplicate,
    entityNamePlural
  } = useDamageTypesImport();

  const [searchName, setSearchName] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [editingDamageType, setEditing] = useState(null);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNew = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleEdit = (damageType) => {
    setEditing(damageType);
    setModalOpen(true);
  };

  // Contadores por status
  const totalCount = damageTypes.length;
  const activeCount = damageTypes.filter(dt => dt.ativo === true).length;
  const inactiveCount = damageTypes.filter(dt => dt.ativo === false).length;

  const filtered = damageTypes.filter(dt => {
    const matchName = dt.label?.toLowerCase().includes(searchName.toLowerCase()) ||
                      dt.nome?.toLowerCase().includes(searchName.toLowerCase());
    const matchStatus = filterStatus === 'all' || 
                       (filterStatus === 'active' && dt.ativo === true) ||
                       (filterStatus === 'inactive' && dt.ativo === false);
    return matchName && matchStatus;
  });

  const pageCount = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const pageItems = filtered.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  return (
    <BaseLayout title="Tipos de Dano">
      <DamageTypesHeader
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
              icon="⚔️"
              title="Nenhum tipo de dano encontrado"
              message="Crie um novo tipo de dano para começar"
              action={
                <Button
                  backgroundColor="var(--maroon)"
                  textColor="var(--light)"
                  hoverColor="var(--gold)"
                  icon={<FaPlus />}
                  onClick={handleNew}
                >
                  Criar Tipo de Dano
                </Button>
              }
            />
          ) : pageItems.length === 0 ? (
            <EmptyState
              icon="🔍"
              title="Nenhum tipo de dano encontrado"
              message="Tente ajustar sua busca"
            />
          ) : (
            <Card.Grid minWidth="280px">
              {pageItems.map(damageType => (
                <DamageTypeCard
                  key={damageType._id}
                  damageType={damageType}
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

          <DamageTypeModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onSave={handleSave}
            initialData={editingDamageType || {}}
          />

          {importModalOpen && (
            <GenericCSVImport
              fieldDefinitions={fields}
              autoMapping={autoMapping}
              onImport={async (items) => {
                await handleImport(items.map(transformDataForAPI));
                setImportModalOpen(false);
                fetchData();
              }}
              onClose={() => setImportModalOpen(false)}
              existingData={damageTypes}
              isDuplicate={isDuplicate}
              entityNamePlural={entityNamePlural}
            />
          )}
        </>
      )}
    </BaseLayout>
  );
}
