// ============================================================================
// Currency CSV Import - Hook customizado para importação de moedas
// ============================================================================

import { useFieldDefinitions } from '../../../shared/components/GenericCSVImport/hooks';

/**
 * Hook que define a configuração de importação para Moedas
 */
export function useCurrencyImport() {
  const { createField } = useFieldDefinitions();

  // Define os campos de acordo com o schema do backend
  const CURRENCY_FIELDS = [
    createField('name', 'Nome', 'string', {
      required: true,
      unique: true,
      example: 'Ouro'
    }),
    createField('symbol', 'Símbolo', 'string', {
      required: true,
      unique: true,
      example: 'G'
    }),
    createField('slug', 'Slug', 'string', {
      required: true,
      unique: true,
      example: 'gold'
    }),
    createField('description', 'Descrição', 'string', {
      required: false,
      example: 'Moeda principal do jogo'
    })
  ];

  // Mapeamento automático
  const CURRENCY_AUTO_MAPPING = {
    'name': 'name',
    'nome': 'name',
    'symbol': 'symbol',
    'símbolo': 'symbol',
    'simbolo': 'symbol',
    'slug': 'slug',
    'description': 'description',
    'descrição': 'description',
    'descricao': 'description'
  };

  /**
   * Transforma os dados do CSV para o formato esperado pela API
   */
  const transformDataForAPI = (item) => {
    return {
      name: item.name,
      symbol: item.symbol,
      slug: item.slug || item.name.toLowerCase().replace(/\s+/g, '-'),
      description: item.description || ''
    };
  };

  /**
   * Verifica duplicados por nome, símbolo ou slug
   */
  const isDuplicate = (item, existingItems) => {
    return existingItems.some(
      existing => 
        existing.name?.toLowerCase() === item.name?.toLowerCase() ||
        existing.symbol?.toLowerCase() === item.symbol?.toLowerCase() ||
        existing.slug?.toLowerCase() === item.slug?.toLowerCase()
    );
  };

  return {
    fields: CURRENCY_FIELDS,
    autoMapping: CURRENCY_AUTO_MAPPING,
    transformDataForAPI,
    isDuplicate,
    entityName: 'Moeda',
    entityNamePlural: 'Moedas'
  };
}
