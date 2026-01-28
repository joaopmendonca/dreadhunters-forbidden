import React, { useState } from 'react';
import BaseLayout from '../../../shared/components/BaseLayout';
import Card from '../../../shared/components/Card';
import EmptyState from '../../../shared/components/EmptyState';
import Pagination from '../../../shared/components/Pagination';
import { LoadingState } from './LoadingState';
import { ServersHeader } from './ServersHeader';
import { ServerCard } from './ServerCard';
import { ServerModal } from './ServerModal';

const ITEMS_PER_PAGE = 10;

export const ServersPage = ({
  loading,
  servers,
  onNew,
  onEdit,
  onDelete,
  onSaveServer,
}) => {
  const [searchSlug, setSearchSlug] = useState('');
  const [page, setPage] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const handleNew = () => {
    setEditing(null);
    setModalOpen(true);
    onNew();
  };

  const handleEdit = (server) => {
    setEditing(server);
    setModalOpen(true);
    onEdit(server);
  };

  const handleDelete = (slug) => {
    if (!window.confirm('Confirma exclusão do servidor?')) return;
    onDelete(slug);
  };

  const handleSaveServer = async (data) => {
    await onSaveServer(data);
    setModalOpen(false);
  };

  const filtered = servers.filter((s) =>
    s.slug.toLowerCase().includes(searchSlug.toLowerCase())
  );
  const pageCount = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const pageItems = filtered.slice(
    page * ITEMS_PER_PAGE,
    (page + 1) * ITEMS_PER_PAGE
  );

  return (
    <BaseLayout title="Servidores">
      <ServersHeader
        totalServers={servers.length}
        searchSlug={searchSlug}
        onSearchChange={(value) => {
          setSearchSlug(value);
          setPage(0);
        }}
        onNew={handleNew}
      />

      {loading ? (
        <LoadingState />
      ) : (
        <>
          <Card.Grid minWidth="300px">
            {pageItems.map((server) => (
              <ServerCard
                key={server.slug}
                server={server}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </Card.Grid>

          {filtered.length === 0 && (
            <EmptyState message="Nenhum servidor encontrado." />
          )}

          <Pagination
            pageCount={pageCount}
            currentPage={page}
            onPageChange={setPage}
          />

          <ServerModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onSave={handleSaveServer}
            initialData={editing}
          />
        </>
      )}
    </BaseLayout>
  );
};
