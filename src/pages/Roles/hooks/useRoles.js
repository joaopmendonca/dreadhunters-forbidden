import { useCallback, useState } from 'react';
import { useSnackbar } from 'notistack';
import api from '../../../config/api';

const useRoles = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [rolesList, setRolesList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/roles');
      setRolesList(res.data);
    } catch {
      enqueueSnackbar('Falha ao buscar roles.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  const handleDelete = async (id) => {
    if (!window.confirm('Confirma exclusão da role?')) return;
    try {
      await api.delete(`/roles/${id}`);
      enqueueSnackbar('Role removida.', { variant: 'info' });
      await fetchRoles();
    } catch {
      enqueueSnackbar('Erro ao remover role.', { variant: 'error' });
    }
  };

  const handleSave = async (payload, id) => {
    try {
      if (id) {
        await api.put(`/roles/${id}`, {
          name: payload.name,
          description: payload.description
        });
        enqueueSnackbar('Role atualizada com sucesso.', { variant: 'success' });
      } else {
        await api.post('/roles', {
          name: payload.name,
          description: payload.description
        });
        enqueueSnackbar('Role criada com sucesso.', { variant: 'success' });
      }
      await fetchRoles();
    } catch (err) {
      enqueueSnackbar(
        err.response?.data?.message || 'Erro ao salvar role.',
        { variant: 'error' }
      );
      throw err;
    }
  };

  const parseCSV = (text) => {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const values = [];
      let current = '';
      let inQuotes = false;
      
      for (const char of lines[i]) {
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim());

      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = values[index] || '';
      });
      data.push(obj);
    }
    return data;
  };

  const handleCSVUpload = async (file) => {
    if (!file.name.endsWith('.csv')) {
      enqueueSnackbar('Selecione um arquivo CSV', { variant: 'error' });
      return;
    }

    try {
      const text = await file.text();
      const rolesData = parseCSV(text);

      let created = 0;
      let errors = 0;

      for (const role of rolesData) {
        try {
          await api.post('/roles', {
            name: role.name,
            description: role.description || ''
          });
          created++;
        } catch {
          errors++;
        }
      }

      enqueueSnackbar(`Importação: ${created} criadas, ${errors} erros`, 
        { variant: created > 0 ? 'success' : 'warning' });
      await fetchRoles();
    } catch {
      enqueueSnackbar('Erro ao processar CSV', { variant: 'error' });
    }
  };

  const handleExportCSV = () => {
    if (rolesList.length === 0) {
      enqueueSnackbar('Nenhuma role para exportar', { variant: 'warning' });
      return;
    }

    const lines = ['name,description'];
    for (const role of rolesList) {
      lines.push([
        role.name,
        `"${(role.description || '').replace(/"/g, '""')}"`
      ].join(','));
    }

    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'roles-export.csv';
    link.click();
    enqueueSnackbar('Exportado com sucesso!', { variant: 'success' });
  };

  const downloadTemplate = () => {
    const csv = `name,description
Admin,"Acesso total ao sistema"
Player,"Jogador padrão"`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'template-roles.csv';
    link.click();
  };

  return {
    rolesList,
    loading,
    fetchRoles,
    handleDelete,
    handleSave,
    handleCSVUpload,
    handleExportCSV,
    downloadTemplate
  };
};

export default useRoles;
