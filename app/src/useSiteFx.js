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
    // 手机 / 平板（无 hover 的粗指针）走触摸特效，与鼠标特效互斥
    const coarse = window.matchMedia('(hover: none), (pointer: coarse)').matches;

    // 指针 / 触摸特效的宿主：所有特效节点都塞进页面里的 .pointer-fx 层，
    // --pointer-* / --touch-* 这些每帧都在变的变量只写在这个容器上。
    // 写在 :root 上的话，一次变量更新会让整棵文档树重新计算样式。
    const fxHost = document.querySelector('.pointer-fx') || document.body;

    const ring = document.createElement('div');
    ring.className = 'cursor-ring';
    ring.setAttribute('aria-hidden', 'true');
    fxHost.appendChild(ring);
    cleanups.push(() => ring.remove());

    // 光尾：5 颗珠子全部只靠 CSS 变量定位，用各自不同的 transition 时长做"跟随延迟"，
    // 所以不需要逐帧 JS；指针停下后整层淡出（html.is-pointer-moving）。
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    trail.setAttribute('aria-hidden', 'true');
    for (let i = 0; i < 5; i += 1) {
      const orb = document.createElement('span');
      orb.className = 'cursor-trail-orb';
      trail.appendChild(orb);
    }
    fxHost.appendChild(trail);
    cleanups.push(() => trail.remove());

    // 进度条与"返回顶部"合并成一个滚动处理，而且只在 rAF 里写样式：
    // 原来两个监听各自去读 scrollHeight / scrollY，滚动时每帧都可能带上一次布局查询；
    // 现在总高度交给 ResizeObserver 维护，滚动回调只读一个 scrollTop。
    // 同时给 <html> 挂 is-scrolling —— CSS 借此在滚动期间撤下全屏混合层、
    // 暂停首屏封面与光晕的常驻动画（掉帧最集中的几处都在那儿），停下 160ms 后自动摘掉。
    const docEl = document.documentElement;
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);
    const toTop = document.createElement('button');
    toTop.type = 'button';
    toTop.className = 'back-to-top';
    toTop.setAttribute('aria-label', '返回顶部');
    toTop.innerHTML = '<span aria-hidden="true">↑</span>';
    toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }));
    document.body.appendChild(toTop);
    let scrollFrame = 0;
    let scrollIdle = 0;
    let scrollMax = 0;
    const measureScroll = () => { scrollMax = docEl.scrollHeight - docEl.clientHeight; };
    const paintScroll = () => {
      scrollFrame = 0;
      const top = docEl.scrollTop;
      bar.style.transform = `scaleX(${scrollMax > 0 ? Math.min(top / scrollMax, 1) : 0})`;
      toTop.classList.toggle('is-shown', top > 600);
    };
    const onScroll = () => {
      docEl.classList.add('is-scrolling');
      window.clearTimeout(scrollIdle);
      scrollIdle = window.setTimeout(() => docEl.classList.remove('is-scrolling'), 160);
      if (!scrollFrame) scrollFrame = window.requestAnimationFrame(paintScroll);
    };
    const scrollObserver = 'ResizeObserver' in window ? new ResizeObserver(measureScroll) : null;
    if (scrollObserver) scrollObserver.observe(document.body);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measureScroll, { passive: true });
    measureScroll();
    paintScroll();
    cleanups.push(() => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', measureScroll);
      if (scrollObserver) scrollObserver.disconnect();
      window.clearTimeout(scrollIdle);
      if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
      docEl.classList.remove('is-scrolling');
      bar.remove();
      toTop.remove();
    });

    if (!reduced) {
      const interactives = document.querySelectorAll('a, button');
      interactives.forEach((el) => {
        if (el.closest('.depth-carousel, .circular-carousel')) return;
        const onEnter = () => ring.classList.add('is-active');
        const onMove = (e) => {
          const r = el.getBoundingClientRect();
          const dx = (e.clientX - (r.left + r.width / 2)) * 0.24;
          const dy = (e.clientY - (r.top + r.height / 2)) * 0.24;
          // 磁吸幅度跟着元素尺寸走：小按钮别被推 9px，大卡片才吃得下
          const reach = Math.min(9, Math.max(3, r.width * 0.06));
          el.style.transform = `translate(${Math.max(-reach, Math.min(reach, dx))}px, ${Math.max(-reach, Math.min(reach, dy))}px)`;
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
          // 倾角更大，并且整张卡片被"抬"起来一点：鼠标划过时立体跟手更明显
          card.style.setProperty('--tilt-x', `${-py * 10}deg`);
          card.style.setProperty('--tilt-y', `${px * 10}deg`);
          card.style.setProperty('--tilt-z', '16px');
        };
        const onLeave = () => {
          card.style.setProperty('--tilt-x', '0deg');
          card.style.setProperty('--tilt-y', '0deg');
          card.style.setProperty('--tilt-z', '0px');
        };
        card.addEventListener('mousemove', onMove);
        card.addEventListener('mouseleave', onLeave);
        cleanups.push(() => {
          card.removeEventListener('mousemove', onMove);
          card.removeEventListener('mouseleave', onLeave);
        });
      });

      // 点击涟漪：原来是一圈 60px 的小圈，现在换成"实圈 + 外扩回声 + 中心柔光"三层。
      // 实圈最大直径约 240~374px、回声约 374~578px（尺寸用 clamp 跟随视口），手机上同样够大。
      const clickFxLayers = ['click-ripple', 'click-ripple click-ripple--echo', 'click-flash'];
      const onDocClick = (e) => {
        clickFxLayers.forEach((className) => {
          const node = document.createElement('span');
          node.className = className;
          node.style.left = `${e.clientX}px`;
          node.style.top = `${e.clientY}px`;
          document.body.appendChild(node);
          node.addEventListener('animationend', () => node.remove());
        });
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

    // ── 手机 / 平板：手指滑动特效 ──
    // 触摸时浏览器一旦判定手势为滚动就会发 pointercancel，pointermove 随之断掉，
    // 所以这里只走 touchmove（passive，既不拦滚动也不影响滚动性能）：
    // 指尖位置与滑动速度写进 CSS 变量，由 CSS 画出指尖柔光、沿滑动方向的光带、
    // 三颗延迟跟随的珠子，以及被甩出去的星屑（DOM 直接增删，不经过 React 重渲染）。
    if (!reduced && coarse) {
      const root = document.documentElement;
      const layer = document.createElement('div');
      layer.className = 'touch-fx';
      layer.setAttribute('aria-hidden', 'true');
      const halo = document.createElement('span');
      halo.className = 'touch-halo';
      const streak = document.createElement('span');
      streak.className = 'touch-streak';
      const orbs = document.createElement('div');
      orbs.className = 'touch-trail';
      for (let i = 0; i < 3; i += 1) {
        const orb = document.createElement('span');
        orb.className = 'touch-orb';
        orbs.appendChild(orb);
      }
      layer.appendChild(halo);
      layer.appendChild(streak);
      layer.appendChild(orbs);
      fxHost.appendChild(layer);

      const sparkHost = document.querySelector('.cursor-particles') || document.body;
      let frame = 0;
      let idle = 0;
      let touchX = 0;
      let touchY = 0;
      let lastX = 0;
      let lastY = 0;
      let lastTime = 0;
      let speed = 0;
      let angle = 0;
      let sparkAt = 0;

      const paint = () => {
        frame = 0;
        // 同样写到触摸特效层本身，不写 :root：滑屏时这条通道每帧都在跑
        layer.style.setProperty('--touch-x', `${touchX}px`);
        layer.style.setProperty('--touch-y', `${touchY}px`);
        layer.style.setProperty('--touch-speed', speed.toFixed(3));
        layer.style.setProperty('--touch-angle', `${angle}deg`);
      };

      const onStart = (event) => {
        const point = event.touches[0];
        if (!point) return;
        window.clearTimeout(idle);
        touchX = point.clientX;
        touchY = point.clientY;
        lastX = touchX;
        lastY = touchY;
        lastTime = performance.now();
        speed = 0;
        root.classList.add('is-touching');
        if (!frame) frame = window.requestAnimationFrame(paint);
      };

      const onMove = (event) => {
        const point = event.touches[0];
        if (!point) return;
        touchX = point.clientX;
        touchY = point.clientY;
        const now = performance.now();
        const dt = Math.max(now - lastTime, 8);
        const dx = touchX - lastX;
        const dy = touchY - lastY;
        const len = Math.hypot(dx, dy);
        lastX = touchX;
        lastY = touchY;
        lastTime = now;
        speed = speed * 0.62 + Math.min(len / dt / 1.4, 1) * 0.38;
        if (len > 2) angle = (Math.atan2(dy, dx) * 180) / Math.PI;
        if (!frame) frame = window.requestAnimationFrame(paint);
        if (len > 1 && now - sparkAt > 55) {
          sparkAt = now;
          const white = Math.random() < 0.4;
          const size = 5 + speed * 9;
          const spark = document.createElement('span');
          spark.className = white ? 'touch-spark is-white' : 'touch-spark';
          spark.style.left = `${touchX}px`;
          spark.style.top = `${touchY}px`;
          spark.style.width = `${size}px`;
          spark.style.height = `${size}px`;
          spark.style.setProperty('--spark-x', `${(-dx / len) * (36 + speed * 150) + (Math.random() * 2 - 1) * 44}px`);
          spark.style.setProperty('--spark-y', `${(-dy / len) * (36 + speed * 150) + (Math.random() * 2 - 1) * 44}px`);
          spark.style.setProperty('--spark-life', `${Math.round(640 + Math.random() * 380 - speed * 150)}ms`);
          sparkHost.appendChild(spark);
          spark.addEventListener('animationend', () => spark.remove());
        }
      };

      const onEnd = () => {
        root.classList.remove('is-touching');
        window.clearTimeout(idle);
        idle = window.setTimeout(() => {
          speed = 0;
          layer.style.setProperty('--touch-speed', '0');
        }, 220);
      };

      document.addEventListener('touchstart', onStart, { passive: true });
      document.addEventListener('touchmove', onMove, { passive: true });
      document.addEventListener('touchend', onEnd, { passive: true });
      document.addEventListener('touchcancel', onEnd, { passive: true });
      cleanups.push(() => {
        document.removeEventListener('touchstart', onStart);
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('touchend', onEnd);
        document.removeEventListener('touchcancel', onEnd);
        if (frame) window.cancelAnimationFrame(frame);
        window.clearTimeout(idle);
        root.classList.remove('is-touching');
        layer.remove();
        sparkHost.querySelectorAll('.touch-spark').forEach((node) => node.remove());
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

