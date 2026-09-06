import React from 'react';
import { FaDownload, FaFileUpload, FaPlus, FaUserAstronaut } from 'react-icons/fa';
import PageHeader from '../../../shared/components/PageHeader';
import Button from '../../../shared/components/Button';
import TextInput from '../../../shared/components/TextInput';
import styles from '../styles/PlayableCharacters.module.css';

export default function PlayableCharactersHeader({
  totalCount,
  templates,
  classes,
  search,
  classFilter,
  onNew,
  onSearch,
  onClassChange,
  onOpenImport,
  onExportCSV,
  onDownloadTemplate,
}) {
  const countByClass = (id) =>
    templates.filter((t) => String(typeof t.class === 'object' ? t.class?._id : t.class) === String(id)).length;

  const filterTabs = [
    {
      id: 'all',
      icon: <FaUserAstronaut />,
      label: 'Todos',
      count: totalCount,
      active: classFilter === '',
      onClick: () => onClassChange(''),
    },
    ...(classes || []).map((c) => ({
      id: c._id,
      icon: '⚔️',
      label: c.name,
      count: countByClass(c._id),
      active: classFilter === c._id,
      onClick: () => onClassChange(c._id),
    })),
  ];

  return (
    <PageHeader
      statsCounters={[
        { icon: <FaUserAstronaut />, value: totalCount, label: 'Total' },
        ...(classes || []).slice(0, 4).map((c) => ({ icon: '⚔️', value: countByClass(c._id), label: c.name })),
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
