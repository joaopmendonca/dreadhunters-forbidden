// src/pages/ForbiddenBook/components/ForbiddenBookPage.js

import React from 'react';
import { CHAPTERS } from '../constants';
import useForbiddenBook from '../hooks/useForbiddenBook';
import BookCover from './BookCover';
import BookPage from './BookPage';
import styles from '../styles/ForbiddenBookPage.module.css';

export default function ForbiddenBookPage() {
  const {
    currentChapter,
    chapterData,
    loading,
    goToChapter,
    nextChapter,
    prevChapter,
    getStats,
    isFirstChapter,
    isLastChapter,
    servers,
    selectedServer,
    onServerChange,
  } = useForbiddenBook();

  return (
    <div className={styles.container}>
      {/* Fundo atmosférico */}
      <div className={styles.atmosphere}>
        <div className={styles.fog} />
        <div className={styles.vignette} />
      </div>

      {/* Conteúdo principal */}
      <div className={styles.content}>
        {currentChapter === CHAPTERS.COVER ? (
          <BookCover 
            stats={getStats()} 
            onOpen={() => goToChapter(CHAPTERS.SETTINGS)} 
          />
        ) : (
          <BookPage
            chapter={currentChapter}
            data={chapterData}
            loading={loading}
            onPrev={prevChapter}
            onNext={nextChapter}
            isFirst={isFirstChapter}
            isLast={isLastChapter}
            onNavigate={goToChapter}
            servers={servers}
            selectedServer={selectedServer}
            onServerChange={onServerChange}
          />
        )}
      </div>

      {/* Botão de voltar à capa */}
      {currentChapter !== CHAPTERS.COVER && (
        <button 
          className={styles.backToCover}
          onClick={() => goToChapter(CHAPTERS.COVER)}
          title="Voltar à capa"
        >
          📖
        </button>
      )}
    </div>
  );
}
