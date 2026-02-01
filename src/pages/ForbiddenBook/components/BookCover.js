// src/pages/ForbiddenBook/components/BookCover.js

import React from 'react';
import styles from '../styles/BookCover.module.css';

export default function BookCover({ stats, onOpen }) {
  return (
    <div className={styles.coverContainer}>
      {/* Partículas de fundo */}
      <div className={styles.particles}>
        {[...Array(15)].map((_, i) => (
          <span 
            key={i} 
            className={styles.particle}
            style={{
              '--delay': `${Math.random() * 5}s`,
              '--x': `${Math.random() * 100}%`,
              '--duration': `${4 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className={styles.book}>
        {/* Capa traseira */}
        <div className={styles.coverBack} />

        {/* Páginas do livro */}
        <div className={styles.pages}>
          <div className={styles.pageStack} />
        </div>

        {/* Lombada do livro */}
        <div className={styles.spine}>
          <div className={styles.spineDetail} />
          <span className={styles.spineText}>FORBIDDEN BOOK</span>
          <div className={styles.spineDetail} />
        </div>

        {/* Capa frontal */}
        <div className={styles.coverFront}>
          {/* Moldura ornamental */}
          <div className={styles.frame}>
            <div className={styles.cornerTL} />
            <div className={styles.cornerTR} />
            <div className={styles.cornerBL} />
            <div className={styles.cornerBR} />
          </div>

          {/* Conteúdo da capa */}
          <div className={styles.coverContent}>
            {/* Símbolo central */}
            <div className={styles.emblem}>
              <div className={styles.emblemOuter}>
                <div className={styles.emblemInner}>
                  <span className={styles.emblemIcon}>☠</span>
                </div>
              </div>
            </div>

            {/* Título */}
            <h1 className={styles.title}>
              <span className={styles.titleThe}>The</span>
              <span className={styles.titleMain}>Forbidden</span>
              <span className={styles.titleBook}>Book</span>
            </h1>

            {/* Subtítulo */}
            <p className={styles.subtitle}>
              Grimório dos Caçadores
            </p>

            {/* Linha decorativa */}
            <div className={styles.divider}>
              <span className={styles.dividerLine} />
              <span className={styles.dividerSymbol}>✧</span>
              <span className={styles.dividerLine} />
            </div>

            {/* Estatísticas do livro */}
            <div className={styles.stats}>
              <div className={styles.statRow}>
                <span className={styles.statItem}>
                  <span className={styles.statIcon}>⚔️</span>
                  <span className={styles.statValue}>{stats.classes}</span>
                  <span className={styles.statLabel}>Classes</span>
                </span>
                <span className={styles.statItem}>
                  <span className={styles.statIcon}>✨</span>
                  <span className={styles.statValue}>{stats.skills}</span>
                  <span className={styles.statLabel}>Habilidades</span>
                </span>
                <span className={styles.statItem}>
                  <span className={styles.statIcon}>🎒</span>
                  <span className={styles.statValue}>{stats.items}</span>
                  <span className={styles.statLabel}>Itens</span>
                </span>
              </div>
              <div className={styles.statRow}>
                <span className={styles.statItem}>
                  <span className={styles.statIcon}>👹</span>
                  <span className={styles.statValue}>{stats.enemies}</span>
                  <span className={styles.statLabel}>Inimigos</span>
                </span>
                <span className={styles.statItem}>
                  <span className={styles.statIcon}>📋</span>
                  <span className={styles.statValue}>{stats.quests}</span>
                  <span className={styles.statLabel}>Missões</span>
                </span>
                <span className={styles.statItem}>
                  <span className={styles.statIcon}>🗺️</span>
                  <span className={styles.statValue}>{stats.locations}</span>
                  <span className={styles.statLabel}>Locais</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Fecho do livro */}
        <div className={styles.clasp}>
          <div className={styles.claspMetal} />
        </div>
      </div>

      {/* Sombra do livro */}
      <div className={styles.bookShadow} />

      {/* Botão de abrir - fixo na base da página */}
      <button className={styles.openButton} onClick={onOpen}>
        <span className={styles.openIcon}>📖</span>
        <span className={styles.openText}>Abrir o Grimório</span>
      </button>

      {/* Aviso - fixo na base da página */}
      <p className={styles.warning}>
        ⚠️ Conhecimento Proibido ⚠️
      </p>
    </div>
  );
}
