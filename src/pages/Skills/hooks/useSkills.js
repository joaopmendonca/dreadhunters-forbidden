import { useCallback, useEffect, useRef, useState } from 'react';
import { useSnackbar } from 'notistack';
import api from '../../../config/api';
import { parseCSV, exportToCSV } from '../utils';

const ITEMS_PER_PAGE = 12;

export const useSkills = () => {
  const { enqueueSnackbar } = useSnackbar();
  const fileInputRef = useRef(null);

  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [page, setPage] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [editingSkill, setEditing] = useState(null);

  const fetchSkills = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/skills');
      setSkills(data);
    } catch {
      enqueueSnackbar('Erro ao buscar skills', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const handleNew = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleEdit = (skill) => {
    setEditing(skill);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Confirma exclusão?')) return;
    try {
      await api.delete(`/skills/${id}`);
      enqueueSnackbar('Skill excluída!', { variant: 'success' });
      fetchSkills();
    } catch {
      enqueueSnackbar('Erro ao excluir skill', { variant: 'error' });
    }
  };

  const handleSave = async (formData, id) => {
    try {
      if (id) {
        await api.put(`/skills/${id}`, formData);
        enqueueSnackbar('Skill atualizada com sucesso!', { variant: 'success' });
      } else {
        await api.post('/skills', formData);
        enqueueSnackbar('Skill criada com sucesso!', { variant: 'success' });
      }
      fetchSkills();
      setModalOpen(false);
    } catch (err) {
      // Tratar erros de validação
      if (err.response?.status === 400 && err.response?.data) {
        const errorData = err.response.data;
        
        // Se for um objeto com array de erros (formato do SkillValidationService)
        if (errorData.errors && Array.isArray(errorData.errors)) {
          errorData.errors.forEach(error => {
            enqueueSnackbar(`❌ ${error.field}: ${error.message}`, { variant: 'error', autoHideDuration: 5000 });
          });
        }
        // Se for um array direto de erros
        else if (Array.isArray(errorData)) {
          errorData.forEach(error => {
            enqueueSnackbar(`❌ ${error.field}: ${error.message}`, { variant: 'error', autoHideDuration: 5000 });
          });
        } 
        // Se for um objeto com campo message
        else if (errorData.message) {
          enqueueSnackbar(`❌ ${errorData.message}`, { variant: 'error' });
        }
        // Fallback
        else {
          enqueueSnackbar('❌ Erro de validação ao salvar skill', { variant: 'error' });
        }
      } else {
        enqueueSnackbar(err.response?.data?.message || 'Erro ao salvar skill', { variant: 'error' });
      }
      throw err;
    }
  };

  // Import de skills via GenericCSVImport
  // eslint-disable-next-line no-unused-vars
  const handleImportSkills = async (skills) => {
    let created = 0;
    let errors = 0;

    for (const skill of skills) {
      try {
        await api.post('/skills', skill);
        created++;
      } catch (error) {
        console.error('Error importing skill:', skill, error);
        errors++;
      }
    }

    const message = `Importação concluída: ${created} skill(s) criada(s), ${errors} erro(s).`;
    enqueueSnackbar(message, { variant: created > 0 ? 'success' : 'warning' });
    fetchSkills();
  };

  // Upload CSV (legacy - mantido para compatibilidade)
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
      const skillsData = parseCSV(text);

      let created = 0;
      let errors = 0;

      for (const skill of skillsData) {
        try {
          const formData = new FormData();
          formData.append('name', skill.name);
          formData.append('description', skill.description || '');
          formData.append('type', skill.type || 'active');
          formData.append('levelRequirement', parseInt(skill.levelRequirement) || 1);

          await api.post('/skills', formData);
          created++;
        } catch {
          errors++;
        }
      }

      enqueueSnackbar(`Importação: ${created} criadas, ${errors} erros`, 
        { variant: created > 0 ? 'success' : 'warning' });
      fetchSkills();
    } catch {
      enqueueSnackbar('Erro ao processar CSV', { variant: 'error' });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (skills.length === 0) {
      enqueueSnackbar('Nenhuma skill para exportar', { variant: 'warning' });
      return;
    }

    const lines = ['name,description,type,levelRequirement'];
    for (const skill of skills) {
      lines.push([
        skill.name,
        `"${(skill.description || '').replace(/"/g, '""')}"`,
        skill.type || 'active',
        skill.levelRequirement || 1
      ].join(','));
    }

    exportToCSV(lines.join('\n'), 'skills-export.csv');
    enqueueSnackbar('Exportado com sucesso!', { variant: 'success' });
  };

  // Download template CSV
  const handleDownloadTemplate = () => {
    const csv = `name,description,type,levelRequirement
Golpe Certeiro,"Ataque físico preciso",active,1`;
    exportToCSV(csv, 'template-skills.csv');
  };

  // Contadores por tipo
  const totalCount = skills.length;
  const activeCount = skills.filter(s => s.type === 'active').length;
  const passiveCount = skills.filter(s => s.type === 'passive').length;

  // filtro + paginação
  const filtered = skills.filter(s => {
    const matchName = s.name?.toLowerCase().includes(searchName.toLowerCase());
    const matchType = filterType === 'all' || s.type === filterType;
    return matchName && matchType;
  });
  const pageCount = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const pageItems = filtered.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  return {
    skills,
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
    importModalOpen,
    setImportModalOpen,
    editingSkill,
    handleNew,
    handleEdit,
    handleDelete,
    handleSave,
    handleCSVUpload,
    handleImportSkills,
    handleExportCSV,
    handleDownloadTemplate,
    pageCount,
    pageItems,
    fileInputRef,
    fetchSkills,
    totalCount,
    activeCount,
    passiveCount
  };
};
