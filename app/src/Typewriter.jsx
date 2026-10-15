import { useEffect, useRef, useState } from 'react';

const DEFAULT_PHRASES = [
  { text: 'IP：沈阳', color: 'var(--tw-red)', type: 90, del: 45, hold: 1600 },
  { text: 'New freshman here. My major? Still trying to understand it.', color: 'var(--tw-gold)', type: 55, del: 28, hold: 2200 },
];

export default function Typewriter({ phrases, type: typeSpeed = 60, del: delSpeed = 30, hold = 1900 }) {
  const list = phrases && phrases.length ? phrases : DEFAULT_PHRASES;
  const [index, setIndex] = useState(0);
  const [len, setLen] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const timer = useRef(0);

  useEffect(() => {
    const current = list[index];
    const full = current.text.length;
    const typeMs = current.type || typeSpeed;
    const delMs = current.del || delSpeed;
    const holdMs = current.hold || hold;

    if (!deleting && len < full) {
      timer.current = window.setTimeout(() => setLen((n) => n + 1), typeMs);
    } else if (!deleting && len === full) {
      timer.current = window.setTimeout(() => setDeleting(true), holdMs);
    } else if (deleting && len > 0) {
      timer.current = window.setTimeout(() => setLen((n) => n - 1), delMs);
    } else {
      timer.current = window.setTimeout(() => {
        setDeleting(false);
        setIndex((i) => (i + 1) % list.length);
      }, 350);
    }

    return () => window.clearTimeout(timer.current);
  }, [len, deleting, index, list, typeSpeed, delSpeed, hold]);

  const current = list[index];
  const shown = current.text.slice(0, len);
  const color = current.color || 'var(--tw-gold)';

  return (
    <span className="typewriter" style={{ color }}>
      <span className="typewriter-text">{shown}</span>
      <span className="typewriter-caret" aria-hidden="true" />
      <span className="sr-only">{current.text}</span>
    </span>
  );
}

