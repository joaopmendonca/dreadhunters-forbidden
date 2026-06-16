import Card from '../../../shared/components/Card';
import { buildImageSrc, getDamageTypeConfig } from '../utils';

export default function DamageTypeCard({ damageType, onEdit, onDelete }) {
  const config = getDamageTypeConfig(damageType.nome);
  const hasIcon = damageType.iconeUrl;

  return (
    <Card variant="maroon">
      <Card.TopBar 
        badge={
          <>
            {!damageType.ativo && <Card.Badge variant="gray">Inativo</Card.Badge>}
            <Card.Badge variant="maroon"><span>{damageType.nome}</span></Card.Badge>
          </>
        }
      >
        <Card.Actions
          onEdit={() => onEdit(damageType)}
          onDelete={() => onDelete(damageType._id)}
        />
      </Card.TopBar>

      <Card.Header
        image={hasIcon ? buildImageSrc(damageType.iconeUrl) : null}
        title={damageType.label}
        icon={!hasIcon ? config.icon : null}
        iconBgColor={damageType.cor || '#444'}
      />

      <Card.Body>
        {damageType.descricao && (
          <Card.Section title="Descrição">
            <p>{damageType.descricao}</p>
          </Card.Section>
        )}

        <Card.Section title="Propriedades">
          <Card.StatList
            stats={[
              { label: 'Cor', value: (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span 
                    style={{ 
                      display: 'inline-block', 
                      width: '12px', 
                      height: '12px', 
                      borderRadius: '50%', 
                      backgroundColor: damageType.cor || '#888' 
                    }}
                  />
                  {damageType.cor || '#888888'}
                </span>
              )},
              ...(damageType.nome !== 'none' && damageType.formula ? [
                { label: 'Fórmula de Dano', value: <code style={{ fontSize: '0.85em' }}>{damageType.formula}</code> }
              ] : []),
              { label: 'Ordem', value: damageType.ordem }
            ]}
          />
        </Card.Section>
      </Card.Body>
    </Card>
  );
}
