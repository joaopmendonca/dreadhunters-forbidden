import { useCallback, useState } from 'react';
import { useSnackbar } from 'notistack';
import api from '../../../config/api';

const useAfflictions = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [afflictions, setAfflictions] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [afflictionsRes, statusRes] = await Promise.all([
        api.get('/afflictions'),
        api.get('/status')
      ]);
      setAfflictions(afflictionsRes.data);
      setStatusList(statusRes.data);
    } catch {
      enqueueSnackbar('Erro ao buscar dados', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  const handleDelete = async (id) => {
    if (!window.confirm('Confirma exclusão?')) return;
    try {
      await api.delete(`/afflictions/${id}`);
      enqueueSnackbar('Aflição excluída!', { variant: 'success' });
      await fetchData();
    } catch {
      enqueueSnackbar('Erro ao excluir aflição', { variant: 'error' });
    }
  };

  const handleSave = async (formData, id) => {
    try {
      if (id) {
        await api.put(`/afflictions/${id}`, formData);
        enqueueSnackbar('Aflição atualizada!', { variant: 'success' });
      } else {
        await api.post('/afflictions', formData);
        enqueueSnackbar('Aflição criada!', { variant: 'success' });
      }
      await fetchData();
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || 'Erro ao salvar', { variant: 'error' });
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

  const parsePenalties = (penaltyStr) => {
    if (!penaltyStr) return [];
    return penaltyStr.split('|').map(p => {
      const [statName, value] = p.split(':');
      const status = statusList.find(s => s.nome === statName);
      return { status: status?._id || null, modificador: value || '' };
    }).filter(p => p.status);
  };

  const handleCSVUpload = async (file) => {
    if (!file.name.endsWith('.csv')) {
      enqueueSnackbar('Selecione um arquivo CSV', { variant: 'error' });
      return;
    }

    if (statusList.length === 0) {
      enqueueSnackbar('Carregue os status primeiro', { variant: 'error' });
      return;
    }

    try {
      const text = await file.text();
      const afflictionData = parseCSV(text);

      let created = 0;
      let errors = 0;

      for (const aff of afflictionData) {
        try {
          const payload = {
            nome: aff.nome,
            tipo: aff.tipo,
            descricao: aff.descricao,
            niveis: [
              { severidade: 'leve', penalidades: parsePenalties(aff.nivel_leve) },
              { severidade: 'media', penalidades: parsePenalties(aff.nivel_medio) },
              { severidade: 'grave', penalidades: parsePenalties(aff.nivel_grave) }
            ]
          };
          await api.post('/afflictions', payload);
          created++;
        } catch {
          errors++;
        }
      }

      enqueueSnackbar(`Importação: ${created} criadas, ${errors} erros`,
        { variant: created > 0 ? 'success' : 'warning' });
      await fetchData();
    } catch {
      enqueueSnackbar('Erro ao processar CSV', { variant: 'error' });
    }
  };

  const handleExportCSV = () => {
    if (afflictions.length === 0) {
      enqueueSnackbar('Nenhuma aflição para exportar', { variant: 'warning' });
      return;
    }

    const statusMap = {};
    statusList.forEach(s => { statusMap[s._id] = s.nome; });

    const formatPenalties = (pens) => {
      if (!pens || pens.length === 0) return '';
      return pens.map(p => {
        const name = statusMap[p.status?._id || p.status] || 'unknown';
        return `${name}:${p.modificador}`;
      }).join('|');
    };

    const lines = ['nome,tipo,descricao,nivel_leve,nivel_medio,nivel_grave'];
    for (const aff of afflictions) {
      const leve = aff.niveis?.find(n => n.severidade === 'leve');
      const media = aff.niveis?.find(n => n.severidade === 'media');
      const grave = aff.niveis?.find(n => n.severidade === 'grave');
      lines.push([
        aff.nome, aff.tipo,
        `"${(aff.descricao || '').replace(/"/g, '""')}"`,
        formatPenalties(leve?.penalidades),
        formatPenalties(media?.penalidades),
        formatPenalties(grave?.penalidades)
      ].join(','));
    }

    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'afflictions-export.csv';
    link.click();
    enqueueSnackbar('Exportado com sucesso!', { variant: 'success' });
  };

  const downloadTemplate = () => {
    const csv = `nome,tipo,descricao,nivel_leve,nivel_medio,nivel_grave
Exemplo Mental,mental,"Descrição aqui",max_sp:-1|accuracy:-15,max_sp:-1|accuracy:-25,max_sp:-2|accuracy:-35`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'template-afflictions.csv';
    link.click();
  };

  return {
    afflictions,
    statusList,
    loading,
    fetchData,
    handleDelete,
    handleSave,
    handleCSVUpload,
    handleExportCSV,
    downloadTemplate
  };
};

export default useAfflictions;
