// src/pages/Classes/components/SkillTreeModal.js

import React, { useMemo, useCallback } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap,
  MarkerType,
  useNodesState,
  useEdgesState
} from 'reactflow';
import 'reactflow/dist/style.css';
import Modal from '../../../shared/components/Modal';
import { buildIconSrc } from '../utils';
import api from '../../../config/api';
import styles from '../styles/SkillTreeModal.module.css';

export default function SkillTreeModal({ isOpen, onClose, cls }) {
  const baseURL = api.defaults.baseURL;

  // Converter a estrutura da skill tree para nodes e edges do ReactFlow
  const initialData = useMemo(() => {
    if (!cls?.skillTree?.roots || cls.skillTree.roots.length === 0) {
      return { nodes: [], edges: [] };
    }

    const nodes = [];
    const edges = [];
    let nodeId = 0;
    const nodesPerLevel = new Map();

    const processNode = (node, level = 0, parentId = null, siblingIndex = 0) => {
      const currentId = `node-${nodeId++}`;
      const skill = node.skill;

      // Calcular posição X baseada no índice entre irmãos
      if (!nodesPerLevel.has(level)) {
        nodesPerLevel.set(level, 0);
      }
      const currentLevelIndex = nodesPerLevel.get(level);
      nodesPerLevel.set(level, currentLevelIndex + 1);

      // Criar node
      nodes.push({
        id: currentId,
        type: 'custom',
        position: { 
          x: currentLevelIndex * 280, 
          y: level * 180 
        },
        data: {
          skill: skill,
          requiredLevel: node.requiredLevel || 1,
          unlocked: node.unlocked || false,
          prerequisites: node.prerequisites || [],
          baseURL: baseURL
        }
      });

      // Criar edge do pai para este nó
      if (parentId) {
        edges.push({
          id: `edge-${parentId}-${currentId}`,
          source: parentId,
          target: currentId,
          type: 'smoothstep',
          animated: true,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#d4af37'
          },
          style: {
            stroke: '#d4af37',
            strokeWidth: 2
          }
        });
      }

      // Processar filhos
      if (node.children && node.children.length > 0) {
        node.children.forEach((child, childIndex) => {
          processNode(child, level + 1, currentId, childIndex);
        });
      }
    };

    // Processar cada raiz
    cls.skillTree.roots.forEach((root, rootIndex) => {
      processNode(root, 0, null, rootIndex);
    });

    return { nodes, edges };
  }, [cls, baseURL]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialData.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialData.edges);

  // Componente customizado para os nodes
  const nodeTypes = useMemo(() => ({
    custom: ({ data }) => {
      const skill = data.skill;
      const skillName = typeof skill === 'object' ? skill.name : skill;
      const skillIcon = typeof skill === 'object' ? skill.iconUrl : null;
      const skillDesc = typeof skill === 'object' ? skill.description : '';

      return (
        <div className={styles.skillNode}>
          <div className={styles.skillNodeHeader}>
            {skillIcon ? (
              <img 
                src={buildIconSrc(skillIcon, data.baseURL)} 
                alt={skillName}
                className={styles.skillNodeIcon}
              />
            ) : (
              <div className={styles.skillNodeIconPlaceholder}>⚔️</div>
            )}
          </div>
          <div className={styles.skillNodeBody}>
            <div className={styles.skillNodeName}>{skillName}</div>
            <div className={styles.skillNodeLevel}>Nível {data.requiredLevel}</div>
            {skillDesc && (
              <div className={styles.skillNodeDesc} title={skillDesc}>
                {skillDesc}
              </div>
            )}
          </div>
        </div>
      );
    }
  }), []);

  const onNodeClick = useCallback((event, node) => {
    console.log('Node clicked:', node);
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Skill Tree - ${cls?.name || ''}`}
      size="full"
    >
      <Modal.Body>
        <div className={styles.skillTreeContainer}>
          {initialData.nodes.length === 0 ? (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>🌳</span>
              <h3>Nenhuma Skill Tree configurada</h3>
              <p>Esta classe ainda não possui uma árvore de habilidades.</p>
            </div>
          ) : (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={onNodeClick}
              nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{ padding: 0.2 }}
              minZoom={0.2}
              maxZoom={1.5}
              defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
              className={styles.reactFlow}
              nodesDraggable={false}
              nodesConnectable={false}
              elementsSelectable={true}
            >
              <Background color="#d4af37" gap={16} size={1} />
              <Controls className={styles.controls} />
              <MiniMap 
                className={styles.minimap}
                nodeColor="#800020"
                maskColor="rgba(0, 0, 0, 0.6)"
                zoomable
                pannable
              />
            </ReactFlow>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
}
