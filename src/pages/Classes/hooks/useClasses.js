// src/pages/Classes/hooks/useClasses.js

import { useCallback, useEffect, useRef, useState } from 'react';
import { useSnackbar } from 'notistack';
import api from '../../../config/api';
import { MESSAGES, CSV_TEMPLATE } from '../constants';
import { parseCSV, exportClassesToCSV, generateCSVTemplate, downloadCSV } from '../utils';

export default function useClasses() {
  const { enqueueSnackbar } = useSnackbar();
  const fileInputRef = useRef(null);

  const [classesList, setClassesList] = useState([]);
  const [rolesList, setRolesList] = useState([]);
  const [statsList, setStatsList] = useState([]);
  const [skillsList, setSkillsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [searchName, setSearchName] = useState('');
  const [page, setPage] = useState(0);

  // Fetch classes
  const fetchClasses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/classes');
      setClassesList(res.data);
    } catch (err) {
      console.error('Error fetching classes:', err);
      enqueueSnackbar(MESSAGES.FETCH_ERROR, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  // Fetch roles
  const fetchRoles = useCallback(async () => {
    try {
      const res = await api.get('/roles');
      setRolesList(res.data);
    } catch (err) {
      console.error('Error fetching roles:', err);
    }
  }, []);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get('/status');
      setStatsList(res.data.filter(s => s.tipo === 'base'));
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }, []);

  // Fetch skills
  const fetchSkills = useCallback(async () => {
    try {
      const res = await api.get('/skills');
      setSkillsList(res.data);
    } catch (err) {
      console.error('Error fetching skills:', err);
    }
  }, []);

  // Load all data
  useEffect(() => {
    fetchClasses();
    fetchRoles();
    fetchStats();
    fetchSkills();
  }, [fetchClasses, fetchRoles, fetchStats, fetchSkills]);

  // Open modal for new class
  const handleNew = () => {
    setEditing(null);
    setModalOpen(true);
  };

  // Open modal for editing
  const handleEdit = (cls) => {
    setEditing(cls);
    setModalOpen(true);
  };

  // Delete class
  const handleDelete = async (id) => {
    if (!window.confirm(MESSAGES.DELETE_CONFIRMATION)) return;
    try {
      await api.delete(`/classes/${id}`);
      enqueueSnackbar(MESSAGES.DELETE_SUCCESS, { variant: 'info' });
      setPage(0);
      fetchClasses();
    } catch {
      enqueueSnackbar(MESSAGES.DELETE_ERROR, { variant: 'error' });
    }
  };

  // Save class (create or update)
  const handleSave = async (formData) => {
    try {
      const id = formData.get('_id');
      if (id) {
        await api.patch(`/classes/${id}`, formData);
        enqueueSnackbar(MESSAGES.UPDATE_SUCCESS, { variant: 'success' });
      } else {
        await api.post('/classes', formData);
        enqueueSnackbar(MESSAGES.CREATE_SUCCESS, { variant: 'success' });
      }
      setModalOpen(false);
      fetchClasses();
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || MESSAGES.SAVE_ERROR, { variant: 'error' });
      throw err;
    }
  };

  // Upload CSV
  const handleCSVUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      enqueueSnackbar(MESSAGES.IMPORT_INVALID_FILE, { variant: 'error' });
      return;
    }

    if (!rolesList || rolesList.length === 0) {
      enqueueSnackbar(MESSAGES.IMPORT_WAIT_ROLES, { variant: 'warning' });
      return;
    }
    if (!statsList || statsList.length === 0) {
      enqueueSnackbar(MESSAGES.IMPORT_WAIT_STATS, { variant: 'warning' });
      return;
    }

    setUploading(true);

    try {
      const text = await file.text();
      const classesData = parseCSV(text);

      let created = 0;
      let errors = 0;

      for (const cls of classesData) {
        try {
          const formData = new FormData();
          formData.append('name', cls.name);
          formData.append('description', cls.description || '');
          
          // Find role by name
          const role = rolesList.find(r => r.name === cls.role);
          if (role && role._id) {
            formData.append('role', role._id);
          }

          // Dynamic baseStats
          const baseStats = {};
          statsList.forEach(stat => {
            if (cls[stat.nome]) {
              baseStats[stat.nome] = parseInt(cls[stat.nome]) || 0;
            }
          });
          formData.append('baseStats', JSON.stringify(baseStats));

          // Specials (optional)
          if (cls.specials) {
            formData.append('specials', cls.specials);
          }

          await api.post('/classes', formData);
          created++;
        } catch {
          errors++;
        }
      }

      const message = MESSAGES.IMPORT_SUCCESS_FORMAT
        .replace('{created}', created)
        .replace('{errors}', errors);
      
      enqueueSnackbar(message, { variant: created > 0 ? 'success' : 'warning' });
      fetchClasses();
    } catch {
      enqueueSnackbar(MESSAGES.IMPORT_ERROR, { variant: 'error' });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (classesList.length === 0) {
      enqueueSnackbar(MESSAGES.EXPORT_EMPTY, { variant: 'warning' });
      return;
    }

    const csvContent = exportClassesToCSV(classesList, statsList);
    downloadCSV(csvContent, CSV_TEMPLATE.EXPORT_FILE_NAME);
    enqueueSnackbar(MESSAGES.EXPORT_SUCCESS, { variant: 'success' });
  };

  // Download template
  const handleDownloadTemplate = () => {
    const csvContent = generateCSVTemplate(statsList, CSV_TEMPLATE);
    downloadCSV(csvContent, CSV_TEMPLATE.FILE_NAME);
  };

  return {
    classesList,
    rolesList,
    statsList,
    skillsList,
    loading,
    uploading,
    modalOpen,
    setModalOpen,
    editing,
    searchName,
    setSearchName,
    page,
    setPage,
    fileInputRef,
    handleNew,
    handleEdit,
    handleDelete,
    handleSave,
    handleCSVUpload,
    handleExportCSV,
    handleDownloadTemplate,
  };
}
