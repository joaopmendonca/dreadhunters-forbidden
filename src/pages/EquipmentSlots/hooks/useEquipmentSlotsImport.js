import { useFieldDefinitions } from '../../../shared/components/GenericCSVImport/hooks';

export function useEquipmentSlotsImport() {
  const { createField } = useFieldDefinitions();

  const fields = [
    createField('key', 'Key', 'string', {
      required: true,
      unique: true,
      example: 'head'
    }),
    createField('name', 'Nome', 'string', {
      required: true,
      example: 'Cabeca'
    }),
    createField('description', 'Descricao', 'string', {
      required: false,
      example: 'Slot para elmos e capuzes'
    }),
    createField('maxItems', 'Max Items', 'number', {
      required: false,
      example: '1'
    }),
    createField('order', 'Ordem', 'number', {
      required: false,
      example: '0'
    }),
    createField('active', 'Ativo', 'boolean', {
      required: false,
      example: 'true'
    })
  ];

  const autoMapping = {
    key: 'key',
    slot_key: 'key',
    slot: 'key',
    name: 'name',
    nome: 'name',
    label: 'name',
    description: 'description',
    descricao: 'description',
    desc: 'description',
    maxitems: 'maxItems',
    max_items: 'maxItems',
    limite: 'maxItems',
    order: 'order',
    ordem: 'order',
    active: 'active',
    ativo: 'active'
  };

  const transformDataForAPI = (mappedData) => {
    return mappedData.map(slot => ({
      key: slot.key?.toLowerCase().trim(),
      name: slot.name?.trim(),
      description: slot.description?.trim() || '',
      maxItems: parseInt(slot.maxItems, 10) || 1,
      order: parseInt(slot.order, 10) || 0,
      active: slot.active === true || slot.active === 'true' || slot.active === '1'
    }));
  };

  const isDuplicate = (slot, existingData) => {
    return existingData.some(
      existing => existing.key?.toLowerCase() === slot.key?.toLowerCase()
    );
  };

  const entityNamePlural = 'Slots de Equipamento';

  return {
    fields,
    autoMapping,
    transformDataForAPI,
    isDuplicate,
    entityNamePlural
  };
}
