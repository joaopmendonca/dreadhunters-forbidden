// src/pages/ForbiddenBook/components/BookPage.js

import React from 'react';
import { CHAPTERS, LORE_CONTENT, CHAPTER_CONFIG } from '../constants';
import ChapterContent from './ChapterContent';
import SettingsContent from './SettingsContent';
import styles from '../styles/BookPage.module.css';

export default function BookPage({ 
  chapter, 
  data, 
  loading,
  onPrev, 
  onNext, 
  isFirst, 
  isLast,
  onNavigate,
  servers,
  selectedServer,
  onServerChange
}) {
  const config = CHAPTER_CONFIG[chapter];

  const renderLore = () => (
    <div className={styles.loreContent}>
      <h2 className={styles.loreTitle}>{LORE_CONTENT.title}</h2>
      
      {LORE_CONTENT.sections.map((section, idx) => (
        <div key={idx} className={styles.loreSection}>
          <h3 className={styles.loreSectionTitle}>
            <span className={styles.sectionNumber}>{idx + 1}.</span>
            {section.title}
          </h3>
          <p className={styles.loreSectionContent}>{section.content}</p>
        </div>
      ))}

      <div className={styles.loreFooter}>
        <span className={styles.loreSymbol}>⚰</span>
        <span className={styles.loreQuote}>
          "Nas trevas, encontramos nossa luz."
        </span>
        <span className={styles.loreSymbol}>⚰</span>
      </div>
    </div>
  );

  return (
    <div className={styles.pageContainer}>
      {/* Navegação lateral - Índice */}
      <nav className={styles.tableOfContents}>
        <h3 className={styles.tocTitle}>Índice</h3>
        <ul className={styles.tocList}>
          {Object.values(CHAPTER_CONFIG).map((ch) => (
            <li 
              key={ch.id}
              className={`${styles.tocItem} ${chapter === ch.id ? styles.tocActive : ''}`}
              onClick={() => onNavigate(ch.id)}
            >
              <span className={styles.tocIcon}>{ch.icon}</span>
              <span className={styles.tocLabel}>{ch.title}</span>
            </li>
          ))}
        </ul>
      </nav>

      {/* Página principal */}
      <main className={styles.page}>
        {/* Cabeçalho da página */}
        <header className={styles.pageHeader}>
          <div className={styles.headerDecor}>
            <span className={styles.decorLine} />
            <span className={styles.decorSymbol}>✦</span>
            <span className={styles.decorLine} />
          </div>
          
          <div className={styles.chapterInfo}>
            <span className={styles.chapterIcon}>{config.icon}</span>
            <h1 className={styles.chapterTitle}>{config.title}</h1>
            {config.subtitle && (
              <p className={styles.chapterSubtitle}>{config.subtitle}</p>
            )}
          </div>

          <div className={styles.headerDecor}>
            <span className={styles.decorLine} />
            <span className={styles.decorSymbol}>✦</span>
            <span className={styles.decorLine} />
          </div>
        </header>

        {/* Conteúdo */}
        <div className={styles.pageContent}>
          {loading ? (
            <div className={styles.loading}>
              <div className={styles.loadingSpinner} />
              <p>Decifrando os segredos ancestrais...</p>
            </div>
          ) : chapter === CHAPTERS.COVER ? (
            <div className={styles.coverRedirect}>
              <p>Use o índice para navegar pelos capítulos.</p>
            </div>
          ) : chapter === CHAPTERS.SETTINGS ? (
            <SettingsContent
              servers={servers}
              selectedServer={selectedServer}
              onServerChange={onServerChange}
              loading={loading}
            />
          ) : chapter === CHAPTERS.LORE ? (
            renderLore()
          ) : (
            <ChapterContent
              chapter={chapter}
              config={config}
              data={data}
            />
          )}
        </div>

        {/* Navegação de páginas */}
        <footer className={styles.pageFooter}>
          <button 
            className={styles.navButton}
            onClick={onPrev}
            disabled={isFirst}
          >
            <span className={styles.navArrow}>◄</span>
            <span className={styles.navText}>Anterior</span>
          </button>

          <div className={styles.pageNumber}>
            <span className={styles.pageNumDecor}>— ✧ —</span>
          </div>

          <button 
            className={styles.navButton}
            onClick={onNext}
            disabled={isLast}
          >
            <span className={styles.navText}>Próximo</span>
            <span className={styles.navArrow}>►</span>
          </button>
        </footer>

        {/* Decorações de página */}
        <div className={styles.pageCornerTL} />
        <div className={styles.pageCornerTR} />
        <div className={styles.pageCornerBL} />
        <div className={styles.pageCornerBR} />
      </main>
    </div>
  );
}
