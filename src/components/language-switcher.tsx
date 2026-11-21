'use client';

import { usePathname, useRouter } from 'next/navigation';

const LABELS: Record<string, string> = { ar: 'ع', en: 'EN', fr: 'FR' };

export default function LanguageSwitcher({ locale }: { locale: string }) {
  const router = useRouter();
  const pathname = usePathname();

  function switchTo(next: string) {
    document.cookie = `locale=${next}; path=/; max-age=31536000`;
    router.refresh();
  }

  return (
    <div className="flex items-center gap-1 rounded-full border border-slate-200 p-0.5">
      {(['ar', 'en', 'fr'] as const).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => switchTo(code)}
          aria-pressed={locale === code}
          className={`rounded-full px-2 py-1 text-xs font-semibold transition ${
            locale === code
              ? 'bg-brand-800 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          {LABELS[code]}
        </button>
      ))}
    </div>
  );
}
