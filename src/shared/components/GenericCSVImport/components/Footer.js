// ============================================================================
// Footer - Rodapé com Botões de Navegação
// ============================================================================

import React from 'react';
import styles from '../styles/GenericCSVImport.module.css';

export function Footer({
  step,
  validationResult,
  entityNamePlural,
  isLoading,
  onClose,
  onBack,
  onValidate,
  onImport
}) {
  switch (step) {
    case 1:
      return (
        <div className={styles.modalFooter}>
          <button className={styles.btnCancel} onClick={onClose}>
            Cancelar
          </button>
        </div>
      );
      
    case 2:
      return (
        <div className={styles.modalFooter}>
          <button className={styles.btnCancel} onClick={onBack}>
            Voltar
          </button>
          <button className={styles.btnPrimary} onClick={onValidate}>
            Validar Dados
          </button>
        </div>
      );
      
    case 3:
      return (
        <div className={styles.modalFooter}>
          <button className={styles.btnCancel} onClick={onBack}>
            Voltar ao Mapeamento
          </button>
          <button 
            className={styles.btnImport}
            onClick={onImport}
            disabled={isLoading || validationResult?.valid.length === 0}
          >
            {isLoading 
              ? 'Importando...' 
              : `Importar ${validationResult?.valid.length || 0} ${entityNamePlural.toLowerCase()}`
            }
          </button>
        </div>
      );
      
    case 4:
      return (
        <div className={styles.modalFooter}>
          <button className={styles.btnPrimary} onClick={onClose}>
            Concluir
          </button>
        </div>
      );
      
    default:
      return null;
  }
}

export default Footer;
