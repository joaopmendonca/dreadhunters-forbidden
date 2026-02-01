// src/pages/ForbiddenBook/components/SettingsContent.js

import React from 'react';
import styles from '../styles/SettingsContent.module.css';

export default function SettingsContent({ 
  servers, 
  selectedServer, 
  onServerChange,
  loading 
}) {
  return (
    <div className={styles.container}>
      {/* Seleção de Servidor */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <span className={styles.sectionIcon}>🖥️</span>
          Servidor Ativo
        </h3>
        <p className={styles.sectionDesc}>
          Selecione o servidor de onde o grimório irá buscar seus conhecimentos.
          Cada servidor pode representar um mundo diferente com suas próprias entidades.
        </p>
        
        <div className={styles.serverSelector}>
          <select 
            value={selectedServer || ''} 
            onChange={(e) => onServerChange(e.target.value)}
            className={styles.select}
            disabled={loading}
          >
            <option value="" style={{ background: '#1a1a1a', color: '#e0e0e0' }}>
              — selecione um servidor —
            </option>
            {servers.map((server) => (
              <option 
                key={server.slug} 
                value={server.slug}
                style={{ background: '#1a1a1a', color: '#e0e0e0' }}
              >
                {server.name} ({server.slug})
              </option>
            ))}
          </select>
          
          {loading && (
            <span className={styles.loadingIndicator}>
              Carregando...
            </span>
          )}
        </div>

        {selectedServer && (
          <div className={styles.serverInfo}>
            <span className={styles.serverStatus}>
              ✓ Conectado ao servidor: <strong>{selectedServer}</strong>
            </span>
          </div>
        )}
      </section>

      {/* Instruções */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <span className={styles.sectionIcon}>📋</span>
          Como Usar o Grimório
        </h3>
        <ul className={styles.instructionList}>
          <li>
            <span className={styles.instructionIcon}>📖</span>
            <span>Use o <strong>índice lateral</strong> para navegar entre os capítulos</span>
          </li>
          <li>
            <span className={styles.instructionIcon}>🔍</span>
            <span>Cada capítulo possui <strong>barra de busca</strong> para filtrar registros</span>
          </li>
          <li>
            <span className={styles.instructionIcon}>👆</span>
            <span>Clique em um registro para ver seus <strong>detalhes completos</strong></span>
          </li>
          <li>
            <span className={styles.instructionIcon}>🎮</span>
            <span>Expanda as <strong>Notas de Game Design</strong> para informações técnicas</span>
          </li>
          <li>
            <span className={styles.instructionIcon}>◄ ►</span>
            <span>Use os botões <strong>Anterior/Próximo</strong> para navegar sequencialmente</span>
          </li>
        </ul>
      </section>

      {/* Aviso */}
      <section className={styles.warningSection}>
        <div className={styles.warningBox}>
          <span className={styles.warningIcon}>⚠️</span>
          <div className={styles.warningContent}>
            <strong>Grimório em Desenvolvimento</strong>
            <p>
              Este é um documento vivo. As informações podem mudar conforme 
              o jogo evolui. Algumas seções podem conter dados incompletos ou 
              em processo de balanceamento.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
