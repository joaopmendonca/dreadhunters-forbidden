// src/pages/Characters/components/CharactersPage.js

import React from 'react';
import BaseLayout from '../../../shared/components/BaseLayout';
import Card from '../../../shared/components/Card';
import EmptyState from '../../../shared/components/EmptyState';
import Button from '../../../shared/components/Button';
import Pagination from '../../../shared/components/Pagination';
import { FaPlus } from 'react-icons/fa';
import CharactersHeader from './CharactersHeader';
import CharacterCard from './CharacterCard';
import LoadingState from './LoadingState';
import CharacterModal from './CharacterModal';
import { useCharacters } from '../hooks/useCharacters';

export default function CharactersPage() {
  const {
    classes,
    loading,
    uploading,
    page,
    setPage,
    searchName,
    filterClass,
    modalOpen,
    setModalOpen,
    editingCharacter,
    fileInputRef,
    handleNew,
    handleEdit,
    handleDelete,
    handleSave,
    handleCSVUpload,
    handleDownloadTemplate,
    handleExportCSV,
    handleSearch,
    handleFilterChange,
    handleIconDeleted,
    filtered,
    pageItems,
    pageCount,
    totalCount,
  } = useCharacters();

  return (
    <BaseLayout title="NPCs">
      <CharactersHeader
        totalCount={totalCount}
        classes={classes}
        characters={pageItems}
        searchName={searchName}
        filterClass={filterClass}
        uploading={uploading}
        fileInputRef={fileInputRef}
        onNew={handleNew}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        onCSVUpload={handleCSVUpload}
        onExportCSV={handleExportCSV}
        onDownloadTemplate={handleDownloadTemplate}
      />

      {loading ? (
        <LoadingState />
      ) : (
        <>
          <Card.Grid minWidth="320px">
            {pageItems.map((ch) => (
              <CharacterCard
                key={ch._id}
                character={ch}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </Card.Grid>

          {filtered.length === 0 && (
            <EmptyState
              icon="🧙"
              message="Nenhum NPC encontrado."
              action={
                <Button
                  backgroundColor="var(--maroon)"
                  textColor="var(--light)"
                  hoverColor="var(--gold)"
                  icon={<FaPlus />}
                  onClick={handleNew}
                >
                  Criar Primeiro NPC
                </Button>
              }
            />
          )}

          <Pagination
            pageCount={pageCount}
            currentPage={page}
            onPageChange={setPage}
          />

          <CharacterModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onSave={handleSave}
            onIconDeleted={handleIconDeleted}
            initialData={editingCharacter}
            classes={classes}
          />
        </>
      )}
    </BaseLayout>
  );
}
