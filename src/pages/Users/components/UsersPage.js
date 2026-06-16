import React, { useState } from 'react';
import BaseLayout from '../../../shared/components/BaseLayout';
import Card from '../../../shared/components/Card';
import EmptyState from '../../../shared/components/EmptyState';
import Pagination from '../../../shared/components/Pagination';
import GenericCSVImport from '../../../shared/components/GenericCSVImport';
import UsersHeader from './UsersHeader';
import UserCard from './UserCard';
import LoadingState from './LoadingState';
import { useUsers } from '../hooks/useUsers';
import { useUsersImport } from '../hooks/useUsersImport';

export default function UsersPage() {
  const [showImportModal, setShowImportModal] = useState(false);

  const {
    loading,
    page,
    setPage,
    searchName,
    filterStatus,
    handleSearch,
    handleFilterChange,
    handleDelete,
    handleExportCSV,
    handleDownloadTemplate,
    handleImport: importUsers,
    fetchUsers,
    filtered,
    pageItems,
    pageCount,
    totalCount,
    activeCount,
    bannedCount,
    pendingCount,
  } = useUsers();

  const { fieldDefinitions, autoMapping, transformDataForAPI } = useUsersImport();

  return (
    <BaseLayout title="Usuários">
      <UsersHeader
        totalCount={totalCount}
        activeCount={activeCount}
        bannedCount={bannedCount}
        pendingCount={pendingCount}
        searchName={searchName}
        filterStatus={filterStatus}
        onSearchChange={handleSearch}
        onFilterChange={handleFilterChange}
        onExportCSV={handleExportCSV}
        onDownloadTemplate={handleDownloadTemplate}
        onOpenImport={() => setShowImportModal(true)}
      />

      {loading ? (
        <LoadingState />
      ) : (
        <>
          <Card.Grid minWidth="320px">
            {pageItems.map((user) => (
              <UserCard
                key={user._id}
                user={user}
                onDelete={handleDelete}
              />
            ))}
          </Card.Grid>

          {filtered.length === 0 && (
            <EmptyState
              icon="users"
              message="Nenhum usuário encontrado."
            />
          )}

          <Pagination
            pageCount={pageCount}
            currentPage={page}
            onPageChange={setPage}
          />
        </>
      )}

      <GenericCSVImport
        isOpen={showImportModal}
        fieldDefinitions={fieldDefinitions}
        autoMapping={autoMapping}
        onImport={async (users) => {
          await importUsers(users.map(transformDataForAPI));
          setShowImportModal(false);
          await fetchUsers();
        }}
        onClose={() => setShowImportModal(false)}
        entityNamePlural="usuários"
      />
    </BaseLayout>
  );
}
