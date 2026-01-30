import { useCallback, useRef, useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import Papa from 'papaparse';
import api from '../../../config/api';
import { MESSAGES } from '../constants';
import { useStatus } from '../../../shared/hooks/useStatus';

export default function useItems() {
  const [itemsList, setItemsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { baseStatus } = useStatus();
  const fileInputRef = useRef(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/items');
      setItemsList(data);
    } catch (err) {
      enqueueSnackbar(MESSAGES.FETCH_ERROR, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  const handleDelete = async (id) => {
    if (!window.confirm(MESSAGES.DELETE_CONFIRM)) return;
    try {
      await api.delete(`/items/${id}`);
      enqueueSnackbar(MESSAGES.DELETE_SUCCESS, { variant: 'success' });
      fetchItems();
    } catch (err) {
      enqueueSnackbar(
        err.response?.data?.message || MESSAGES.DELETE_ERROR,
        { variant: 'error' }
      );
    }
  };

  const handleSave = async (formData, id) => {
    try {
      if (id) {
        await api.put(`/items/${id}`, formData);
        enqueueSnackbar(MESSAGES.SAVE_SUCCESS_UPDATE, { variant: 'success' });
      } else {
        await api.post('/items', formData);
        enqueueSnackbar(MESSAGES.SAVE_SUCCESS_CREATE, { variant: 'success' });
      }
      fetchItems();
    } catch (err) {
      enqueueSnackbar(
        err.response?.data?.message || MESSAGES.SAVE_ERROR,
        { variant: 'error' }
      );
      throw err;
    }
  };

  const handleDeleteIcon = async (id) => {
    try {
      await api.delete(`/items/${id}/icon`);
      enqueueSnackbar(MESSAGES.ICON_DELETE_SUCCESS, { variant: 'success' });
      fetchItems();
    } catch (err) {
      enqueueSnackbar(MESSAGES.ICON_DELETE_ERROR, { variant: 'error' });
      throw err;
    }
  };

  // Upload CSV
  const handleCSVUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      enqueueSnackbar('Por favor, selecione um arquivo CSV válido.', { variant: 'error' });
      return;
    }

    if (!baseStatus || baseStatus.length === 0) {
      enqueueSnackbar('Aguarde o carregamento dos atributos do sistema.', { variant: 'warning' });
      return;
    }

    setUploading(true);

    try {
      const text = await file.text();
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          let created = 0;
          let errors = 0;

          for (const row of results.data) {
            try {
              const formData = new FormData();
              
              // Campos básicos
              formData.append('name', row.name || row.Nome || '');
              formData.append('description', row.description || row['Descrição'] || '');
              formData.append('type', row.type || row.Tipo || '');
              formData.append('rarity', row.rarity || row.Raridade || '');
              formData.append('buyPrice', row.buyPrice || row['Preço de Compra'] || '0');
              formData.append('sellPrice', row.sellPrice || row['Preço de Venda'] || '0');
              formData.append('stackable', row.stackable || row['Empilhável'] || 'false');
              formData.append('isInitial', row.isInitial || row['Item Inicial'] || 'false');

              if (row.maxStack || row['Máximo por Pilha']) {
                formData.append('maxStack', row.maxStack || row['Máximo por Pilha']);
              }

              // Campos de equipamento com combatStats dinâmicos
              if ((row.type || row.Tipo) === 'equipment') {
                const equipment = {
                  slot: row.equipmentSlot || row['Slot de Equipamento'] || '',
                  durability: {
                    current: parseInt(row.durabilityCurrent || row['Durabilidade Atual'] || '0'),
                    max: parseInt(row.durabilityMax || row['Durabilidade Máxima'] || '0')
                  },
                  isPrimary: (row.isPrimary || row['Primária'] || 'true') === 'true',
                  hands: parseInt(row.hands || row['Mãos'] || '1'),
                  ammoCurrent: parseInt(row.ammoCurrent || row['Munição Atual'] || '0'),
                  ammoMax: parseInt(row.ammoMax || row['Munição Máxima'] || '0'),
                  combatStats: {}
                };

                // Stats dinâmicos baseados em baseStatus
                baseStatus.forEach(status => {
                  const value = parseInt(row[status.nome] || row[status.label] || '0');
                  if (value) {
                    equipment.combatStats[status.nome] = value;
                  }
                });

                formData.append('equipment', JSON.stringify(equipment));
              }

              // Campos de consumível
              if ((row.type || row.Tipo) === 'consumable') {
                const consumable = {
                  hpRestore: parseInt(row.hpRestore || row['HP Restaurado'] || '0'),
                  mpRestore: parseInt(row.mpRestore || row['MP Restaurado'] || '0'),
                  buff: row.buff || row.Buff || '',
                  buffDuration: parseInt(row.buffDuration || row['Duração do Buff'] || '0')
                };
                formData.append('consumable', JSON.stringify(consumable));
              }

              // Tags para materiais
              if ((row.type || row.Tipo) === 'material' && (row.tags || row.Tags)) {
                const tags = (row.tags || row.Tags).split(',').map(t => t.trim()).filter(Boolean);
                formData.append('tags', JSON.stringify(tags));
              }

              await api.post('/items', formData);
              created++;
            } catch (error) {
              console.error('Error importing item:', row, error);
              errors++;
            }
          }

          const message = `Importação concluída: ${created} item(ns) criado(s), ${errors} erro(s).`;
          enqueueSnackbar(message, { variant: created > 0 ? 'success' : 'warning' });
          fetchItems();
          setUploading(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
        },
        error: (error) => {
          console.error('CSV parse error:', error);
          enqueueSnackbar('Erro ao processar o arquivo CSV.', { variant: 'error' });
          setUploading(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
        }
      });
    } catch (error) {
      console.error('File read error:', error);
      enqueueSnackbar('Erro ao ler o arquivo.', { variant: 'error' });
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (itemsList.length === 0) {
      enqueueSnackbar('Não há itens para exportar.', { variant: 'warning' });
      return;
    }

    if (!baseStatus || baseStatus.length === 0) {
      enqueueSnackbar('Aguarde o carregamento dos atributos do sistema.', { variant: 'warning' });
      return;
    }

    // Headers básicos + stats dinâmicos
    const basicHeaders = [
      'name', 'description', 'type', 'rarity', 'buyPrice', 'sellPrice',
      'stackable', 'maxStack', 'equipmentSlot', 'durabilityCurrent', 'durabilityMax',
      'isPrimary', 'hands', 'ammoCurrent', 'ammoMax',
      'hpRestore', 'mpRestore', 'buff', 'buffDuration', 'tags', 'isInitial'
    ];
    
    const statHeaders = baseStatus.map(s => s.nome);
    const headers = [...basicHeaders, ...statHeaders];

    const rows = itemsList.map(item => {
      const row = {
        name: item.name,
        description: item.description,
        type: item.type,
        rarity: item.rarity,
        buyPrice: item.buyPrice || 0,
        sellPrice: item.sellPrice || 0,
        stackable: item.stackable || false,
        maxStack: item.maxStack || '',
        equipmentSlot: item.equipment?.slot || '',
        durabilityCurrent: item.equipment?.durability?.current || '',
        durabilityMax: item.equipment?.durability?.max || '',
        isPrimary: item.equipment?.isPrimary ?? '',
        hands: item.equipment?.hands || '',
        ammoCurrent: item.equipment?.ammoCurrent || '',
        ammoMax: item.equipment?.ammoMax || '',
        hpRestore: item.consumable?.hpRestore || '',
        mpRestore: item.consumable?.mpRestore || '',
        buff: item.consumable?.buff || '',
        buffDuration: item.consumable?.buffDuration || '',
        tags: item.tags?.join(', ') || '',
        isInitial: item.isInitial || false
      };

      // Adiciona stats dinâmicos
      baseStatus.forEach(status => {
        row[status.nome] = item.equipment?.combatStats?.[status.nome] || '';
      });

      return row;
    });

    const csv = Papa.unparse({ fields: headers, data: rows });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `items_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    enqueueSnackbar('Itens exportados com sucesso!', { variant: 'success' });
  };

  // Download template
  const handleDownloadTemplate = () => {
    if (!baseStatus || baseStatus.length === 0) {
      enqueueSnackbar('Aguarde o carregamento dos atributos do sistema.', { variant: 'warning' });
      return;
    }

    const basicHeaders = [
      'name', 'description', 'type', 'rarity', 'buyPrice', 'sellPrice',
      'stackable', 'maxStack', 'equipmentSlot', 'durabilityCurrent', 'durabilityMax',
      'isPrimary', 'hands', 'ammoCurrent', 'ammoMax',
      'hpRestore', 'mpRestore', 'buff', 'buffDuration', 'tags', 'isInitial'
    ];
    
    const statHeaders = baseStatus.map(s => s.nome);
    const headers = [...basicHeaders, ...statHeaders];

    const example = {
      name: 'Espada Longa',
      description: 'Uma espada de lâmina longa e afiada',
      type: 'equipment',
      rarity: 'common',
      buyPrice: 100,
      sellPrice: 50,
      stackable: false,
      maxStack: 1,
      equipmentSlot: 'weapon',
      durabilityCurrent: 100,
      durabilityMax: 100,
      isPrimary: true,
      hands: 1,
      ammoCurrent: 0,
      ammoMax: 0,
      hpRestore: '',
      mpRestore: '',
      buff: '',
      buffDuration: '',
      tags: '',
      isInitial: false
    };

    // Adiciona exemplo de stats dinâmicos
    baseStatus.forEach((status, index) => {
      example[status.nome] = index === 0 ? 5 : ''; // Primeiro stat com valor 5, resto vazio
    });

    const csv = Papa.unparse({ fields: headers, data: [example] });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'template_items.csv';
    link.click();
  };

  // Importação em lote via GenericCSVImport
  const handleImportItems = async (items) => {
    let created = 0;
    let errors = 0;

    for (const itemData of items) {
      try {
        const formData = new FormData();
        
        // Campos básicos
        formData.append('name', itemData.name || '');
        formData.append('description', itemData.description || '');
        formData.append('type', itemData.type || '');
        formData.append('rarity', itemData.rarity || '');
        formData.append('buyPrice', itemData.buyPrice || '0');
        formData.append('sellPrice', itemData.sellPrice || '0');
        formData.append('stackable', itemData.stackable || 'false');
        formData.append('isInitial', itemData.isInitial || 'false');

        if (itemData.maxStack) {
          formData.append('maxStack', itemData.maxStack);
        }

        // Campos de equipamento
        if (itemData.type === 'equipment' && itemData.equipment) {
          formData.append('equipment', JSON.stringify(itemData.equipment));
        }

        // Campos de consumível
        if (itemData.type === 'consumable' && itemData.consumable) {
          formData.append('consumable', JSON.stringify(itemData.consumable));
        }

        // Tags para materiais
        if (itemData.type === 'material' && itemData.tags) {
          formData.append('tags', JSON.stringify(itemData.tags));
        }

        await api.post('/items', formData);
        created++;
      } catch (error) {
        console.error('Error importing item:', itemData, error);
        errors++;
      }
    }

    const message = `Importação concluída: ${created} item(ns) criado(s), ${errors} erro(s).`;
    enqueueSnackbar(message, { variant: created > 0 ? 'success' : 'warning' });
    return { created, errors };
  };

  return {
    itemsList,
    loading,
    uploading,
    fileInputRef,
    fetchItems,
    handleDelete,
    handleSave,
    handleDeleteIcon,
    handleCSVUpload,
    handleExportCSV,
    handleDownloadTemplate,
    handleImportItems
  };
}
