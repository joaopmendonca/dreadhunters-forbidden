// ============================================================================
// useCSVImport - Hook Principal
// ============================================================================

import { useState, useCallback } from 'react';
import Papa from 'papaparse';
import { useSnackbar } from 'notistack';
import { autoDetectMapping, convertData, validateData } from '../utils/csvProcessing';
import { downloadTemplate, downloadErrorReport } from '../utils/download';

export function useCSVImport({
  fieldDefinitions,
  autoMapping,
  onImport,
  existingData,
  validateRow,
  parseValue,
  isDuplicate,
  entityNamePlural,
  csvOptions
}) {
  const { enqueueSnackbar } = useSnackbar();
  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [rawData, setRawData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [mapping, setMapping] = useState({});
  const [validationResult, setValidationResult] = useState(null);
  const [importResult, setImportResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [duplicateAction, setDuplicateAction] = useState('skip');

  // ─── Processa arquivo CSV ─────────────────────────────────────────────────
  const handleFileSelect = useCallback((selectedFile) => {
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.csv')) {
      setError('Por favor, selecione um arquivo CSV válido.');
      return;
    }

    setFile(selectedFile);
    setError('');
    setIsLoading(true);

    const parseOptions = {
      header: false,
      skipEmptyLines: true,
      encoding: 'UTF-8',
      ...csvOptions,
      complete: (results) => {
        if (results.data.length < 2) {
          setError('O arquivo CSV está vazio ou não tem dados suficientes.');
          setIsLoading(false);
          return;
        }

        const csvHeaders = results.data[0];
        const csvData = results.data.slice(1);

        setHeaders(csvHeaders);
        setRawData(csvData);
        setMapping(autoDetectMapping(csvHeaders, autoMapping));
        setStep(2);
        setIsLoading(false);
      },
      error: (err) => {
        setError('Erro ao ler o arquivo: ' + err.message);
        setIsLoading(false);
      }
    };

    Papa.parse(selectedFile, parseOptions);
  }, [autoMapping, csvOptions]);

  // ─── Atualiza mapeamento ──────────────────────────────────────────────────
  const handleMappingChange = useCallback((csvIndex, systemField) => {
    setMapping(prev => {
      const newMapping = { ...prev };
      
      Object.keys(newMapping).forEach(key => {
        if (newMapping[key] === systemField) {
          delete newMapping[key];
        }
      });

      if (systemField) {
        newMapping[csvIndex] = systemField;
      } else {
        delete newMapping[csvIndex];
      }

      return newMapping;
    });
  }, []);

  // ─── Valida os dados ──────────────────────────────────────────────────────
  const handleValidate = useCallback(() => {
    const requiredFields = fieldDefinitions.filter(f => f.required);
    const mappedFields = Object.values(mapping);
    
    const missingRequired = requiredFields.filter(
      field => !mappedFields.includes(field.key)
    );

    if (missingRequired.length > 0) {
      setError(`Campos obrigatórios não mapeados: ${missingRequired.map(f => f.label).join(', ')}`);
      return;
    }

    const data = convertData(rawData, mapping, fieldDefinitions, parseValue);
    const result = validateData(data, fieldDefinitions, existingData, validateRow, isDuplicate);
    
    setValidationResult(result);
    setStep(3);
  }, [rawData, mapping, fieldDefinitions, existingData, validateRow, parseValue, isDuplicate]);

  // ─── Executa importação ───────────────────────────────────────────────────
  const handleImport = useCallback(async () => {
    if (!validationResult) return;

    setIsLoading(true);
    setError('');

    try {
      let toImport = [...validationResult.valid];

      if (duplicateAction === 'create') {
        toImport = [...toImport, ...validationResult.duplicates];
      } else if (duplicateAction === 'update') {
        validationResult.duplicates.forEach(dup => {
          dup._action = 'update';
          toImport.push(dup);
        });
      }

      const cleanData = toImport.map(item => {
        const { _rowIndex, ...rest } = item;
        return rest;
      });

      await onImport(cleanData);

      const result = {
        success: cleanData.length,
        skipped: duplicateAction === 'skip' ? validationResult.duplicates.length : 0,
        updated: duplicateAction === 'update' ? validationResult.duplicates.length : 0,
        errors: validationResult.errors.length
      };
      
      setImportResult(result);
      enqueueSnackbar(`${result.success} ${entityNamePlural.toLowerCase()} importados com sucesso!`, { variant: 'success' });
      setStep(4);
    } catch (err) {
      const errorMsg = err.message || 'Erro desconhecido ao importar';
      setError('Erro ao importar: ' + errorMsg);
      enqueueSnackbar('Erro ao importar: ' + errorMsg, { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [validationResult, duplicateAction, onImport, entityNamePlural]);

  // ─── Volta para etapa anterior ────────────────────────────────────────────
  const handleBack = useCallback(() => {
    if (step === 2) {
      setStep(1);
      setFile(null);
    } else if (step === 3) {
      setStep(2);
    }
  }, [step]);

  return {
    step,
    file,
    headers,
    mapping,
    validationResult,
    importResult,
    isLoading,
    error,
    duplicateAction,
    setDuplicateAction,
    handleFileSelect,
    handleMappingChange,
    handleValidate,
    handleImport,
    handleBack,
    downloadTemplate: () => downloadTemplate(fieldDefinitions, entityNamePlural),
    downloadErrorReport: () => downloadErrorReport(validationResult, file, fieldDefinitions, entityNamePlural)
  };
}
