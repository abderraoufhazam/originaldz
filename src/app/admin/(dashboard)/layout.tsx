import Link from 'next/link';
import { requireAdmin } from '@/lib/admin';
import AdminLogout from '@/components/admin-logout';

const NAV = [
  { href: '/admin/orders', label: 'الطلبيات' },
  { href: '/admin/products', label: 'المنتجات' },
  { href: '/admin/offices', label: 'مكاتب التوصيل' },
  { href: '/admin/testimonials', label: 'التقييمات' },
  { href: '/admin/blacklist', label: 'القائمة السوداء' },
  { href: '/admin/settings', label: 'الإعدادات' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  requireAdmin();
  return (
    <div dir="rtl" className="min-h-screen bg-slate-100">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/admin/orders" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-800 text-lg font-extrabold text-white">
              O
            </span>
            <span className="font-extrabold text-slate-900">originaldz — الإدارة</span>
          </Link>
          <div className="flex items-center gap-3">
            <a href="/" target="_blank" className="text-sm font-semibold text-slate-600 hover:text-brand-700">
              عرض الموقع ↗
            </a>
            <AdminLogout />
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-2">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
