// ============================================================================
// StepsIndicator - Indicador de Etapas
// ============================================================================

import React from 'react';
import styles from '../styles/GenericCSVImport.module.css';

const STEPS = [
  { number: 1, label: 'Upload' },
  { number: 2, label: 'Mapeamento' },
  { number: 3, label: 'Validação' },
  { number: 4, label: 'Concluído' }
];

export function StepsIndicator({ currentStep }) {
  return (
    <div className={styles.stepsIndicator}>
      {STEPS.map((step, index) => (
        <React.Fragment key={step.number}>
          <div className={`
            ${styles.step}
            ${currentStep >= step.number ? styles.active : ''}
            ${currentStep > step.number ? styles.completed : ''}
          `}>
            <span className={styles.stepNumber}>
              {currentStep > step.number ? '✓' : step.number}
            </span>
            <span className={styles.stepLabel}>{step.label}</span>
          </div>
          
          {index < STEPS.length - 1 && (
            <div className={styles.stepConnector}></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default StepsIndicator;
