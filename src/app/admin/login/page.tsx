'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.replace('/admin/orders');
      router.refresh();
    } else {
      setError('كلمة المرور غير صحيحة');
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">
        <div className="text-center">
          <img src="/logo.jpg" alt="originaldz" className="mx-auto h-16 w-auto object-contain" />
          <h1 className="mt-3 text-xl font-extrabold text-slate-900">لوحة إدارة originaldz</h1>
        </div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="كلمة المرور"
          className="mt-6 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-brand-600"
          autoFocus
        />
        {error ? <p className="mt-2 text-sm font-semibold text-red-600">{error}</p> : null}
        <button
          type="submit"
          disabled={loading || !password}
          className="mt-4 w-full rounded-xl bg-brand-800 py-3 font-bold text-white hover:bg-brand-900 disabled:opacity-40"
        >
          {loading ? 'جارٍ الدخول…' : 'دخول'}
        </button>
      </form>
    </div>
  );
}
