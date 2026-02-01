import { useCallback, useEffect, useRef, useState } from 'react';
import { useSnackbar } from 'notistack';
import api from '../../../config/api';
import { parseCSV, exportToCSV } from '../utils';

const ITEMS_PER_PAGE = 12;

export const useAttributes = () => {
  const { enqueueSnackbar } = useSnackbar();
  const fileInputRef = useRef(null);

  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [page, setPage] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAttribute, setEditing] = useState(null);

  const fetchAttributes = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/status');
      setAttributes(data);
    } catch {
      enqueueSnackbar('Erro ao buscar atributos', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    fetchAttributes();
  }, [fetchAttributes]);

  const handleNew = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleEdit = (attribute) => {
    setEditing(attribute);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Confirma exclusão?')) return;
    try {
      await api.delete(`/status/${id}`);
      enqueueSnackbar('Atributo excluído!', { variant: 'success' });
      fetchAttributes();
    } catch {
      enqueueSnackbar('Erro ao excluir atributo', { variant: 'error' });
    }
  };

  const handleSave = async (formData, id) => {
    try {
      if (id) {
        await api.put(`/status/${id}`, formData);
        enqueueSnackbar('Atributo atualizado com sucesso!', { variant: 'success' });
      } else {
        await api.post('/status', formData);
        enqueueSnackbar('Atributo criado com sucesso!', { variant: 'success' });
      }
      fetchAttributes();
      setModalOpen(false);
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || 'Erro ao salvar atributo', { variant: 'error' });
      throw err;
    }
  };

  // Upload CSV
  const handleCSVUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      enqueueSnackbar('Por favor, selecione um arquivo CSV', { variant: 'error' });
      return;
    }

    setUploading(true);

    try {
      const text = await file.text();
      const attributesData = parseCSV(text);

      let created = 0;
      let errors = 0;

      for (const attribute of attributesData) {
        try {
          const formData = new FormData();
          formData.append('nome', attribute.nome);
          formData.append('label', attribute.label || attribute.nome);
          formData.append('tipo', attribute.tipo || 'base');
          formData.append('descricao', attribute.descricao || '');
          formData.append('unidade', attribute.unidade || 'pontos');
          formData.append('formula', attribute.formula || '');
          formData.append('visivel', attribute.visivel === 'true' || attribute.visivel === true);
          formData.append('ordem', parseInt(attribute.ordem) || 0);

          await api.post('/status', formData);
          created++;
        } catch {
          errors++;
        }
      }

      enqueueSnackbar(`Importação: ${created} criados, ${errors} erros`, 
        { variant: created > 0 ? 'success' : 'warning' });
      fetchAttributes();
    } catch {
      enqueueSnackbar('Erro ao processar CSV', { variant: 'error' });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Download template CSV
  const handleDownloadTemplate = () => {
    const csv = `nome,label,tipo,descricao,unidade,formula,visivel,ordem
str,STR,base,Força - Aumenta dano físico e capacidade de carga,pontos,,true,1
dex,DEX,base,Destreza - Aumenta velocidade de ataque e evasão,pontos,,true,2`;
    exportToCSV(csv, 'template-attributes.csv');
  };

  // Export CSV
  const handleExportCSV = () => {
    if (attributes.length === 0) {
      enqueueSnackbar('Nenhum atributo para exportar', { variant: 'warning' });
      return;
    }

    const lines = ['nome,label,tipo,descricao,unidade,formula,visivel,ordem'];
    for (const attr of attributes) {
      lines.push([
        attr.nome,
        attr.label || attr.nome,
        attr.tipo || 'base',
        `"${(attr.descricao || '').replace(/"/g, '""')}"`,
        attr.unidade || 'pontos',
        `"${(attr.formula || '').replace(/"/g, '""')}"`,
        attr.visivel !== false ? 'true' : 'false',
        attr.ordem || 0
      ].join(','));
    }

    exportToCSV(lines.join('\n'), 'attributes-export.csv');
    enqueueSnackbar('Exportado com sucesso!', { variant: 'success' });
  };

  // Import de atributos via GenericCSVImport
  const handleImport = async (attributes) => {
    let created = 0;
    let errors = 0;

    for (const attribute of attributes) {
      try {
        await api.post('/status', attribute);
        created++;
      } catch (error) {
        console.error('Error importing attribute:', attribute, error);
        errors++;
      }
    }

    const message = `Importação concluída: ${created} atributo(s) criado(s), ${errors} erro(s).`;
    enqueueSnackbar(message, { variant: created > 0 ? 'success' : 'warning' });
    fetchAttributes();
  };

  // Contadores
  const totalCount = attributes.length;
  const baseCount = attributes.filter(a => a.tipo === 'base').length;
  const derivedCount = attributes.filter(a => a.tipo === 'derivado').length;

  // Filtro + paginação
  const filtered = attributes.filter(a => {
    const matchesSearch = a.nome?.toLowerCase().includes(searchName.toLowerCase()) ||
      a.label?.toLowerCase().includes(searchName.toLowerCase());
    const matchesType = filterType === 'all' || a.tipo === filterType;
    return matchesSearch && matchesType;
  });

  const pageCount = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const pageItems = filtered.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  return {
    attributes,
    loading,
    uploading,
    searchName,
    setSearchName,
    filterType,
    setFilterType,
    page,
    setPage,
    modalOpen,
    setModalOpen,
    editingAttribute,
    handleNew,
    handleEdit,
    handleDelete,
    handleSave,
    handleImport,
    handleCSVUpload,
    handleExportCSV,
    handleDownloadTemplate,
    totalCount,
    baseCount,
    derivedCount,
    pageCount,
    pageItems,
    fileInputRef,
    fetchAttributes
  };
};
