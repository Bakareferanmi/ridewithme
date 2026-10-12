'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { Children, isValidElement, useCallback, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { Icon } from './Icon';

interface CarouselProps {
  /** Accessible name for the carousel and its arrow buttons, e.g. "vehicles". */
  label: string;
  title?: string;
  eyebrow?: string;
  /** Small line under the title, e.g. a count. */
  meta?: string;
  /** Extra control shown beside the arrows, e.g. a "See all" link. */
  action?: ReactNode;
  /** `lg` renders the title as a page-section heading, `md` as a row heading. */
  size?: 'md' | 'lg';
  children: ReactNode;
}

const MIN_PROGRESS = 0.14;

/**
 * Swipeable row. Drag with a finger or the mouse, flick for momentum, or use the arrows / arrow keys.
 * Each child becomes one slide.
 */
export function Carousel({ label, title, eyebrow, meta, action, size = 'md', children }: CarouselProps) {
  const [viewport, embla] = useEmblaCarousel({ align: 'start', containScroll: 'trimSnaps', slidesToScroll: 'auto', dragFree: false, duration: 28 });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fill = useRef<HTMLSpanElement>(null);

  const sync = useCallback(() => {
    if (!embla) return;
    setCanPrev(embla.canScrollPrev());
    setCanNext(embla.canScrollNext());
  }, [embla]);

  const progress = useCallback(() => {
    if (!embla || !fill.current) return;
    const p = Math.min(1, Math.max(0, embla.scrollProgress()));
    fill.current.style.transform = `scaleX(${MIN_PROGRESS + p * (1 - MIN_PROGRESS)})`;
  }, [embla]);

  useEffect(() => {
    if (!embla) return;
    const grab = () => setDragging(true);
    const release = () => setDragging(false);
    sync();
    progress();
    embla.on('select', sync).on('reInit', sync).on('reInit', progress).on('scroll', progress).on('pointerDown', grab).on('pointerUp', release);
    return () => {
      embla.off('select', sync).off('reInit', sync).off('reInit', progress).off('scroll', progress).off('pointerDown', grab).off('pointerUp', release);
    };
  }, [embla, sync, progress]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') embla?.scrollPrev();
    if (e.key === 'ArrowRight') embla?.scrollNext();
  };

  const slides = Children.toArray(children);
  const Heading = size === 'lg' ? 'h2' : 'h3';
  const hasHead = Boolean(title || eyebrow || action || slides.length > 1);

  return (
    <div className={`carousel carousel-${size}`}>
      {hasHead ? (
        <div className="carousel-head">
          <div className="carousel-titles">
            {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
            {title ? <Heading className={size === 'lg' ? 't-h2' : 't-h3'}>{title}</Heading> : null}
            {meta ? <span className="faint t-label">{meta}</span> : null}
          </div>
          <div className="carousel-controls">
            {action}
            <button type="button" className="btn btn-secondary btn-icon btn-sm" aria-label={`Previous ${label}`} disabled={!canPrev} onClick={() => embla?.scrollPrev()}>
              <Icon name="chevronLeft" size={18} />
            </button>
            <button type="button" className="btn btn-secondary btn-icon btn-sm" aria-label={`Next ${label}`} disabled={!canNext} onClick={() => embla?.scrollNext()}>
              <Icon name="chevronRight" size={18} />
            </button>
          </div>
        </div>
      ) : null}

      <div className={`carousel-viewport ${dragging ? 'is-dragging' : ''}`} ref={viewport} role="region" aria-roledescription="carousel" aria-label={label} onKeyDown={onKeyDown}>
        <div className="carousel-track">
          {slides.map((child, i) => (
            <div className="carousel-slide" key={isValidElement(child) && child.key !== null ? child.key : i} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${slides.length}`}>
              {child}
            </div>
          ))}
        </div>
      </div>

      {slides.length > 1 ? (
        <div className="carousel-progress" aria-hidden="true">
          <span ref={fill} className="carousel-progress-fill" style={{ transform: `scaleX(${MIN_PROGRESS})` }} />
        </div>
      ) : null}
    </div>
  );
}
