import { useEffect, useRef, useState } from 'react';
import BaseLayout from '../../../shared/components/BaseLayout';
import Card from '../../../shared/components/Card';
import EmptyState from '../../../shared/components/EmptyState';
import Pagination from '../../../shared/components/Pagination';
import useAfflictions from '../hooks/useAfflictions';
import AfflictionCard from './AfflictionCard';
import AfflictionModal from './AfflictionModal';
import AfflictionsHeader from './AfflictionsHeader';
import LoadingState from './LoadingState';
import styles from '../styles/Afflictions.module.css';

const ITEMS_PER_PAGE = 9;

export default function AfflictionsPage() {
  const fileInputRef = useRef(null);
  const {
    afflictions,
    loading,
    fetchData,
    handleDelete,
    handleSave,
    handleCSVUpload,
    handleExportCSV,
    downloadTemplate
  } = useAfflictions();

  const [uploading, setUploading] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [filterTipo, setFilterTipo] = useState('all');
  const [page, setPage] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAffliction, setEditing] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const handleNew = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleEdit = affliction => {
    setEditing(affliction);
    setModalOpen(true);
  };

  const handleCSVUploadEvent = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      await handleCSVUpload(file);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const filtered = afflictions.filter(a => {
    const matchName = a.nome?.toLowerCase().includes(searchName.toLowerCase());
    const matchTipo = filterTipo === 'all' || a.tipo === filterTipo;
    return matchName && matchTipo;
  });

  const totalCount = afflictions.length;
  const mentalCount = afflictions.filter(a => a.tipo === 'mental').length;
  const fisicaCount = afflictions.filter(a => a.tipo === 'fisica').length;

  const pageCount = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const pageItems = filtered.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  return (
    <BaseLayout title="Aflições">
      <AfflictionsHeader
        totalCount={totalCount}
        mentalCount={mentalCount}
        fisicaCount={fisicaCount}
        searchName={searchName}
        onSearchChange={(value) => {
          setSearchName(value);
          setPage(0);
        }}
        filterTipo={filterTipo}
        onFilterChange={(tipo) => {
          setFilterTipo(tipo);
          setPage(0);
        }}
        onNew={handleNew}
        onUploadCSV={handleCSVUploadEvent}
        onExportCSV={handleExportCSV}
        onDownloadTemplate={downloadTemplate}
        uploading={uploading}
        fileInputRef={fileInputRef}
      />

      {loading ? (
        <LoadingState />
      ) : (
        <>
          <Card.Grid minWidth="380px">
            {pageItems.map(affliction => (
              <AfflictionCard
                key={affliction._id}
                affliction={affliction}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </Card.Grid>

          {filtered.length === 0 && (
            <EmptyState
              icon="💀"
              title="Nenhuma aflição encontrada"
              message="Tente ajustar sua busca ou crie uma nova aflição"
            />
          )}

          <Pagination
            pageCount={pageCount}
            currentPage={page}
            onPageChange={setPage}
          />

          <AfflictionModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onSave={handleSave}
            initialData={editingAffliction || {}}
          />
        </>
      )}
    </BaseLayout>
  );
}
