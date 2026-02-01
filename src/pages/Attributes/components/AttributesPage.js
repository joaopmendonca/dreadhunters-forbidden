import React from 'react';
import BaseLayout from '../../../shared/components/BaseLayout';
import EmptyState from '../../../shared/components/EmptyState';
import Pagination from '../../../shared/components/Pagination';
import Card from '../../../shared/components/Card';
import Button from '../../../shared/components/Button';
import GenericCSVImport from '../../../shared/components/GenericCSVImport';
import { FaPlus } from 'react-icons/fa';
import { useAttributes } from '../hooks/useAttributes';
import { useAttributesImport } from '../hooks/useAttributesImport';
import { AttributesHeader } from './AttributesHeader';
import { AttributeCard } from './AttributeCard';
import { AttributeModal } from './AttributeModal';
import { LoadingState } from './LoadingState';

export function AttributesPage() {
  const {
    attributes,
    loading,
    uploading,
    searchName,
    setSearchName,
    filterType,
    setFilterType,
    page,
    setPage,
    modalOpen,
    setModalOpen,
    editingAttribute,
    handleNew,
    handleEdit,
    handleDelete,
    handleSave,
    handleImport,
    handleCSVUpload,
    handleExportCSV,
    handleDownloadTemplate,
    totalCount,
    baseCount,
    derivedCount,
    pageCount,
    pageItems,
    fileInputRef
  } = useAttributes();

  const {
    fields: fieldDefinitions,
    autoMapping,
    transformDataForAPI,
    isDuplicate,
    entityNamePlural
  } = useAttributesImport();

  const [importModalOpen, setImportModalOpen] = React.useState(false);

  return (
    <BaseLayout title="Atributos">
      <AttributesHeader
        onNew={handleNew}
        onImport={() => setImportModalOpen(true)}
        onCSVUpload={handleCSVUpload}
        onExportCSV={handleExportCSV}
        onDownloadTemplate={handleDownloadTemplate}
        searchName={searchName}
        onSearchChange={setSearchName}
        uploading={uploading}
        fileInputRef={fileInputRef}
        totalCount={totalCount}
        baseCount={baseCount}
        derivedCount={derivedCount}
        filterType={filterType}
        setFilterType={setFilterType}
        page={page}
        setPage={setPage}
      />

      {loading ? (
        <LoadingState />
      ) : (
        <>
          {pageItems.length === 0 ? (
            <EmptyState
              icon="📊"
              title="Nenhum atributo encontrado"
              message="Crie um novo atributo para começar"
              action={
                <Button
                  backgroundColor="var(--maroon)"
                  textColor="var(--light)"
                  hoverColor="var(--gold)"
                  icon={<FaPlus />}
                  onClick={handleNew}
                >
                  Criar Atributo
                </Button>
              }
            />
          ) : (
            <Card.Grid minWidth="320px">
              {pageItems.map(attribute => (
                <AttributeCard
                  key={attribute._id}
                  attribute={attribute}
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

          <AttributeModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onSave={handleSave}
            initialData={editingAttribute || {}}
          />

          <GenericCSVImport
            isOpen={importModalOpen}
            fieldDefinitions={fieldDefinitions}
            autoMapping={autoMapping}
            onImport={(mappedData) => {
              const transformedData = transformDataForAPI(mappedData);
              handleImport(transformedData);
              setImportModalOpen(false);
            }}
            onClose={() => setImportModalOpen(false)}
            existingData={attributes}
            isDuplicate={isDuplicate}
            entityNamePlural={entityNamePlural}
          />
        </>
      )}
    </BaseLayout>
  );
}
