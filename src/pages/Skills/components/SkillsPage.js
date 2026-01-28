import React from 'react';
import BaseLayout from '../../../shared/components/BaseLayout';
import EmptyState from '../../../shared/components/EmptyState';
import Pagination from '../../../shared/components/Pagination';
import Card from '../../../shared/components/Card';
import Button from '../../../shared/components/Button';
import { FaPlus } from 'react-icons/fa';
import { useSkills } from '../hooks/useSkills';
import { SkillsHeader } from './SkillsHeader';
import { SkillCard } from './SkillCard';
import { SkillModal } from './SkillModal';
import { LoadingState } from './LoadingState';

export function SkillsPage() {
  const {
    skills,
    loading,
    uploading,
    searchName,
    setSearchName,
    page,
    setPage,
    modalOpen,
    setModalOpen,
    editingSkill,
    handleNew,
    handleEdit,
    handleDelete,
    handleSave,
    handleCSVUpload,
    handleExportCSV,
    handleDownloadTemplate,
    pageCount,
    pageItems,
    fileInputRef
  } = useSkills();

  return (
    <BaseLayout title="Skills">
      <SkillsHeader
        onNew={handleNew}
        onCSVUpload={handleCSVUpload}
        onExportCSV={handleExportCSV}
        onDownloadTemplate={handleDownloadTemplate}
        searchName={searchName}
        onSearchChange={(val) => {
          setSearchName(val);
          setPage(0);
        }}
        uploading={uploading}
        fileInputRef={fileInputRef}
        skillsCount={skills.length}
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

          <SkillModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onSave={handleSave}
            initialData={editingSkill || {}}
          />
        </>
      )}
    </BaseLayout>
  );
}
