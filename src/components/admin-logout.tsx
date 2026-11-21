'use client';

import { useRouter } from 'next/navigation';

export default function AdminLogout() {
  const router = useRouter();
  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.replace('/admin/login');
    router.refresh();
  }
  return (
    <button
      type="button"
      onClick={logout}
      className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
    >
      خروج
    </button>
  );
}
