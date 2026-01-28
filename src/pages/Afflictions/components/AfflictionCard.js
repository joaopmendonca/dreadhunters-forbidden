import { FaExclamationTriangle } from 'react-icons/fa';
import Card from '../../../shared/components/Card';
import { buildImageSrc, getSeveridadeConfig } from '../utils';
import styles from '../styles/Afflictions.module.css';

export default function AfflictionCard({ affliction, onEdit, onDelete }) {
  const isMental = affliction.tipo === 'mental';

  return (
    <Card key={affliction._id} variant={isMental ? 'mental' : 'fisica'}>
      <Card.TopBar
        badge={
          <Card.Badge variant={isMental ? 'mental' : 'fisica'}>
            {isMental ? '🧠 Mental' : '💔 Física'}
          </Card.Badge>
        }
      >
        <Card.Actions
          onEdit={() => onEdit(affliction)}
          onDelete={() => onDelete(affliction._id)}
        />
      </Card.TopBar>

      <Card.Header
        image={affliction.imagemUrl ? buildImageSrc(affliction.imagemUrl) : null}
        type={isMental ? 'AFLIÇÃO MENTAL' : 'AFLIÇÃO FÍSICA'}
        title={affliction.nome}
      />

      <Card.Body>
        <Card.Section title="Descrição">
          <p>{affliction.descricao}</p>
        </Card.Section>

        {affliction.niveis && affliction.niveis.length > 0 && (
          <div>
            <Card.SectionLabel>níveis</Card.SectionLabel>
            {affliction.niveis
              .sort((a, b) => ({ leve: 1, media: 2, grave: 3 }[a.severidade] - { leve: 1, media: 2, grave: 3 }[b.severidade]))
              .map((nivel, idx) => (
                <Card.LevelCard key={idx} severity={nivel.severidade}>
                  <Card.SeverityBadge severity={nivel.severidade} />
                  <div style={{ marginTop: '0.5rem' }}>
                    <strong style={{ fontSize: '0.8rem', color: 'var(--light)' }}>Penalidade</strong>
                    <Card.StatList
                      stats={nivel.penalidades?.map(pen => ({
                        value: pen.modificador,
                        label: pen.status?.label || pen.status?.nome || 'Status'
                      })) || []}
                      emptyMessage="Sem penalidades"
                    />
                  </div>
                </Card.LevelCard>
              ))}
          </div>
        )}
      </Card.Body>

      {!affliction.ativo && (
        <Card.Overlay icon={<FaExclamationTriangle />} message="Inativa" />
      )}
    </Card>
  );
}
