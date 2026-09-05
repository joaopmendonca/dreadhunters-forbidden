import React from 'react';
import { FaDownload, FaFileUpload, FaPlus, FaUserAstronaut } from 'react-icons/fa';
import PageHeader from '../../../shared/components/PageHeader';
import Button from '../../../shared/components/Button';
import TextInput from '../../../shared/components/TextInput';
import styles from '../styles/PlayableCharacters.module.css';
import { RARITIES } from '../constants';

export default function PlayableCharactersHeader({
  totalCount,
  templates,
  search,
  rarityFilter,
  onNew,
  onSearch,
  onRarityChange,
  onOpenImport,
  onExportCSV,
  onDownloadTemplate,
}) {
  const countByRarity = (r) => templates.filter((t) => t.rarity === r).length;

  const filterTabs = [
    {
      id: 'all',
      icon: <FaUserAstronaut />,
      label: 'Todos',
      count: totalCount,
      active: rarityFilter === '',
      onClick: () => onRarityChange(''),
    },
    ...RARITIES.map((r) => ({
      id: r.value,
      icon: '★',
      label: r.label,
      count: countByRarity(r.value),
      active: rarityFilter === r.value,
      onClick: () => onRarityChange(r.value),
    })),
  ];

  return (
    <PageHeader
      statsCounters={[
        { icon: <FaUserAstronaut />, value: totalCount, label: 'Total' },
        ...RARITIES.map((r) => ({ icon: '★', value: countByRarity(r.value), label: r.label })),
      ]}
      controls={
        <>
          <Button
            backgroundColor="var(--maroon)"
            textColor="var(--light)"
            hoverColor="var(--gold)"
            icon={<FaPlus />}
            onClick={onNew}
          >
            Novo Personagem
          </Button>
          <Button
            backgroundColor="var(--dark-3)"
            textColor="var(--light)"
            hoverColor="var(--gold)"
            onClick={onOpenImport}
            icon={<FaFileUpload />}
          >
            Importar CSV
          </Button>
          <Button
            backgroundColor="var(--dark-3)"
            textColor="var(--light)"
            hoverColor="var(--gold)"
            onClick={onExportCSV}
            icon={<FaDownload />}
          >
            Exportar CSV
          </Button>
          <Button
            backgroundColor="var(--dark-4)"
            textColor="var(--light-1)"
            hoverColor="var(--gold)"
            onClick={onDownloadTemplate}
            icon={<FaDownload />}
          >
            Template
          </Button>
          <TextInput
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="🔍 Buscar personagem…"
            className={styles.searchInput}
          />
        </>
      }
      filterTabs={filterTabs}
    />
  );
}
