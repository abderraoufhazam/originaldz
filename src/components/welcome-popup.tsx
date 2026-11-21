'use client';

import { useEffect, useState } from 'react';
import { getDictionary, t } from '@/lib/i18n';
import type { Locale } from '@/lib/types';
import { isValidAlgerianPhone } from '@/lib/format';

export default function WelcomePopup({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const [visible, setVisible] = useState(false);
  const [phone, setPhone] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('odz_popup_dismissed');
    if (!dismissed) {
      const timer = setTimeout(() => setVisible(true), 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  function dismiss() {
    localStorage.setItem('odz_popup_dismissed', '1');
    setVisible(false);
  }

  function submit() {
    if (!isValidAlgerianPhone(phone)) return;
    localStorage.setItem('odz_phone', phone);
    localStorage.setItem('odz_welcome', '1');
    setDone(true);
    setTimeout(() => setVisible(false), 1200);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        {done ? (
          <div className="text-center">
            <div className="text-3xl">🎉</div>
            <p className="mt-2 font-semibold text-brand-800">{t(dict, 'welcome.title')}</p>
          </div>
        ) : (
          <>
            <div className="text-center">
              <div className="text-3xl">🎁</div>
              <h2 className="mt-2 text-lg font-bold text-slate-900">{t(dict, 'welcome.title')}</h2>
              <p className="mt-1 text-sm text-slate-600">
                {t(dict, 'welcome.text', { n: (window as any).__ODZ_SETTINGS__?.welcome_discount ?? 10 })}
              </p>
            </div>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t(dict, 'form.phonePlaceholder')}
              className="mt-4 w-full rounded-xl border border-slate-300 px-4 py-3 text-center text-lg outline-none focus:border-brand-600"
              dir="ltr"
            />
            <button
              type="button"
              onClick={submit}
              disabled={!isValidAlgerianPhone(phone)}
              className="mt-3 w-full rounded-xl bg-accent-500 py-3 font-bold text-white hover:bg-accent-600 disabled:opacity-40"
            >
              {t(dict, 'welcome.cta')}
            </button>
            <button
              type="button"
              onClick={dismiss}
              className="mt-2 w-full py-1 text-sm text-slate-400 hover:text-slate-600"
            >
              {t(dict, 'welcome.later')}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
