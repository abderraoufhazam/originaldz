import { getLocale } from '@/lib/locale';
import { getDictionary, t } from '@/lib/i18n';

export const dynamic = 'force-dynamic';

const CONTENT: Record<string, { title: string; body: string[] }> = {
  ar: {
    title: 'من نحن',
    body: [
      'originaldz متجر إلكتروني جزائري متخصّص في بيع منتجات متنوّعة عالية الجودة، مع الدفع عند الاستلام والتوصيل عبر World Express إلى جميع ولايات الوطن الـ58.',
      'هدفنا أن نجعل تجربة التسوّق سهلة وآمنة: تختار منتجك، تملأ معلوماتك، ونتصل بك لتأكيد الطلب قبل الشحن.',
    ],
  },
  en: {
    title: 'About us',
    body: [
      'originaldz is an Algerian online store selling a wide range of quality products, with cash on delivery and delivery via World Express to all 58 wilayas.',
      'Our goal is a simple, safe shopping experience: choose your product, fill in your details, and we call you to confirm before shipping.',
    ],
  },
  fr: {
    title: 'À propos de nous',
    body: [
      'originaldz est une boutique en ligne algérienne qui vend une large gamme de produits de qualité, en paiement à la livraison avec livraison via World Express dans les 58 wilayas.',
      'Notre objectif : une expérience simple et sûre — choisissez votre produit, remplissez vos informations, et nous vous appelons pour confirmer avant l’envoi.',
    ],
  },
};

export default function AboutPage() {
  const locale = getLocale();
  const dict = getDictionary(locale);
  const content = CONTENT[locale] ?? CONTENT.ar;
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-extrabold text-slate-900">{t(dict, 'about.title')}</h1>
      <div className="mt-6 space-y-4 text-slate-600">
        {content.body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </div>
  );
}
