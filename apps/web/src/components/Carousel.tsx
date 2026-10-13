'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Icon } from './Icon';

/** Swipe carousel: native scroll-snap (touch swipe), mouse drag, arrow buttons, progress bar. */
export function Carousel({ children, label, autoPlay = true }: { children: ReactNode; label: string; autoPlay?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef({ down: false, x: 0, left: 0, moved: false });
  const [progress, setProgress] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [dragging, setDragging] = useState(false);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < max - 4);
    setProgress(max > 0 ? el.scrollLeft / max : 1);
  }, []);

  useEffect(() => {
    update();
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [update, children]);

  const paused = useRef(false);
  useEffect(() => {
    if (!autoPlay || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => {
      const el = ref.current;
      if (!el || paused.current || drag.current.down) return;
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 0) return;
      if (el.scrollLeft >= max - 4) el.scrollTo({ left: 0, behavior: 'smooth' });
      else el.scrollBy({ left: el.clientWidth * 0.5, behavior: 'smooth' });
    }, 3800);
    return () => clearInterval(id);
  }, [autoPlay]);

  const page = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.85, behavior: 'smooth' });

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    const el = ref.current!;
    drag.current = { down: true, x: e.clientX, left: el.scrollLeft, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d.down) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 5) {
      d.moved = true;
      setDragging(true);
    }
    if (d.moved) ref.current!.scrollLeft = d.left - dx;
  };
  const end = () => {
    drag.current.down = false;
    setDragging(false);
  };

  return (
    <div className="carousel" onMouseEnter={() => (paused.current = true)} onMouseLeave={() => (paused.current = false)} onTouchStart={() => (paused.current = true)} onFocus={() => (paused.current = true)} onBlur={() => (paused.current = false)} role="region" aria-roledescription="carousel" aria-label={label}>
      <div
        ref={ref}
        className={`carousel-track ${dragging ? 'is-dragging' : ''}`}
        onScroll={update}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={end}
        onPointerLeave={end}
        onClickCapture={(e) => {
          if (drag.current.moved) {
            e.preventDefault();
            e.stopPropagation();
            drag.current.moved = false;
          }
        }}
        onDragStart={(e) => e.preventDefault()}
      >
        {children}
      </div>
      <div className="carousel-foot">
        <div className="carousel-bar" aria-hidden="true">
          <span style={{ width: `${Math.max(12, progress * 100)}%` }} />
        </div>
        <div className="carousel-arrows">
          <button type="button" className="btn btn-secondary btn-icon btn-sm" aria-label="Previous" disabled={!canPrev} onClick={() => page(-1)}>
            <Icon name="chevronLeft" size={18} />
          </button>
          <button type="button" className="btn btn-secondary btn-icon btn-sm" aria-label="Next" disabled={!canNext} onClick={() => page(1)}>
            <Icon name="chevronRight" size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
