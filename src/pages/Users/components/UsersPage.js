// src/pages/Users/components/UsersPage.js

import React from 'react';
import BaseLayout from '../../../shared/components/BaseLayout';
import Card from '../../../shared/components/Card';
import EmptyState from '../../../shared/components/EmptyState';
import Pagination from '../../../shared/components/Pagination';
import UsersHeader from './UsersHeader';
import UserCard from './UserCard';
import LoadingState from './LoadingState';
import { useUsers } from '../hooks/useUsers';

export default function UsersPage() {
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
    filtered,
    pageItems,
    pageCount,
    totalCount,
    activeCount,
    bannedCount,
    pendingCount,
  } = useUsers();

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
      />

      {loading ? (
        <LoadingState />
      ) : (
        <>
          <Card.Grid minWidth="320px">
            {pageItems.map(user => (
              <UserCard
                key={user._id}
                user={user}
                onDelete={handleDelete}
              />
            ))}
          </Card.Grid>

          {filtered.length === 0 && (
            <EmptyState
              icon="👥"
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
    </BaseLayout>
  );
}
