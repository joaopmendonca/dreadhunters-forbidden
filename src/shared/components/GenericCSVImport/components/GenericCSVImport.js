// ============================================================================
// GenericCSVImport - Componente Principal
// Componente genérico para importação de CSV
// ============================================================================

import React from 'react';
import PropTypes from 'prop-types';
import { useCSVImport } from '../hooks';
import UploadStep from './UploadStep';
import MappingStep from './MappingStep';
import ValidationStep from './ValidationStep';
import ResultStep from './ResultStep';
import StepsIndicator from './StepsIndicator';
import LoadingOverlay from './LoadingOverlay';
import Footer from './Footer';
import styles from '../styles/GenericCSVImport.module.css';

/**
 * Componente de importação CSV genérico e configurável
 */
export function GenericCSVImport({
  fieldDefinitions,
  autoMapping,
  onImport,
  onClose,
  existingData,
  validateRow,
  parseValue,
  isDuplicate,
  entityNamePlural,
  csvOptions
}) {
  const {
    step,
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
    downloadTemplate,
    downloadErrorReport
  } = useCSVImport({
    fieldDefinitions,
    autoMapping,
    onImport,
    existingData,
    validateRow,
    parseValue,
    isDuplicate,
    entityNamePlural,
    csvOptions
  });

  const renderContent = () => {
    switch (step) {
      case 1:
        return (
          <UploadStep
            onFileSelect={handleFileSelect}
            error={error}
            downloadTemplate={downloadTemplate}
          />
        );
      case 2:
        return (
          <MappingStep
            headers={headers}
            mapping={mapping}
            fieldDefinitions={fieldDefinitions}
            onMappingChange={handleMappingChange}
            error={error}
          />
        );
      case 3:
        return (
          <ValidationStep
            validationResult={validationResult}
            duplicateAction={duplicateAction}
            setDuplicateAction={setDuplicateAction}
            downloadErrorReport={downloadErrorReport}
          />
        );
      case 4:
        return (
          <ResultStep
            importResult={importResult}
            entityNamePlural={entityNamePlural}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h2>Importar {entityNamePlural} (CSV)</h2>
          <button className={styles.modalClose} onClick={onClose}>×</button>
        </div>

        {/* Steps Indicator */}
        <StepsIndicator currentStep={step} />

        {/* Content */}
        <div className={styles.modalBody}>
          {renderContent()}
        </div>

        {/* Loading */}
        {isLoading && <LoadingOverlay />}

        {/* Footer */}
        <Footer
          step={step}
          validationResult={validationResult}
          entityNamePlural={entityNamePlural}
          isLoading={isLoading}
          onClose={onClose}
          onBack={handleBack}
          onValidate={handleValidate}
          onImport={handleImport}
        />
      </div>
    </div>
  );
}

GenericCSVImport.propTypes = {
  fieldDefinitions: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    required: PropTypes.bool,
    unique: PropTypes.bool,
    type: PropTypes.string,
    example: PropTypes.string,
    validate: PropTypes.func
  })).isRequired,
  autoMapping: PropTypes.object,
  onImport: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  existingData: PropTypes.array,
  validateRow: PropTypes.func,
  parseValue: PropTypes.func,
  isDuplicate: PropTypes.func,
  entityNamePlural: PropTypes.string,
  csvOptions: PropTypes.object
};

GenericCSVImport.defaultProps = {
  autoMapping: {},
  existingData: [],
  entityNamePlural: 'Registros',
  csvOptions: {}
};

export default GenericCSVImport;
