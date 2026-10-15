import { useEffect, useRef, useState } from 'react';
import './CircularCarousel.css';

export default function CircularCarousel({
  items,
  preset = 'cylinder',
  intro = 'rise',
  cardWidth = 250,
  aspectRatio = 1.18,
  gap = 34,
  speed = 8,
  autoplay = 'drift',
  direction = 'left',
  draggable = true,
  momentum = 0.6,
  snap = true,
  pauseOnHover = true,
  focusOnClick = true,
  parallax = 0.3,
  stretch = 0.35,
  depthFade = 0.55,
  fadeColor = '#090909',
  cornerRadius = 3,
  captions = true,
  onChange,
  onItemClick,
}) {
  const ringRef = useRef(null);
  const settingsRef = useRef({ angle: 0, target: null, velocity: 0, dragging: false, hovering: false, startX: 0, startAngle: 0, active: 0, pointerX: 0, pointerY: 0, lastTime: 0 });
  const onChangeRef = useRef(onChange);
  const onItemClickRef = useRef(onItemClick);
  const [active, setActive] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const step = 360 / items.length;
  const radius = (cardWidth + gap) / (2 * Math.tan(Math.PI / items.length));
  const height = cardWidth / aspectRatio;
  const sign = direction === 'right' ? 1 : -1;

  onChangeRef.current = onChange;
  onItemClickRef.current = onItemClick;

  useEffect(() => {
    setLoaded(0);
  }, [items.length]);

  useEffect(() => {
    const state = settingsRef.current;
    let frame = 0;
    let previous = 0;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const animate = (now) => {
      const dt = previous ? Math.min((now - previous) / 1000, 0.05) : 0;
      previous = now;
      if (state.target !== null && !state.dragging) {
        const delta = state.target - state.angle;
        state.velocity += delta * 13 * dt;
        state.velocity *= Math.exp(-6 * dt);
        state.angle += state.velocity * dt;
        if (Math.abs(delta) < 0.25 && Math.abs(state.velocity) < 1.5) {
          state.angle = state.target;
          state.target = null;
          state.velocity = 0;
        }
      } else if (!reduced && autoplay === 'drift' && loaded >= items.length && !state.dragging && !(pauseOnHover && state.hovering)) {
        state.angle += sign * speed * dt;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `rotateY(${state.angle}deg) scale(${1 + Math.min(Math.abs(state.velocity) / 5000, stretch * 0.08)})`;
      }
      const next = ((Math.round(-state.angle / step) % items.length) + items.length) % items.length;
      if (next !== state.active) {
        state.active = next;
        setActive(next);
        onChangeRef.current?.(next);
      }
      frame = window.requestAnimationFrame(animate);
    };
    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, [autoplay, items.length, loaded, pauseOnHover, sign, speed, step, stretch]);

  const focusIndex = (index) => {
    const state = settingsRef.current;
    const destination = -index * step;
    state.target = destination + 360 * Math.round((state.angle - destination) / 360);
    state.velocity = 0;
  };

  const handlePointerDown = (event) => {
    if (!draggable || event.button !== 0) return;
    const state = settingsRef.current;
    state.dragging = true;
    state.startX = event.clientX;
    state.startAngle = state.angle;
    state.velocity = 0;
    state.lastTime = performance.now();
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event) => {
    const state = settingsRef.current;
    const bounds = event.currentTarget.getBoundingClientRect();
    if (event.pointerType === 'mouse') {
      state.pointerX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
      state.pointerY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
      event.currentTarget.style.setProperty('--carousel-yaw', `${state.pointerX * parallax * 8}deg`);
      event.currentTarget.style.setProperty('--carousel-pitch', `${state.pointerY * -parallax * 5}deg`);
    }
    if (state.dragging) {
      const rotationPerPixel = 360 / (2 * Math.PI * radius);
      const dx = event.clientX - state.startX;
      state.angle = state.startAngle + dx * rotationPerPixel;
      state.velocity = dx * rotationPerPixel * momentum * 0.08;
    }
  };

  const finishDrag = () => {
    const state = settingsRef.current;
    if (!state.dragging) return;
    state.dragging = false;
    if (snap && autoplay === 'off') state.target = Math.round((state.angle + state.velocity) / step) * step;
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      focusIndex((active + 1) % items.length);
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      focusIndex((active + items.length - 1) % items.length);
    }
  };

  return (
    <div
      className="circular-carousel"
      data-preset={preset}
      data-intro={intro}
      data-draggable={draggable ? '' : undefined}
      role="region"
      aria-label="兴趣与灵感图片轮播"
      aria-roledescription="carousel"
      tabIndex={0}
      style={{ '--carousel-radius': `${radius}px`, '--carousel-width': `${cardWidth}px`, '--carousel-height': `${height}px`, '--carousel-fade': fadeColor, '--carousel-depth-fade': depthFade, '--carousel-yaw': '0deg', '--carousel-pitch': '0deg' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishDrag}
      onPointerCancel={finishDrag}
      onPointerEnter={() => { settingsRef.current.hovering = true; }}
      onPointerLeave={(event) => { settingsRef.current.hovering = false; finishDrag(event); event.currentTarget.style.setProperty('--carousel-yaw', '0deg'); event.currentTarget.style.setProperty('--carousel-pitch', '0deg'); }}
      onKeyDown={handleKeyDown}
    >
      <div className="circular-carousel__camera" style={{ '--carousel-parallax': `${parallax}` }}>
        <div className="circular-carousel__ring" ref={ringRef}>
          {items.map((item, index) => {
            const angle = index * step;
            const facing = Math.max(0, Math.cos(angle * Math.PI / 180));
            const shade = depthFade * (1 - facing);
            return (
              <button
                className="circular-carousel__card"
                key={`${item.src}-${index}`}
                type="button"
                aria-label={`${item.title || item.alt || `图片 ${index + 1}`}，点击转到正面`}
                style={{ transform: `translate(-50%, -50%) rotateY(${angle}deg) translateZ(var(--carousel-radius))`, '--card-index': index, '--card-shade': shade }}
                onClick={() => {
                  if (focusOnClick) focusIndex(index);
                  onItemClickRef.current?.(item, index);
                }}
              >
                <img src={item.src} alt={item.alt || ''} draggable="false" loading="lazy" onLoad={() => setLoaded((count) => Math.min(count + 1, items.length))} onError={() => setLoaded((count) => Math.min(count + 1, items.length))} />
                <span className="circular-carousel__shade" />
              </button>
            );
          })}
        </div>
      </div>
      {captions && items[active] && (
        <div className="circular-carousel__caption" aria-live="polite" key={active}>
          <strong>{items[active].title || items[active].alt}</strong>
          {items[active].subtitle && <span>{items[active].subtitle}</span>}
          <small>{String(active + 1).padStart(2, '0')} <i>/</i> {String(items.length).padStart(2, '0')}</small>
        </div>
      )}
    </div>
  );
}
