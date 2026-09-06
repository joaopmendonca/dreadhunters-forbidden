import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import Papa from 'papaparse';
import { useSnackbar } from 'notistack';
import BaseLayout from '../../../shared/components/BaseLayout';
import Card from '../../../shared/components/Card';
import EmptyState from '../../../shared/components/EmptyState';
import Button from '../../../shared/components/Button';
import Pagination from '../../../shared/components/Pagination';
import GenericCSVImport from '../../../shared/components/GenericCSVImport';
import PlayableCharactersHeader from './PlayableCharactersHeader';
import PlayableCharacterCard from './PlayableCharacterCard';
import PlayableCharacterModal from './PlayableCharacterModal';
import LoadingState from './LoadingState';
import { usePlayableCharacters } from '../hooks/usePlayableCharacters';
import { usePlayableCharactersImport } from '../hooks/usePlayableCharactersImport';

const CSV_FIELDS = ['name', 'class', 'baseLevel', 'gender', 'unlockType', 'description'];

export default function PlayableCharactersPage() {
  const { enqueueSnackbar } = useSnackbar();
  const [showImport, setShowImport] = useState(false);

  const {
    templates, classes, items, loading,
    search, setSearch, classFilter, setClassFilter,
    page, setPage, pageCount, pageItems, filtered, totalCount,
    modalOpen, setModalOpen, editing,
    handleNew, handleEdit, handleDelete, handleSave, handleImport, fetchData,
  } = usePlayableCharacters();

  const { fieldDefinitions, autoMapping, transformDataForAPI, isDuplicate, entityNamePlural } =
    usePlayableCharactersImport();

  const handleExportCSV = () => {
    if (!templates.length) {
      enqueueSnackbar('Nada para exportar.', { variant: 'warning' });
      return;
    }
    const rows = templates.map((t) => ({
      name: t.name || '',
      class: t.className && t.className !== '—' ? t.className : '',
      baseLevel: t.baseLevel ?? 1,
      gender: t.gender || 'male',
      unlockType: t.unlockRule?.type || 'starter',
      description: (t.description || '').replace(/\n/g, ' '),
    }));
    const csv = Papa.unparse({ fields: CSV_FIELDS, data: rows });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `playable_characters_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleDownloadTemplate = () => {
    const example = {
      name: 'Bermond', class: 'Vigilante',
      baseLevel: 1, gender: 'male', unlockType: 'starter',
      description: 'Investigador veterano.',
    };
    const csv = Papa.unparse({ fields: CSV_FIELDS, data: [example] });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'playable_characters_template.csv';
    link.click();
  };

  return (
    <BaseLayout title="Personagens Jogáveis">
      <PlayableCharactersHeader
        totalCount={totalCount}
        templates={templates}
        classes={classes}
        search={search}
        classFilter={classFilter}
        onNew={handleNew}
        onSearch={setSearch}
        onClassChange={setClassFilter}
        onOpenImport={() => setShowImport(true)}
        onExportCSV={handleExportCSV}
        onDownloadTemplate={handleDownloadTemplate}
      />

      {loading ? (
        <LoadingState />
      ) : (
        <>
          <Card.Grid minWidth="320px">
            {pageItems.map((tpl) => (
              <PlayableCharacterCard key={tpl._id} template={tpl} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
          </Card.Grid>

          {filtered.length === 0 && (
            <EmptyState
              icon="🧝"
              message="Nenhum personagem jogável cadastrado."
              action={
                <Button
                  backgroundColor="var(--maroon)"
                  textColor="var(--light)"
                  hoverColor="var(--gold)"
                  icon={<FaPlus />}
                  onClick={handleNew}
                >
                  Criar Primeiro Personagem
                </Button>
              }
            />
          )}

          <Pagination pageCount={pageCount} currentPage={page} onPageChange={setPage} />

          <PlayableCharacterModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onSave={handleSave}
            initialData={editing}
            classes={classes}
            items={items}
          />
        </>
      )}

      <GenericCSVImport
        isOpen={showImport}
        fieldDefinitions={fieldDefinitions}
        autoMapping={autoMapping}
        onImport={async (rows) => {
          await handleImport(rows.map(transformDataForAPI));
          setShowImport(false);
          await fetchData();
        }}
        onClose={() => setShowImport(false)}
        existingData={filtered}
        isDuplicate={isDuplicate}
        entityNamePlural={entityNamePlural}
      />
    </BaseLayout>
  );
}
