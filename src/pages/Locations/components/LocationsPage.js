import { useEffect, useState } from 'react';
import BaseLayout from '../../../shared/components/BaseLayout';
import Card from '../../../shared/components/Card';
import EmptyState from '../../../shared/components/EmptyState';
import Pagination from '../../../shared/components/Pagination';
import GenericCSVImport from '../../../shared/components/GenericCSVImport';
import useLocations from '../hooks/useLocations';
import useLocationsImport from '../hooks/useLocationsImport';
import LocationsHeader from './LocationsHeader';
import LocationCard from './LocationCard';
import LocationModal from './LocationModal';
import LoadingState from './LoadingState';

const ITEMS_PER_PAGE = 10;

export default function LocationsPage() {
  const { 
    locationsList, 
    loading, 
    fetchLocations, 
    handleDelete, 
    handleSave, 
    handleDeleteIcon,
    handleImport,
    handleExportCSV,
    downloadTemplate,
    importModalOpen,
    setImportModalOpen
  } = useLocations();

  const locationsImportConfig = useLocationsImport();

  const [searchName, setSearchName] = useState('');
  const [page, setPage] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleNew = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleEdit = location => {
    setEditing(location);
    setModalOpen(true);
  };

  const handleSaveLocation = async fd => {
    await handleSave(fd, editing?._id);
    setModalOpen(false);
    setEditing(null);
    fetchLocations();
  };

  const handleDeleteLocation = async id => {
    await handleDelete(id);
    fetchLocations();
  };

  const handleDeleteIconInModal = async id => {
    await handleDeleteIcon(id);
    fetchLocations();
  };

  const handleImportClick = () => {
    setImportModalOpen(true);
  };

  const filtered = locationsList.filter(l =>
    l.name?.toLowerCase().includes(searchName.toLowerCase())
  );

  const pageCount = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const pageItems = filtered.slice(
    page * ITEMS_PER_PAGE,
    (page + 1) * ITEMS_PER_PAGE
  );

  return (
    <BaseLayout title="Locais">
      <LocationsHeader
        totalCount={locationsList.length}
        searchName={searchName}
        onSearchChange={value => {
          setSearchName(value);
          setPage(0);
        }}
        onNew={handleNew}
        onImport={handleImportClick}
        onExportCSV={handleExportCSV}
        onDownloadTemplate={downloadTemplate}
      />

      {loading ? (
        <LoadingState />
      ) : (
        <>
          {pageItems.length === 0 && searchName === '' ? (
            <EmptyState
              icon="📍"
              title="Nenhum local encontrado"
              message="Crie um novo local para começar"
            />
          ) : pageItems.length === 0 ? (
            <EmptyState
              icon="🔍"
              title="Nenhum local encontrado"
              message="Tente ajustar sua busca"
            />
          ) : (
            <>
              <Card.Grid minWidth="300px">
                {pageItems.map(location => (
                  <LocationCard
                    key={location._id}
                    location={location}
                    onEdit={() => handleEdit(location)}
                    onDelete={() => handleDeleteLocation(location._id)}
                  />
                ))}
              </Card.Grid>

              {pageCount > 1 && (
                <Pagination
                  currentPage={page}
                  totalPages={pageCount}
                  onPageChange={setPage}
                />
              )}
            </>
          )}

          {importModalOpen && (
            <GenericCSVImport
              isOpen={importModalOpen}
              onClose={() => setImportModalOpen(false)}
              onImport={handleImport}
              existingItems={locationsList}
              config={locationsImportConfig}
            />
          )}

          <LocationModal
            isOpen={modalOpen}
            onClose={() => {
              setModalOpen(false);
              setEditing(null);
            }}
            onSave={handleSaveLocation}
            onIconDeleted={handleDeleteIconInModal}
            initialData={editing || {}}
          />
        </>
      )}
    </BaseLayout>
  );
}
