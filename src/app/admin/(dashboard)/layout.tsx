import { requireAdmin } from '@/lib/admin';
import AdminSidebar from '@/components/admin/sidebar';
import AdminLogout from '@/components/admin-logout';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  requireAdmin();
  return (
    <div dir="rtl" className="min-h-screen bg-slate-100">
      <AdminSidebar />
      <div className="ms-64 flex min-h-screen flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
          <h1 className="text-lg font-extrabold text-slate-900">لوحة التحكم</h1>
          <div className="flex items-center gap-3">
            <AdminLogout />
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
