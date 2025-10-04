import React, { useEffect, useId, useRef, useState } from 'react';

export interface BeforeAfterProps {
  beforeSrc: string;
  afterSrc: string;
  label?: string;
  initialPercent?: number;
  className?: string;
  aspectRatio?: string; // e.g. '4 / 3', '1 / 1'
}

const BeforeAfter: React.FC<BeforeAfterProps> = ({
  beforeSrc,
  afterSrc,
  label = 'Before / After',
  initialPercent = 50,
  className,
  aspectRatio,
}) => {
  const [percent, setPercent] = useState<number>(initialPercent);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef<boolean>(false);
  const activePointerIdRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const id = useId();
  
  useEffect(() => {
    const stop = () => { draggingRef.current = false; };
    window.addEventListener('pointerup', stop);
    window.addEventListener('pointercancel', stop);
    return () => {
      window.removeEventListener('pointerup', stop);
      window.removeEventListener('pointercancel', stop);
    };
  }, []);

  useEffect(() => {
    setPercent(Math.max(0, Math.min(100, initialPercent)));
  }, [initialPercent]);

  const commitPercent = (next: number) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => setPercent(next));
  };

  const updateFromX = (clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const next = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    commitPercent(next);
  };

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: 'relative', width: '100%', aspectRatio: aspectRatio ?? '1 / 1', overflow: 'hidden', userSelect: 'none', touchAction: 'none', cursor: 'ew-resize' }}
      onPointerDown={(e) => {
        draggingRef.current = true;
        activePointerIdRef.current = e.pointerId;
        const el = containerRef.current as any;
        el?.setPointerCapture?.(e.pointerId);
        updateFromX(e.clientX);
      }}
      onMouseDown={(e) => { draggingRef.current = true; updateFromX(e.clientX); }}
      onPointerMove={(e) => {
        if (!draggingRef.current) return;
        if (activePointerIdRef.current !== null && e.pointerId !== activePointerIdRef.current) return;
        e.preventDefault();
        updateFromX(e.clientX);
      }}
      onMouseMove={(e) => { if (draggingRef.current) { e.preventDefault(); updateFromX(e.clientX); } }}
      onPointerUp={(e) => {
        if (activePointerIdRef.current !== null && e.pointerId !== activePointerIdRef.current) return;
        draggingRef.current = false;
        activePointerIdRef.current = null;
        const el = containerRef.current as any;
        el?.releasePointerCapture?.(e.pointerId);
      }}
      onMouseUp={() => { draggingRef.current = false; }}
      onPointerCancel={() => { draggingRef.current = false; }}
      onPointerLeave={() => { draggingRef.current = false; }}
      onTouchMove={(e) => {
        if (!draggingRef.current) return;
        e.preventDefault();
        updateFromX(e.touches[0].clientX);
      }}
      role="region"
      aria-labelledby={id}
    >
      <img src={afterSrc} alt={`${label} after`} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', background: '#000', pointerEvents: 'none' }} />
      <img src={beforeSrc} alt={`${label} before`} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', background: '#000', clipPath: `inset(0 ${100 - percent}% 0 0)`, pointerEvents: 'none' }} />
      <input
        id={id}
        aria-label={`Compare ${label}`}
        type="range"
        min={0}
        max={100}
        value={percent}
        onChange={(e) => setPercent(Number(e.currentTarget.value))}
        onPointerDown={() => { draggingRef.current = true; }}
        onPointerUp={() => { draggingRef.current = false; }}
        style={{ position: 'absolute', left: 0, right: 0, bottom: 10, margin: '0 auto', width: '60%' }}
      />
      <div style={{ pointerEvents: 'none', position: 'absolute', top: 0, bottom: 0, left: `${percent}%`, transform: 'translateX(-50%)' }}>
        <div style={{ width: 2, height: '100%', background: 'rgba(255,255,255,0.9)', boxShadow: '0 0 10px rgba(255,255,255,0.6)' }} />
        <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.9)',
              color: '#111',
              boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
              border: '1px solid rgba(0,0,0,0.1)'
            }}
            aria-hidden
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2"/></svg>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2"/></svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeforeAfter;
