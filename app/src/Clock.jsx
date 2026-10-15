import { useEffect, useState } from 'react';

export default function Clock({ label = '' }) {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      try {
        setTime(new Date().toLocaleTimeString('zh-CN', { hour12: false, timeZone: 'Asia/Shanghai' }));
      } catch (err) {
        setTime(new Date().toLocaleTimeString());
      }
    };
    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, []);

  return <span className="live-clock">{label}{time}</span>;
}
