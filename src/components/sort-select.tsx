'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function SortSelect({
  current,
  options,
}: {
  current: string;
  options: { value: string; label: string }[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', e.target.value);
    router.push(`/products?${params.toString()}`);
  }

  return (
    <select
      value={current}
      onChange={onChange}
      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none focus:border-brand-600"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
