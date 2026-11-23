import { getLocale } from '@/lib/locale';

const CONTENT: Record<string, { title: string; items: string[] }> = {
  ar: {
    title: 'سياسة الاستبدال والإرجاع',
    items: [
      'يمكنك طلب الاستبدال أو الإرجاع خلال 24 ساعة من استلام الطلب، بشرط أن يكون المنتج بحالته الأصلية وغير مستخدم.',
      'في حال وجود عيب مصنعي أو منتج غير مطابق للوصف، نتحمّل تكاليف الاستبدال بالكامل.',
      'يتم الاستبدال عبر نفس شركة التوصيل بعد التواصل معنا وتأكيد الطلب.',
      'لا تُقبل الإرجاعات لأسباب شخصية (مثل تغيير الرأي) بعد فتح المنتج واستخدامه.',
      'للتواصل: صفحة "اتصل بنا" أو عبر واتساب.',
    ],
  },
  en: {
    title: 'Returns & exchange policy',
    items: [
      'You can request an exchange or return within 24 hours of receiving your order, provided the product is in its original, unused condition.',
      'For a manufacturing defect or a product that does not match the description, we cover the full exchange cost.',
      'Exchange is handled through the same delivery company after contacting us and confirming the order.',
      'Returns for personal reasons are not accepted after the product has been opened and used.',
      'Contact us via the "Contact us" page or WhatsApp.',
    ],
  },
  fr: {
    title: 'Politique de retour et d’échange',
    items: [
      'Vous pouvez demander un échange ou un retour sous 24 h après réception, à condition que le produit soit dans son état d’origine et non utilisé.',
      'En cas de défaut de fabrication ou de produit non conforme à la description, nous prenons en charge l’échange complet.',
      'L’échange se fait via le même transporteur après nous avoir contactés et confirmé la commande.',
      'Les retours pour raisons personnelles ne sont pas acceptés après ouverture et utilisation du produit.',
      'Contactez-nous via la page « Contact » ou WhatsApp.',
    ],
  },
};

export default function ReturnsPage() {
  const locale = getLocale();
  const c = CONTENT[locale] ?? CONTENT.ar;
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-extrabold text-slate-900">{c.title}</h1>
      <ul className="mt-6 space-y-3 text-slate-600">
        {c.items.map((item, i) => (
          <li key={i} className="flex gap-3">
            <span className="text-brand-600">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
