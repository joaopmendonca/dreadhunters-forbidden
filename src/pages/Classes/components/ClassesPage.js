// src/pages/Classes/components/ClassesPage.js

import React from 'react';
import { FaPlus } from 'react-icons/fa';
import BaseLayout from '../../../shared/components/BaseLayout';
import Button from '../../../shared/components/Button';
import Card from '../../../shared/components/Card';
import EmptyState from '../../../shared/components/EmptyState';
import Pagination from '../../../shared/components/Pagination';
import ClassesHeader from './ClassesHeader';
import ClassCard from './ClassCard';
import LoadingState from './LoadingState';
import { PAGE_TITLE, ITEMS_PER_PAGE, EMPTY_STATE } from '../constants';
import { filterByName, paginateItems } from '../utils';
import useClasses from '../hooks/useClasses';

export default function ClassesPage() {
  const {
    classesList,
    rolesList,
    statsList,
    skillsList,
    loading,
    uploading,
    modalOpen,
    setModalOpen,
    editing,
    searchName,
    setSearchName,
    filterRole,
    setFilterRole,
    page,
    setPage,
    fileInputRef,
    handleNew,
    handleEdit,
    handleDelete,
    handleSave,
    handleCSVUpload,
    handleExportCSV,
    handleDownloadTemplate,
  } = useClasses();

  // Lazy load ClassModal
  const ClassModal = React.lazy(() => import('./ClassModal'));

  // Contadores por role
  const totalCount = classesList.length;
  const roleCounters = rolesList.reduce((acc, role) => {
    acc[role._id] = classesList.filter(c => c.role?._id === role._id || c.role === role._id).length;
    return acc;
  }, {});

  // Filter and paginate
  const filtered = classesList.filter(cls => {
    const matchName = cls.name?.toLowerCase().includes(searchName.toLowerCase());
    const matchRole = filterRole === 'all' || cls.role?._id === filterRole || cls.role === filterRole;
    return matchName && matchRole;
  });
  const pageCount = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const pageItems = paginateItems(filtered, page, ITEMS_PER_PAGE);

  return (
    <BaseLayout title={PAGE_TITLE}>
      <ClassesHeader
        totalCount={totalCount}
        rolesList={rolesList}
        roleCounters={roleCounters}
        filterRole={filterRole}
        onFilterChange={(role) => {
          setFilterRole(role);
          setPage(0);
        }}
        onNew={handleNew}
        onImport={handleCSVUpload}
        onExport={handleExportCSV}
        onDownloadTemplate={handleDownloadTemplate}
        searchName={searchName}
        onSearchChange={(e) => {
          setSearchName(e.target.value);
          setPage(0);
        }}
        uploading={uploading}
        fileInputRef={fileInputRef}
      />

      {loading ? (
        <LoadingState />
      ) : (
        <>
          {pageItems.length === 0 ? (
            <EmptyState
              icon={EMPTY_STATE.ICON}
              title={EMPTY_STATE.TITLE}
              message={EMPTY_STATE.MESSAGE}
              action={
                <Button
                  backgroundColor="var(--maroon)"
                  textColor="var(--light)"
                  hoverColor="var(--gold)"
                  icon={<FaPlus />}
                  onClick={handleNew}
                >
                  Criar Classe
                </Button>
              }
            />
          ) : (
            <Card.Grid columns="3" minWidth="320px">
              {pageItems.map(cls => (
                <ClassCard
                  key={cls._id}
                  cls={cls}
                  statsList={statsList}
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
        </>
      )}

      {modalOpen && (
        <React.Suspense fallback={<div>Carregando...</div>}>
          <ClassModal
            isOpen={modalOpen}
            initialData={editing}
            onClose={() => setModalOpen(false)}
            onSave={handleSave}
            rolesList={rolesList}
            skillsList={skillsList}
          />
        </React.Suspense>
      )}
    </BaseLayout>
  );
}
