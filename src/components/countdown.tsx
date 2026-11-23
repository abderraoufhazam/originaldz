'use client';

import { useEffect, useState } from 'react';

export default function Countdown() {
  const [remaining, setRemaining] = useState('--:--:--');

  useEffect(() => {
    function tick() {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const diff = Math.max(0, midnight.getTime() - now.getTime());
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setRemaining(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span dir="ltr" className="inline-block rounded-lg bg-rose-50 px-3 py-1 font-mono text-xl font-bold text-rose-600">
      {remaining}
    </span>
  );
}
