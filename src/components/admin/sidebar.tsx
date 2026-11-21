'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ITEMS = [
  { href: '/admin/orders', label: 'الطلبيات', icon: '🛒' },
  { href: '/admin/products', label: 'المنتجات', icon: '📦' },
  { href: '/admin/offices', label: 'مكاتب التوصيل', icon: '📍' },
  { href: '/admin/testimonials', label: 'التقييمات', icon: '⭐' },
  { href: '/admin/blacklist', label: 'القائمة السوداء', icon: '🚫' },
  { href: '/admin/settings', label: 'الإعدادات', icon: '⚙️' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="fixed inset-y-0 start-0 z-40 flex w-64 flex-col bg-slate-900 text-slate-200">
      <div className="flex h-16 items-center gap-2 border-b border-slate-800 px-5">
        <img src="/logo.png" alt="originaldz" className="h-8 w-auto rounded bg-white/10 p-0.5" />
        <span className="text-sm font-extrabold text-white">لوحة الإدارة</span>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {ITEMS.map((it) => {
          const active = pathname.startsWith(it.href);
          return (
            <Link
              key={it.href}
              href={it.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                active
                  ? 'bg-brand-700 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="text-base leading-none">{it.icon}</span>
              {it.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-slate-800 p-4">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white"
        >
          ↗ عرض المتجر
        </a>
      </div>
    </aside>
  );
}
