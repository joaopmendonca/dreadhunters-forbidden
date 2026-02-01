import React from 'react';
import BaseLayout from '../../../shared/components/BaseLayout';
import EmptyState from '../../../shared/components/EmptyState';
import Pagination from '../../../shared/components/Pagination';
import Card from '../../../shared/components/Card';
import Button from '../../../shared/components/Button';
import GenericCSVImport from '../../../shared/components/GenericCSVImport';
import { FaPlus } from 'react-icons/fa';
import { useSkills } from '../hooks/useSkills';
import { useSkillsImport } from '../hooks/useSkillsImport';
import { SkillsHeader } from './SkillsHeader';
import { SkillCard } from './SkillCard';
import { SkillModal } from './SkillModal';
import { LoadingState } from './LoadingState';

export function SkillsPage() {
  const {
    skills,
    loading,
    searchName,
    setSearchName,
    filterType,
    setFilterType,
    page,
    setPage,
    modalOpen,
    setModalOpen,
    importModalOpen,
    setImportModalOpen,
    editingSkill,
    handleNew,
    handleEdit,
    handleDelete,
    handleSave,
    handleImportSkills,
    handleExportCSV,
    handleDownloadTemplate,
    pageCount,
    pageItems,
    totalCount,
    activeCount,
    passiveCount
  } = useSkills();

  const {
    fields: fieldDefinitions,
    autoMapping,
    transformDataForAPI,
    isDuplicate,
    entityNamePlural
  } = useSkillsImport();

  return (
    <BaseLayout title="Skills">
      <SkillsHeader
        onNew={handleNew}
        onImport={() => setImportModalOpen(true)}
        onExportCSV={handleExportCSV}
        onDownloadTemplate={handleDownloadTemplate}
        searchName={searchName}
        onSearchChange={(val) => {
          setSearchName(val);
          setPage(0);
        }}
        filterType={filterType}
        onFilterChange={(type) => {
          setFilterType(type);
          setPage(0);
        }}
        totalCount={totalCount}
        activeCount={activeCount}
        passiveCount={passiveCount}
      />

      {loading ? (
        <LoadingState />
      ) : (
        <>
          {pageItems.length === 0 ? (
            <EmptyState
              icon="✨"
              title="Nenhuma skill encontrada"
              message="Crie uma nova skill para começar"
              action={
                <Button
                  backgroundColor="var(--maroon)"
                  textColor="var(--light)"
                  hoverColor="var(--gold)"
                  icon={<FaPlus />}
                  onClick={handleNew}
                >
                  Criar Skill
                </Button>
              }
            />
          ) : (
            <Card.Grid minWidth="320px">
              {pageItems.map(skill => (
                <SkillCard
                  key={skill._id}
                  skill={skill}
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

          {modalOpen && (
            <SkillModal
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
              onSave={handleSave}
              initialData={editingSkill || {}}
            />
          )}

          {importModalOpen && (
            <GenericCSVImport
              isOpen={importModalOpen}
              fieldDefinitions={fieldDefinitions}
              autoMapping={autoMapping}
              onImport={(mappedData) => {
                const transformedData = transformDataForAPI(mappedData);
                handleImportSkills(transformedData);
                setImportModalOpen(false);
              }}
              onClose={() => setImportModalOpen(false)}
              existingData={skills}
              isDuplicate={isDuplicate}
              entityNamePlural={entityNamePlural}
            />
          )}
        </>
      )}
    </BaseLayout>
  );
}
