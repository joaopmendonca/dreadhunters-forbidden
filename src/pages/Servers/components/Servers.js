import React, { useContext } from 'react';
import { useSnackbar } from 'notistack';
import { AuthContext } from '../../../shared/contexts/AuthContext';
import { useServers } from '../hooks/useServers';
import { MESSAGES } from '../constants';
import { ServersPage } from './index';

export default function Servers() {
  const { logout } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const { state, functions } = useServers({ onLogout: logout });

  const handleNew = () => {
    // Reset modal state
  };

  const handleEdit = (server) => {
    // Modal will handle this
  };

  const handleDelete = async (slug) => {
    try {
      await functions.handleDeleteServer(slug);
      enqueueSnackbar(MESSAGES.DELETE_SUCCESS, { variant: 'info' });
    } catch (err) {
      enqueueSnackbar(MESSAGES.ERROR_DELETE, { variant: 'error' });
    }
  };

  const handleSaveServer = async (data) => {
    try {
      await functions.handleSaveServer(data);
      enqueueSnackbar(MESSAGES.SAVE_SUCCESS, { variant: 'success' });
    } catch (err) {
      enqueueSnackbar(
        err.response?.data?.message || MESSAGES.ERROR_SAVE,
        { variant: 'error' }
      );
      throw err;
    }
  };

  return (
    <ServersPage
      loading={state.loading}
      servers={state.servers}
      onNew={handleNew}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onSaveServer={handleSaveServer}
    />
  );
}
