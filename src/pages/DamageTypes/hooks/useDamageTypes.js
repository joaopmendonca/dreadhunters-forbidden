import { useCallback, useState } from 'react';
import { useSnackbar } from 'notistack';
import Papa from 'papaparse';
import api from '../../../config/api';

const useDamageTypes = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [damageTypes, setDamageTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/damage-types');
      setDamageTypes(response.data);
    } catch {
      enqueueSnackbar('Erro ao buscar tipos de dano', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  const handleDelete = async (id) => {
    if (!window.confirm('Confirma exclusão deste tipo de dano?')) return;
    try {
      await api.delete(`/damage-types/${id}`);
      enqueueSnackbar('Tipo de dano excluído!', { variant: 'success' });
      await fetchData();
    } catch {
      enqueueSnackbar('Erro ao excluir tipo de dano', { variant: 'error' });
    }
  };

  const handleSave = async (formData, id) => {
    try {
      if (id) {
        await api.put(`/damage-types/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        enqueueSnackbar('Tipo de dano atualizado!', { variant: 'success' });
      } else {
        await api.post('/damage-types', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        enqueueSnackbar('Tipo de dano criado!', { variant: 'success' });
      }
      await fetchData();
    } catch (err) {
      const message = err.response?.data?.message || 'Erro ao salvar';
      enqueueSnackbar(message, { variant: 'error' });
      throw err;
    }
  };

  const handleImport = async (items) => {
    const results = { success: 0, error: 0, errors: [] };
    
    for (const item of items) {
      try {
        await api.post('/damage-types', item);
        results.success++;
      } catch (err) {
        results.error++;
        results.errors.push({
          item: item.nome || item.label,
          message: err.response?.data?.message || 'Erro desconhecido'
        });
      }
    }

    if (results.success > 0) {
      enqueueSnackbar(
        `${results.success} tipo(s) de dano importado(s) com sucesso!`,
        { variant: 'success' }
      );
    }

    if (results.error > 0) {
      enqueueSnackbar(
        `${results.error} erro(s) na importação. Verifique o console.`,
        { variant: 'warning' }
      );
      console.error('Erros na importação:', results.errors);
    }

    return results;
  };

  const handleExportCSV = () => {
    const headers = ['nome', 'label', 'descricao', 'cor', 'formula', 'ordem', 'ativo'];
    
    const rows = damageTypes.map(dt => ({
      nome: dt.nome || '',
      label: dt.label || '',
      descricao: dt.descricao || '',
      cor: dt.cor || '',
      formula: dt.formula || '',
      ordem: dt.ordem || 0,
      ativo: dt.ativo ? 'true' : 'false'
    }));

    const csv = Papa.unparse({ fields: headers, data: rows });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `damage_types_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    enqueueSnackbar('CSV exportado com sucesso!', { variant: 'success' });
  };

  const handleDownloadTemplate = () => {
    const headers = ['nome', 'label', 'descricao', 'cor', 'formula', 'ordem', 'ativo'];
    
    const rows = [
      {
        nome: 'physical',
        label: 'Físico',
        descricao: 'Dano físico baseado em força',
        cor: '#ff6b35',
        formula: 'p_atk - target.p_def',
        ordem: 1,
        ativo: 'true'
      }
    ];

    const csv = Papa.unparse({ fields: headers, data: rows });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'damage_types_template.csv';
    link.click();

    enqueueSnackbar('Template baixado!', { variant: 'info' });
  };

  return {
    damageTypes,
    loading,
    fetchData,
    handleDelete,
    handleSave,
    handleImport,
    handleExportCSV,
    handleDownloadTemplate
  };
};

export default useDamageTypes;
