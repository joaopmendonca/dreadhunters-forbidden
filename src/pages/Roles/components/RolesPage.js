import { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import BaseLayout from '../../../shared/components/BaseLayout';
import Card from '../../../shared/components/Card';
import EmptyState from '../../../shared/components/EmptyState';
import Pagination from '../../../shared/components/Pagination';
import Button from '../../../shared/components/Button';
import GenericCSVImport from '../../../shared/components/GenericCSVImport';
import useRoles from '../hooks/useRoles';
import useRolesImport from '../hooks/useRolesImport';
import RoleCard from './RoleCard';
import RoleModal from './RoleModal';
import RolesHeader from './RolesHeader';
import LoadingState from './LoadingState';

const ITEMS_PER_PAGE = 12;

export default function RolesPage() {
  const {
    rolesList = [],
    loading = false,
    fetchRoles,
    handleDelete,
    handleSave,
    handleImport,
    handleExportCSV,
    downloadTemplate,
    filterStatus = 'all',
    setFilterStatus,
    importModalOpen = false,
    setImportModalOpen,
    totalCount = 0
  } = useRoles();

  const rolesImportConfig = useRolesImport();

  const [searchName, setSearchName] = useState('');
  const [page, setPage] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNew = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleEdit = role => {
    setEditing(role);
    setModalOpen(true);
  };

  const handleImportClick = () => {
    setImportModalOpen(true);
  };

  const filtered = rolesList.filter(r =>
    r.name.toLowerCase().includes(searchName.toLowerCase())
  );
  const pageCount = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const pageItems = filtered.slice(
    page * ITEMS_PER_PAGE,
    (page + 1) * ITEMS_PER_PAGE
  );

  return (
    <BaseLayout title="Roles">
      <RolesHeader
        totalCount={totalCount}
        searchName={searchName}
        onSearchChange={(value) => {
          setSearchName(value);
          setPage(0);
        }}
        onNew={handleNew}
        onImport={handleImportClick}
        onExportCSV={handleExportCSV}
        onDownloadTemplate={downloadTemplate}
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
      />

      {loading ? (
        <LoadingState />
      ) : (
        <>
          {pageItems.length === 0 && searchName === '' ? (
            <EmptyState
              icon="🛡️"
              title="Nenhuma role encontrada"
              message="Crie uma nova role para começar"
              action={
                <Button
                  backgroundColor="var(--maroon)"
                  textColor="var(--light)"
                  hoverColor="var(--gold)"
                  icon={<FaPlus />}
                  onClick={handleNew}
                >
                  Criar Role
                </Button>
              }
            />
          ) : pageItems.length === 0 ? (
            <EmptyState
              icon="🔍"
              title="Nenhuma role encontrada"
              message="Tente ajustar sua busca"
            />
          ) : (
            <Card.Grid minWidth="300px">
              {pageItems.map(role => (
                <RoleCard
                  key={role._id}
                  role={role}
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

          <RoleModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onSave={handleSave}
            initialData={editing || {}}
          />

          {importModalOpen && (
            <GenericCSVImport
              isOpen={importModalOpen}
              fieldDefinitions={rolesImportConfig.fields}
              autoMapping={rolesImportConfig.autoMapping}
              onImport={(mappedData) => {
                const transformedData = rolesImportConfig.transformDataForAPI(mappedData);
                handleImport(transformedData);
                setImportModalOpen(false);
              }}
              onClose={() => setImportModalOpen(false)}
              existingData={rolesList}
              isDuplicate={rolesImportConfig.isDuplicate}
              entityNamePlural={rolesImportConfig.entityNamePlural}
            />
          )}
        </>
      )}
    </BaseLayout>
  );
}
