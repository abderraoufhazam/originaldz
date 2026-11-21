import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="text-6xl font-extrabold text-brand-800">404</div>
      <p className="mt-2 text-slate-600">الصفحة غير موجودة</p>
      <Link href="/" className="mt-4 rounded-xl bg-brand-800 px-6 py-2.5 font-bold text-white hover:bg-brand-900">
        العودة للرئيسية
      </Link>
    </div>
  );
}
