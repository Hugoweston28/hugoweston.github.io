import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import './DepthCarousel.css';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const normalize = (item) => typeof item === 'string' ? { image: item, alt: '' } : item;

export default function DepthCarousel({
  items,
  cardWidth = 330,
  cardHeight = 410,
  radius = 2,
  tint = '#170809',
  depth = 190,
  spread = 82,
  tilt = 20,
  tiltDirection = 'right',
  perspective = 1350,
  visibleCards = 2,
  falloff = 0.22,
  blur = 4,
  duration = 760,
  ease = 'power3.out',
  autoplay = false,
  autoplayDelay = 5200,
  loop = true,
  showControls = true,
  showIndicators = true,
  onChange,
  className = '',
}) {
  const slides = useMemo(() => (Array.isArray(items) ? items : []).map(normalize), [items]);
  const cardRefs = useRef([]);
  const overlayRefs = useRef([]);
  const tweenRef = useRef(null);
  const dragRef = useRef(null);
  const pauseRef = useRef(false);
  const [active, setActive] = useState(0);
  const [scale, setScale] = useState(1);
  const activeRef = useRef(0);
  const count = slides.length;
  const direction = tiltDirection === 'left' ? -1 : 1;

  const layout = useCallback((position, animate = false) => {
    if (!count) return;
    cardRefs.current.forEach((card, index) => {
      if (!card) return;
      let distance = index - position;
      if (loop && count > 1) {
        distance = ((distance % count) + count) % count;
        if (distance > count / 2) distance -= count;
      }
      const absolute = Math.abs(distance);
      const behind = Math.max(0, distance);
      const visible = absolute <= visibleCards + 0.5;
      const opacity = visible ? (distance < 0 ? Math.max(0, 1 + distance) : 1) : 0;
      const brightness = Math.max(0.16, 1 - behind * falloff);
      const blurAmount = Math.min(blur, (behind / Math.max(visibleCards, 1)) * blur);
      const props = {
        x: direction * spread * distance,
        z: -depth * distance,
        rotationY: direction * tilt * clamp(distance, 0, 1),
        scale,
        opacity,
        filter: `brightness(${brightness}) blur(${blurAmount}px)`,
        zIndex: Math.round(1000 - distance * 10),
        pointerEvents: visible && opacity > 0.05 ? 'auto' : 'none',
        duration: animate ? duration / 1000 : 0,
        ease,
        overwrite: true,
      };
      if (animate) gsap.to(card, props);
      else gsap.set(card, props);
      if (overlayRefs.current[index]) {
        gsap.to(overlayRefs.current[index], { opacity: clamp(behind * falloff * 1.15, 0, 0.8), duration: animate ? duration / 1000 : 0, overwrite: true });
      }
    });
  }, [blur, count, depth, direction, duration, ease, falloff, loop, scale, spread, tilt, visibleCards]);

  const goTo = useCallback((rawIndex, animate = true) => {
    if (!count) return;
    const next = loop ? ((rawIndex % count) + count) % count : clamp(rawIndex, 0, count - 1);
    let target = next;
    if (loop && count > 1) {
      const delta = ((next - activeRef.current + count) % count);
      target = delta > count / 2 ? activeRef.current - (count - delta) : activeRef.current + delta;
    }
    tweenRef.current?.kill();
    const from = { value: activeRef.current };
    tweenRef.current = gsap.to(from, {
      value: target,
      duration: animate ? duration / 1000 : 0,
      ease,
      onUpdate: () => layout(from.value, false),
      onComplete: () => {
        activeRef.current = next;
        setActive(next);
        layout(next, false);
        onChange?.(next, slides[next]);
      },
    });
  }, [count, duration, ease, layout, loop, onChange, slides]);

  useEffect(() => {
    layout(active, false);
    return () => tweenRef.current?.kill();
  }, [active, layout]);

  useEffect(() => {
    const root = cardRefs.current[0]?.parentElement?.parentElement;
    if (!root) return undefined;
    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      setScale(clamp(width / (cardWidth + spread * 2 + 132), 0.42, 1));
    });
    observer.observe(root);
    return () => observer.disconnect();
  }, [cardWidth, spread]);

  useEffect(() => {
    if (!autoplay || count < 2) return undefined;
    const timer = window.setInterval(() => {
      if (!pauseRef.current) goTo(activeRef.current + 1);
    }, Math.max(autoplayDelay, 900));
    return () => window.clearInterval(timer);
  }, [autoplay, autoplayDelay, count, goTo]);

  useEffect(() => () => tweenRef.current?.kill(), []);

  const handlePointerDown = (event) => {
    if (count < 2 || event.button !== 0) return;
    tweenRef.current?.kill();
    dragRef.current = { x: event.clientX, start: activeRef.current, moved: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const handlePointerMove = (event) => {
    const drag = dragRef.current;
    if (!drag) return;
    const delta = event.clientX - drag.x;
    if (Math.abs(delta) > 5) drag.moved = true;
    if (drag.moved) layout(drag.start - delta / Math.max(cardWidth * 0.55, 72), false);
  };
  const handlePointerUp = (event) => {
    const drag = dragRef.current;
    if (!drag) return;
    dragRef.current = null;
    if (drag.moved) {
      const step = Math.round((drag.x - event.clientX) / Math.max(cardWidth * 0.55, 72));
      goTo(drag.start + (step || (event.clientX < drag.x ? 1 : -1)));
    }
  };

  return (
    <div
      className={`depth-carousel ${className}`.trim()}
      style={{ '--dc-perspective': `${perspective}px` }}
      role="region"
      aria-roledescription="carousel"
      aria-label="美术作品展示"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft') { event.preventDefault(); goTo(active - 1); }
        if (event.key === 'ArrowRight') { event.preventDefault(); goTo(active + 1); }
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerEnter={() => { pauseRef.current = true; }}
      onPointerLeave={() => { pauseRef.current = false; handlePointerUp({ clientX: dragRef.current?.x ?? 0 }); }}
    >
      <div className="depth-carousel__stage">
        {slides.map((item, index) => (
          <button
            className="depth-carousel__card"
            key={`${item.image}-${index}`}
            ref={(element) => { cardRefs.current[index] = element; }}
            type="button"
            style={{ width: cardWidth, height: cardHeight, borderRadius: radius, transform: 'translate(-50%, -50%)' }}
            aria-label={`${item.title || item.alt || `作品 ${index + 1}`}，点击切换`}
            aria-hidden={active !== index}
            onClick={() => {
              if (dragRef.current?.moved) return;
              goTo(index);
            }}
          >
            <img className="depth-carousel__img" src={item.image} alt={item.alt || ''} draggable="false" loading="lazy" decoding="async" onError={(event) => event.currentTarget.parentElement?.setAttribute('data-missing-image', '')} />
            <span className="depth-carousel__tint" ref={(element) => { overlayRefs.current[index] = element; }} style={{ background: tint }} />
            <span className="depth-carousel__fallback"><b>{item.title || `作品 0${index + 1}`}</b><small>素材文件待载入</small></span>
            {(item.title || item.subtitle) && <span className="depth-carousel__label"><b>{item.title}</b>{item.subtitle && <small>{item.subtitle}</small>}</span>}
          </button>
        ))}
      </div>
      {showControls && count > 1 && <>
        <button type="button" className="depth-carousel__arrow depth-carousel__arrow--prev" aria-label="上一幅作品" onClick={() => goTo(active - 1)}><span aria-hidden="true">←</span></button>
        <button type="button" className="depth-carousel__arrow depth-carousel__arrow--next" aria-label="下一幅作品" onClick={() => goTo(active + 1)}><span aria-hidden="true">→</span></button>
      </>}
      {showIndicators && count > 1 && <div className="depth-carousel__dots" role="tablist" aria-label="选择作品">
        {slides.map((item, index) => <button key={item.image} type="button" role="tab" aria-label={`第 ${index + 1} 幅：${item.title || '作品'}`} aria-selected={active === index} className={`depth-carousel__dot${active === index ? ' is-active' : ''}`} onClick={() => goTo(index)} />)}
      </div>}
      <div className="depth-carousel__caption" aria-live="polite"><span>{slides[active]?.subtitle || 'ORIGINAL ARTWORK'}</span><strong>{slides[active]?.title || `作品 0${active + 1}`}</strong><small>{String(active + 1).padStart(2, '0')} <i>/</i> {String(count).padStart(2, '0')}</small></div>
    </div>
  );
}
