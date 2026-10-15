import { useEffect, useRef, useState } from 'react';

export default function CountUp({ to = 0, suffix = '', duration = 1200 }) {
  const ref = useRef(null);
  const started = useRef(false);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(to);
      return undefined;
    }
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setValue(Math.round(to * eased));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          obs.disconnect();
        }
      });
    }, { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [to, duration]);

  const pad = String(to).length;
  // data-nosplit 必须挂在数字自己身上：页面进场时 App.jsx 的 splitRevealText 会把
  // [data-reveal] 里的文本节点逐个拆成 <span class="reveal-char">。数字是"会被 React
  // 反复更新的文字"，一旦文本节点被换掉，React 之后所有写入都落在已经脱离文档的旧节点上，
  // 页面上就永远停在初始值（00 / 0），看着像"没跟电脑版同步"。
  return <span ref={ref} data-nosplit>{String(value).padStart(pad, '0')}{suffix}</span>;
}
