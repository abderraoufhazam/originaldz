'use client';

import { useState } from 'react';
import { getDictionary, t } from '@/lib/i18n';
import type { Locale } from '@/lib/types';

export default function ShareButton({ locale, title }: { locale: Locale; title: string }) {
  const dict = getDictionary(locale);
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        /* fall through to copy */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 3v12m0-12 4 4m-4-4L8 7M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {copied ? '✓' : t(dict, 'product.share')}
    </button>
  );
}
