import { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import BaseLayout from '../../../shared/components/BaseLayout';
import Card from '../../../shared/components/Card';
import EmptyState from '../../../shared/components/EmptyState';
import Pagination from '../../../shared/components/Pagination';
import Button from '../../../shared/components/Button';
import GenericCSVImport from '../../../shared/components/GenericCSVImport';
import useCurrency from '../hooks/useCurrency';
import { useCurrencyImport } from '../hooks/useCurrencyImport';
import CurrencyCard from './CurrencyCard';
import CurrencyModal from './CurrencyModal';
import CurrencyHeader from './CurrencyHeader';
import LoadingState from './LoadingState';

const ITEMS_PER_PAGE = 10;

export default function CurrencyPage() {
  const {
    currencyList,
    loading,
    fetchCurrencies,
    handleDelete,
    handleSave,
    handleDeleteIcon,
    handleImportCurrencies,
    handleExportCSV,
    handleDownloadTemplate
  } = useCurrency();

  const {
    fields,
    autoMapping,
    transformDataForAPI,
    isDuplicate,
    entityNamePlural
  } = useCurrencyImport();

  const [searchName, setSearchName] = useState('');
  const [page, setPage] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const handleNew = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleEdit = currency => {
    setEditing(currency);
    setModalOpen(true);
  };

  const filtered = currencyList.filter(c =>
    c.name.toLowerCase().includes(searchName.toLowerCase())
  );
  const pageCount = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const pageItems = filtered.slice(
    page * ITEMS_PER_PAGE,
    (page + 1) * ITEMS_PER_PAGE
  );

  return (
    <BaseLayout title="Moedas">
      <CurrencyHeader
        totalCount={currencyList.length}
        searchName={searchName}
        onSearchChange={(value) => {
          setSearchName(value);
          setPage(0);
        }}
        onNew={handleNew}
        onImport={() => setImportModalOpen(true)}
        onExport={handleExportCSV}
        onDownloadTemplate={handleDownloadTemplate}
      />

      {loading ? (
        <LoadingState />
      ) : (
        <>
          {pageItems.length === 0 && searchName === '' ? (
            <EmptyState
              icon="💰"
              title="Nenhuma moeda encontrada"
              message="Crie uma nova moeda para começar"
              action={
                <Button
                  backgroundColor="var(--maroon)"
                  textColor="var(--light)"
                  hoverColor="var(--gold)"
                  icon={<FaPlus />}
                  onClick={handleNew}
                >
                  Criar Moeda
                </Button>
              }
            />
          ) : pageItems.length === 0 ? (
            <EmptyState
              icon="🔍"
              title="Nenhuma moeda encontrada"
              message="Tente ajustar sua busca"
            />
          ) : (
            <Card.Grid minWidth="280px">
              {pageItems.map(currency => (
                <CurrencyCard
                  key={currency._id}
                  currency={currency}
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

          <CurrencyModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onSave={handleSave}
            onIconDeleted={handleDeleteIcon}
            initialData={editing || {}}
          />

          {importModalOpen && (
            <GenericCSVImport
              isOpen={importModalOpen}
              fieldDefinitions={fields}
              autoMapping={autoMapping}
              onImport={async (currencies) => {
                await handleImportCurrencies(currencies.map(transformDataForAPI));
                setImportModalOpen(false);
                fetchCurrencies();
              }}
              onClose={() => setImportModalOpen(false)}
              existingData={currencyList}
              isDuplicate={isDuplicate}
              entityNamePlural={entityNamePlural}
            />
          )}
        </>
      )}
    </BaseLayout>
  );
}
