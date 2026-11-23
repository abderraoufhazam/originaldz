'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name, phone, message }),
    });
    if (res.ok) {
      setDone(true);
    } else {
      setError('تعذّر الإرسال — حاول مجددًا.');
    }
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-14">
      <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-soft">
        <h1 className="text-2xl font-extrabold text-slate-900">اتصل بنا</h1>
        <p className="mt-1 text-sm text-slate-500">أرسل لنا استفسارك وسنرد عليك بأسرع وقت.</p>

        {done ? (
          <div className="mt-6 rounded-2xl bg-green-50 p-6 text-center">
            <div className="text-3xl">✅</div>
            <p className="mt-2 font-bold text-green-700">تم إرسال رسالتك بنجاح — سنتواصل معك قريبًا.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-4">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="اسمك" required className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-brand-600" />
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="رقم الهاتف" inputMode="tel" dir="ltr" required className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-brand-600" />
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="رسالتك…" rows={4} required className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-brand-600" />
            {error ? <p className="text-sm font-semibold text-rose-600">{error}</p> : null}
            <button type="submit" disabled={loading} className="w-full rounded-xl bg-brand-600 py-3 font-bold text-white hover:bg-brand-700 disabled:opacity-50">
              {loading ? 'جارٍ الإرسال…' : 'إرسال'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
