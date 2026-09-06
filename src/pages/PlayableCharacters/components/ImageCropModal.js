import React, { useCallback, useEffect, useRef, useState } from 'react';
import Modal, { MODAL_SIZES } from '../../../shared/components/Modal';
import Button from '../../../shared/components/Button';
import styles from '../styles/PlayableCharacters.module.css';

const OUTPUT_SIZE = 512;   // resolução do PNG final gerado no navegador
const VIEWPORT_SIZE = 300; // tamanho do quadro de recorte na tela (CSS px)

/**
 * Recorte manual de imagem quadrada, feito no navegador (canvas), antes do
 * upload. O usuário arrasta e dá zoom pra escolher QUAL parte da imagem vira
 * o retrato — em vez do back-end recortar sempre o centro sem perguntar.
 * O arquivo que sai daqui já é o quadrado final; o servidor só reprocessa
 * (sem precisar cortar de novo, porque já chega quadrado).
 */
export default function ImageCropModal({ file, isOpen, onCancel, onConfirm }) {
  const imgRef = useRef(null);
  const dragRef = useRef(null);

  const [imgUrl, setImgUrl] = useState('');
  const [natural, setNatural] = useState({ w: 0, h: 0 });
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!file) { setImgUrl(''); setReady(false); return undefined; }
    const url = URL.createObjectURL(file);
    setImgUrl(url);
    setReady(false);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // escala em zoom=1: a menor dimensão da imagem preenche exatamente o quadro
  const baseScale = natural.w && natural.h ? VIEWPORT_SIZE / Math.min(natural.w, natural.h) : 1;

  const clampOffset = useCallback((ox, oy, z) => {
    const dispW = natural.w * baseScale * z;
    const dispH = natural.h * baseScale * z;
    const minX = Math.min(0, VIEWPORT_SIZE - dispW);
    const minY = Math.min(0, VIEWPORT_SIZE - dispH);
    return {
      x: Math.max(minX, Math.min(0, ox)),
      y: Math.max(minY, Math.min(0, oy))
    };
  }, [natural, baseScale]);

  const handleImgLoad = (e) => {
    const w = e.target.naturalWidth;
    const h = e.target.naturalHeight;
    const scale = VIEWPORT_SIZE / Math.min(w, h);
    setNatural({ w, h });
    setZoom(1);
    setOffset({ x: (VIEWPORT_SIZE - w * scale) / 2, y: (VIEWPORT_SIZE - h * scale) / 2 });
    setReady(true);
  };

  const pointOf = (e) => (e.touches && e.touches[0]) || e;

  const onPointerDown = (e) => {
    const p = pointOf(e);
    dragRef.current = { startX: p.clientX, startY: p.clientY, offset };
  };
  const onPointerMove = (e) => {
    if (!dragRef.current) return;
    const p = pointOf(e);
    const dx = p.clientX - dragRef.current.startX;
    const dy = p.clientY - dragRef.current.startY;
    setOffset(clampOffset(dragRef.current.offset.x + dx, dragRef.current.offset.y + dy, zoom));
  };
  const onPointerUp = () => { dragRef.current = null; };

  const handleZoom = (e) => {
    const z = Number(e.target.value);
    setZoom(z);
    setOffset((prev) => clampOffset(prev.x, prev.y, z));
  };

  const handleConfirm = () => {
    if (!ready || !imgRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;
    const ctx = canvas.getContext('2d');
    const totalScale = baseScale * zoom;
    const srcX = -offset.x / totalScale;
    const srcY = -offset.y / totalScale;
    const srcSize = VIEWPORT_SIZE / totalScale;
    ctx.drawImage(imgRef.current, srcX, srcY, srcSize, srcSize, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const baseName = (file?.name || 'retrato').replace(/\.[^./\\]+$/, '');
      onConfirm(new File([blob], `${baseName}-recorte.png`, { type: 'image/png' }));
    }, 'image/png', 0.95);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title="Ajustar recorte do retrato"
      size={MODAL_SIZES.SMALL}
      closeOnOverlayClick={false}
    >
      <Modal.Body>
        <p className={styles.hint}>Arraste a imagem e use o zoom pra escolher o que fica dentro do quadro — é exatamente essa área que será salva.</p>

        <div
          className={styles.cropViewport}
          onMouseDown={onPointerDown}
          onMouseMove={onPointerMove}
          onMouseUp={onPointerUp}
          onMouseLeave={onPointerUp}
          onTouchStart={onPointerDown}
          onTouchMove={onPointerMove}
          onTouchEnd={onPointerUp}
        >
          {imgUrl && (
            <img
              ref={imgRef}
              src={imgUrl}
              alt="Pré-visualização para recorte"
              draggable={false}
              onLoad={handleImgLoad}
              className={styles.cropImage}
              style={{
                width: natural.w * baseScale * zoom,
                height: natural.h * baseScale * zoom,
                transform: `translate(${offset.x}px, ${offset.y}px)`
              }}
            />
          )}
        </div>

        <div className={styles.cropZoomRow}>
          <span>Zoom</span>
          <input type="range" min={1} max={3} step={0.01} value={zoom} onChange={handleZoom} disabled={!ready} />
        </div>
      </Modal.Body>

      <Modal.Footer alignment="between">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
        <Button
          type="button"
          backgroundColor="var(--maroon)"
          textColor="var(--light)"
          hoverColor="var(--gold)"
          onClick={handleConfirm}
          disabled={!ready}
        >
          Usar este recorte
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
