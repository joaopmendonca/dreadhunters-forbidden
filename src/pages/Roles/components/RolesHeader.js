import { FaDownload, FaFileUpload, FaPlus } from 'react-icons/fa';
import Button from '../../../shared/components/Button';
import PageHeader from '../../../shared/components/PageHeader';
import TextInput from '../../../shared/components/TextInput';
import styles from '../styles/Roles.module.css';

export default function RolesHeader({
  totalCount,
  searchName,
  onSearchChange,
  onNew,
  onUploadCSV,
  onExportCSV,
  onDownloadTemplate,
  uploading,
  fileInputRef
}) {
  return (
    <PageHeader
      statsCounters={[
        { icon: '🛡️', value: totalCount, label: 'Roles' }
      ]}
      controls={
        <>
          <Button
            backgroundColor="var(--maroon)"
            textColor="var(--light)"
            hoverColor="var(--gold)"
            onClick={onNew}
            icon={<FaPlus />}
          >
            Nova Role
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={onUploadCSV}
            style={{ display: 'none' }}
          />

          <Button
            backgroundColor="var(--dark-3)"
            textColor="var(--light)"
            hoverColor="var(--gold)"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            icon={<FaFileUpload />}
          >
            {uploading ? 'Importando...' : 'Importar CSV'}
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
            className={styles.searchInput}
            placeholder="🔍 Buscar por nome…"
            value={searchName}
            onChange={e => onSearchChange(e.target.value)}
          />
        </>
      }
    />
  );
}
