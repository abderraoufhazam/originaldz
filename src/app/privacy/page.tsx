import { getLocale } from '@/lib/locale';
import { getDictionary, t } from '@/lib/i18n';

export const dynamic = 'force-dynamic';

const CONTENT: Record<string, { title: string; body: string[] }> = {
  ar: {
    title: 'سياسة الخصوصية',
    body: [
      'نحترم خصوصيتك. المعلومات التي تجمعها (الاسم، اللقب، رقم الهاتف، العنوان) تُستخدم فقط لمعالجة طلبك وتوصيله، ولا نشاركها مع أي طرف ثالث.',
      'يُستخدم رقم هاتفك للاتصال بك لتأكيد الطلب وتحديد موعد التوصيل. لا نرسل رسائل تسويقية دون موافقتك.',
    ],
  },
  en: {
    title: 'Privacy policy',
    body: [
      'We respect your privacy. The information we collect (first name, last name, phone number, address) is used only to process and deliver your order, and is never shared with third parties.',
      'Your phone number is used to call you to confirm your order and arrange delivery. We do not send marketing messages without your consent.',
    ],
  },
  fr: {
    title: 'Politique de confidentialité',
    body: [
      'Nous respectons votre vie privée. Les informations collectées (prénom, nom, téléphone, adresse) servent uniquement à traiter et livrer votre commande, et ne sont jamais partagées avec des tiers.',
      'Votre numéro est utilisé pour vous appeler afin de confirmer la commande et organiser la livraison. Aucun message marketing sans votre accord.',
    ],
  },
};

export default function PrivacyPage() {
  const locale = getLocale();
  const dict = getDictionary(locale);
  const content = CONTENT[locale] ?? CONTENT.ar;
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-extrabold text-slate-900">{t(dict, 'privacy.title')}</h1>
      <div className="mt-6 space-y-4 text-slate-600">
        {content.body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </div>
  );
}
