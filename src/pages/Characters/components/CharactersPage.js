// src/pages/Characters/components/CharactersPage.js

import React, { useState } from 'react';
import BaseLayout from '../../../shared/components/BaseLayout';
import Card from '../../../shared/components/Card';
import EmptyState from '../../../shared/components/EmptyState';
import Button from '../../../shared/components/Button';
import Pagination from '../../../shared/components/Pagination';
import GenericCSVImport from '../../../shared/components/GenericCSVImport';
import { FaPlus } from 'react-icons/fa';
import CharactersHeader from './CharactersHeader';
import CharacterCard from './CharacterCard';
import LoadingState from './LoadingState';
import CharacterModal from './CharacterModal';
import { useCharacters } from '../hooks/useCharacters';
import { useCharactersImport } from '../hooks/useCharactersImport';

export default function CharactersPage() {
  const [showImportModal, setShowImportModal] = useState(false);

  const {
    classes,
    loading,
    page,
    setPage,
    searchName,
    filterClass,
    modalOpen,
    setModalOpen,
    editingCharacter,
    handleNew,
    handleEdit,
    handleDelete,
    handleSave,
    handleImport: importNPCs,
    handleDownloadTemplate,
    handleExportCSV,
    handleSearch,
    handleFilterChange,
    handleIconDeleted,
    fetchData,
    filtered,
    pageItems,
    pageCount,
    totalCount,
  } = useCharacters();

  const { fieldDefinitions, autoMapping, transformDataForAPI, isDuplicate, entityNamePlural } = useCharactersImport();

  return (
    <BaseLayout title="NPCs">
      <CharactersHeader
        totalCount={totalCount}
        classes={classes}
        characters={pageItems}
        searchName={searchName}
        filterClass={filterClass}
        onNew={handleNew}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        onOpenImport={() => setShowImportModal(true)}
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

      {showImportModal && (
        <GenericCSVImport
          fieldDefinitions={fieldDefinitions}
          autoMapping={autoMapping}
          onImport={async (npcs) => {
            await importNPCs(npcs.map(transformDataForAPI));
            setShowImportModal(false);
            await fetchData();
          }}
          onClose={() => setShowImportModal(false)}
          existingData={filtered}
          isDuplicate={isDuplicate}
          entityNamePlural={entityNamePlural}
        />
      )}
    </BaseLayout>
  );
}
