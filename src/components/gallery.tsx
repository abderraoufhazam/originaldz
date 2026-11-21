'use client';

import { useState } from 'react';

export default function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const list = images?.length ? images : ['/placeholder.svg'];
  const current = list[Math.min(active, list.length - 1)];

  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row">
      {list.length > 1 ? (
        <div className="flex shrink-0 gap-2 sm:flex-col">
          {list.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={`h-16 w-16 overflow-hidden rounded-xl border-2 transition ${
                i === active ? 'border-brand-600' : 'border-transparent opacity-70 hover:opacity-100'
              }`}
              aria-label={`image ${i + 1}`}
            >
              <img src={img} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <img src={current} alt={alt} className="aspect-square w-full object-cover" />
      </div>
    </div>
  );
}
