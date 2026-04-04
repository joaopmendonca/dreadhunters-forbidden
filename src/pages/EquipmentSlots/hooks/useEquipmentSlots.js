import { useCallback, useState } from 'react';
import { useSnackbar } from 'notistack';
import Papa from 'papaparse';
import api from '../../../config/api';
import { equipmentSlotToCSV } from '../utils';

const useEquipmentSlots = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [equipmentSlots, setEquipmentSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/equipment-slots');
      setEquipmentSlots(response.data);
    } catch {
      enqueueSnackbar('Erro ao buscar slots de equipamento', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  const handleDelete = async (id) => {
    if (!window.confirm('Confirma exclusão deste slot de equipamento?')) return;

    try {
      await api.delete(`/equipment-slots/${id}`);
      enqueueSnackbar('Slot excluído!', { variant: 'success' });
      await fetchData();
    } catch (err) {
      const message = err.response?.data?.message || 'Erro ao excluir slot';
      enqueueSnackbar(message, { variant: 'error' });
    }
  };

  const handleSave = async (formData, id) => {
    try {
      if (id) {
        await api.put(`/equipment-slots/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        enqueueSnackbar('Slot atualizado!', { variant: 'success' });
      } else {
        await api.post('/equipment-slots', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        enqueueSnackbar('Slot criado!', { variant: 'success' });
      }

      await fetchData();
    } catch (err) {
      const message = err.response?.data?.message || 'Erro ao salvar slot';
      enqueueSnackbar(message, { variant: 'error' });
      throw err;
    }
  };

  const handleImport = async (slots) => {
    const results = { success: 0, error: 0, errors: [] };

    for (const slot of slots) {
      try {
        await api.post('/equipment-slots', slot);
        results.success++;
      } catch (err) {
        results.error++;
        results.errors.push({
          item: slot.key || slot.name,
          message: err.response?.data?.message || 'Erro desconhecido'
        });
      }
    }

    if (results.success > 0) {
      enqueueSnackbar(`${results.success} slot(s) importado(s) com sucesso!`, { variant: 'success' });
      await fetchData();
    }

    if (results.error > 0) {
      enqueueSnackbar(`${results.error} erro(s) na importação. Verifique o console.`, { variant: 'warning' });
      console.error('Erros na importação de slots:', results.errors);
    }

    return results;
  };

  const handleExportCSV = () => {
    const headers = ['key', 'name', 'description', 'maxItems', 'order', 'active'];
    const rows = equipmentSlots.map(equipmentSlotToCSV);

    const csv = Papa.unparse({ fields: headers, data: rows });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `equipment_slots_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    enqueueSnackbar('CSV exportado com sucesso!', { variant: 'success' });
  };

  const handleDownloadTemplate = () => {
    const headers = ['key', 'name', 'description', 'maxItems', 'order', 'active'];
    const rows = [
      {
        key: 'head',
        name: 'Cabeca',
        description: 'Slot para elmos e capuzes',
        maxItems: 1,
        order: 1,
        active: 'true'
      }
    ];

    const csv = Papa.unparse({ fields: headers, data: rows });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'equipment_slots_template.csv';
    link.click();

    enqueueSnackbar('Template baixado!', { variant: 'info' });
  };

  return {
    equipmentSlots,
    loading,
    fetchData,
    handleDelete,
    handleSave,
    handleImport,
    handleExportCSV,
    handleDownloadTemplate
  };
};

export default useEquipmentSlots;
