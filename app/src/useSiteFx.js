import { useEffect } from 'react';

const SCRAMBLE = '!<>-_\\/[]{}—=+*^?#01ABCXYZ';
const isAscii = (s) => /^[\x20-\x7E·/]+$/.test(s);

const scrambleText = (el) => {
  const original = el.dataset.scrambleOriginal || el.textContent;
  el.dataset.scrambleOriginal = original;
  if (!isAscii(original) || original.length < 2) return;
  if (el.dataset.scrambling === '1') return;
  el.dataset.scrambling = '1';
  const chars = original.split('');
  const queue = chars.map((ch, i) => ({ ch, start: i * 2, end: i * 2 + 14 }));
  let frame = 0;
  const tick = () => {
    let output = '';
    let done = 0;
    queue.forEach(({ ch, start, end }) => {
      if (frame >= end) { done += 1; output += ch; }
      else if (frame >= start) { output += SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)]; }
      else output += '';
    });
    el.textContent = output;
    if (done < queue.length) { frame += 1; requestAnimationFrame(tick); }
    else { el.textContent = original; el.dataset.scrambling = '0'; }
  };
  tick();
};

const bindScramble = () => {
  const targets = document.querySelectorAll(
    '.eyebrow, .project-meta span:first-child, .strength-detail, .hero-label, .music-card-top span, .skill-strip > span, .contact-bottom, .entry-edition, .metric > span, .heading-note',
  );
  const cleanups = [];
  targets.forEach((el) => {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) => {
        if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        const parent = node.parentElement;
        if (!parent || parent.classList.contains('scramble-target')) return NodeFilter.FILTER_REJECT;
        if (!isAscii(node.nodeValue.trim())) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    const nodes = [];
    let current;
    while ((current = walker.nextNode())) nodes.push(current);
    nodes.forEach((node) => {
      const span = document.createElement('span');
      span.className = 'scramble-target';
      span.textContent = node.nodeValue;
      node.parentNode.replaceChild(span, node);
      const onEnter = () => scrambleText(span);
      span.addEventListener('mouseenter', onEnter);
      cleanups.push(() => span.removeEventListener('mouseenter', onEnter));
    });
  });
  return () => cleanups.forEach((fn) => fn());
};

export default function useSiteFx(entered) {
  useEffect(() => {
    if (!entered) return undefined;
    const cleanups = [];
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ring = document.createElement('div');
    ring.className = 'cursor-ring';
    ring.setAttribute('aria-hidden', 'true');
    document.body.appendChild(ring);
    cleanups.push(() => ring.remove());

    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
      bar.style.transform = `scaleX(${pct / 100})`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    cleanups.push(() => window.removeEventListener('scroll', onScroll));

    const toTop = document.createElement('button');
    toTop.type = 'button';
    toTop.className = 'back-to-top';
    toTop.setAttribute('aria-label', '返回顶部');
    toTop.innerHTML = '<span aria-hidden="true">↑</span>';
    toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }));
    document.body.appendChild(toTop);
    const onScrollTop = () => toTop.classList.toggle('is-shown', window.scrollY > 600);
    window.addEventListener('scroll', onScrollTop, { passive: true });
    onScrollTop();
    cleanups.push(() => { window.removeEventListener('scroll', onScrollTop); toTop.remove(); });

    if (!reduced) {
      const interactives = document.querySelectorAll('a, button');
      interactives.forEach((el) => {
        if (el.closest('.depth-carousel, .circular-carousel')) return;
        const onEnter = () => ring.classList.add('is-active');
        const onMove = (e) => {
          const r = el.getBoundingClientRect();
          const dx = (e.clientX - (r.left + r.width / 2)) * 0.18;
          const dy = (e.clientY - (r.top + r.height / 2)) * 0.18;
          el.style.transform = `translate(${Math.max(-5, Math.min(5, dx))}px, ${Math.max(-5, Math.min(5, dy))}px)`;
        };
        const onLeave = () => { ring.classList.remove('is-active'); el.style.transform = ''; };
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mousemove', onMove);
        el.addEventListener('mouseleave', onLeave);
        cleanups.push(() => {
          el.removeEventListener('mouseenter', onEnter);
          el.removeEventListener('mousemove', onMove);
          el.removeEventListener('mouseleave', onLeave);
        });
      });

      document.querySelectorAll('.project-card').forEach((card) => {
        const onMove = (e) => {
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          card.style.setProperty('--tilt-x', `${-py * 7}deg`);
          card.style.setProperty('--tilt-y', `${px * 7}deg`);
        };
        const onLeave = () => {
          card.style.setProperty('--tilt-x', '0deg');
          card.style.setProperty('--tilt-y', '0deg');
        };
        card.addEventListener('mousemove', onMove);
        card.addEventListener('mouseleave', onLeave);
        cleanups.push(() => {
          card.removeEventListener('mousemove', onMove);
          card.removeEventListener('mouseleave', onLeave);
        });
      });

      const onDocClick = (e) => {
        const ripple = document.createElement('span');
        ripple.className = 'click-ripple';
        ripple.style.left = `${e.clientX}px`;
        ripple.style.top = `${e.clientY}px`;
        document.body.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove());
      };
      document.addEventListener('click', onDocClick);
      cleanups.push(() => document.removeEventListener('click', onDocClick));

      document.querySelectorAll('.wordmark').forEach((logo) => {
        const onClick = () => {
          logo.classList.remove('is-pulse');
          void logo.offsetWidth;
          logo.classList.add('is-pulse');
        };
        logo.addEventListener('click', onClick);
        cleanups.push(() => logo.removeEventListener('click', onClick));
      });
    }

    const sections = document.querySelectorAll('main section[id]');
    const navLinks = Array.from(document.querySelectorAll('.main-nav a'));

    sections.forEach((section, index) => {
      const num = document.createElement('span');
      num.className = 'section-bignum';
      num.setAttribute('aria-hidden', 'true');
      num.textContent = String(index + 1).padStart(2, '0');
      section.appendChild(num);
      cleanups.push(() => num.remove());
    });

    if ('IntersectionObserver' in window && sections.length && navLinks.length) {
      const navObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach((link) => link.classList.toggle('is-current', link.getAttribute('href') === `#${id}`));
          }
        });
      }, { threshold: 0.4 });
      sections.forEach((s) => navObserver.observe(s));
      cleanups.push(() => navObserver.disconnect());
    }

    cleanups.push(bindScramble());

    return () => cleanups.forEach((fn) => fn());
  }, [entered]);
}

