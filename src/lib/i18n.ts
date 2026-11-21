import type { Locale } from './types';

export type Dict = Record<string, string>;

export const dictionaries: Record<Locale, Dict> = {
  ar: {
    'nav.home': 'الرئيسية',
    'nav.products': 'المنتجات',
    'nav.about': 'من نحن',
    'nav.faq': 'الأسئلة الشائعة',
    'nav.contact': 'اتصل بنا',

    'hero.cta': 'تسوّق الآن',
    'hero.seeProducts': 'تصفّح المنتجات',

    'common.currency': 'دج',
    'common.orderNow': 'اطلب الآن',
    'common.freeDelivery': 'التوصيل مجاني',
    'common.seeAll': 'عرض الكل',
    'common.loading': 'جارٍ التحميل…',
    'common.back': 'رجوع',
    'common.cancel': 'إلغاء',
    'common.save': 'حفظ',
    'common.cod': 'الدفع عند الاستلام',

    'home.featured': 'منتجات مميزة',
    'home.all': 'كل المنتجات',
    'home.noProducts': 'لا توجد منتجات بعد',

    'product.outOfStock': 'نفدت الكمية',
    'product.stockLeft': 'باقي {n} قطع فقط',
    'product.quantity': 'الكمية',
    'product.description': 'الوصف',
    'product.details': 'التفاصيل',
    'product.reviews': 'آراء الزبائن',
    'product.share': 'شارك المنتج',
    'product.bundleNote': 'خصم {p}% عند شراء {n} قطعة أو أكثر',
    'product.oldPrice': 'السعر القديم',
    'product.youSave': 'توفّر {n}',

    'form.firstName': 'الاسم',
    'form.lastName': 'اللقب',
    'form.phone': 'رقم الهاتف',
    'form.phonePlaceholder': '05 / 06 / 07 …',
    'form.deliveryType': 'طريقة التوصيل',
    'form.office': 'استلام من المكتب (World Express)',
    'form.home': 'توصيل إلى المنزل',
    'form.wilaya': 'الولاية',
    'form.officeLabel': 'المكتب',
    'form.commune': 'البلدية',
    'form.address': 'العنوان الكامل',
    'form.addressPlaceholder': 'الحي، الشارع، رقم المنزل…',
    'form.selectWilaya': '— اختر الولاية —',
    'form.selectOffice': '— اختر المكتب —',
    'form.selectCommune': '— اختر البلدية —',
    'form.submit': 'تأكيد الطلب',
    'form.submitting': 'جارٍ الإرسال…',
    'form.required': 'هذا الحقل مطلوب',
    'form.phoneInvalid': 'أدخل رقم هاتف جزائري صحيح (10 أرقام يبدأ بـ 05/06/07)',
    'form.noOffice': 'لا يوجد مكتب في هذه الولاية حاليًا — التوصيل إلى المنزل فقط متاح.',
    'form.deliveryFree': 'التوصيل مشمول في السعر ✓',
    'form.total': 'المجموع',
    'form.successTitle': 'تم استلام طلبك بنجاح',
    'form.orderNumber': 'رقم الطلب',
    'form.weCall': 'سنتصل بك قريبًا لتأكيد الطلب. شكرًا لثقتك!',
    'form.track': 'تابع صفحة',
    'form.quantityOf': 'الكمية {n}',

    'welcome.title': 'خصم ترحيبي 🎁',
    'welcome.text': 'أدخل رقم هاتفك واحصل على خصم {n}% على أول طلب',
    'welcome.cta': 'احصل على الخصم',
    'welcome.later': 'لاحقًا',

    'footer.about': 'من نحن',
    'footer.privacy': 'سياسة الخصوصية',
    'footer.faq': 'الأسئلة الشائعة',
    'footer.rights': 'جميع الحقوق محفوظة',

    'about.title': 'من نحن',
    'privacy.title': 'سياسة الخصوصية',
    'faq.title': 'الأسئلة الشائعة',

    'catalog.title': 'المنتجات',
    'catalog.empty': 'لا توجد منتجات في هذا القسم.',
    'catalog.search': 'ابحث عن منتج…',

    'order.subtotal': 'سعر المنتج',
    'order.deliveryFee': 'تكلفة التوصيل',
    'order.freeDelivery': 'مجاني',
    'order.discount': 'الخصم',
    'order.total': 'المجموع الكلي',
  },

  en: {
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.about': 'About',
    'nav.faq': 'FAQ',
    'nav.contact': 'Contact',

    'hero.cta': 'Shop now',
    'hero.seeProducts': 'Browse products',

    'common.currency': 'DZD',
    'common.orderNow': 'Order now',
    'common.freeDelivery': 'Free delivery',
    'common.seeAll': 'See all',
    'common.loading': 'Loading…',
    'common.back': 'Back',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.cod': 'Cash on delivery',

    'home.featured': 'Featured products',
    'home.all': 'All products',
    'home.noProducts': 'No products yet',

    'product.outOfStock': 'Out of stock',
    'product.stockLeft': 'Only {n} left',
    'product.quantity': 'Quantity',
    'product.description': 'Description',
    'product.details': 'Details',
    'product.reviews': 'Customer reviews',
    'product.share': 'Share product',
    'product.bundleNote': '{p}% off when you buy {n} or more',
    'product.oldPrice': 'Old price',
    'product.youSave': 'You save {n}',

    'form.firstName': 'First name',
    'form.lastName': 'Last name',
    'form.phone': 'Phone number',
    'form.phonePlaceholder': '05 / 06 / 07 …',
    'form.deliveryType': 'Delivery method',
    'form.office': 'Pick up at office (World Express)',
    'form.home': 'Home delivery',
    'form.wilaya': 'Wilaya',
    'form.officeLabel': 'Office',
    'form.commune': 'Commune',
    'form.address': 'Full address',
    'form.addressPlaceholder': 'District, street, house number…',
    'form.selectWilaya': '— Select wilaya —',
    'form.selectOffice': '— Select office —',
    'form.selectCommune': '— Select commune —',
    'form.submit': 'Confirm order',
    'form.submitting': 'Submitting…',
    'form.required': 'This field is required',
    'form.phoneInvalid': 'Enter a valid Algerian phone number (10 digits starting with 05/06/07)',
    'form.noOffice': 'No office in this wilaya yet — home delivery only.',
    'form.deliveryFree': 'Delivery is included in the price ✓',
    'form.total': 'Total',
    'form.successTitle': 'Your order was received',
    'form.orderNumber': 'Order number',
    'form.weCall': 'We will call you soon to confirm your order. Thank you!',
    'form.track': 'Continue',
    'form.quantityOf': 'Quantity {n}',

    'welcome.title': 'Welcome gift 🎁',
    'welcome.text': 'Enter your phone number and get {n}% off your first order',
    'welcome.cta': 'Get my discount',
    'welcome.later': 'Later',

    'footer.about': 'About',
    'footer.privacy': 'Privacy policy',
    'footer.faq': 'FAQ',
    'footer.rights': 'All rights reserved',

    'about.title': 'About us',
    'privacy.title': 'Privacy policy',
    'faq.title': 'Frequently asked questions',

    'catalog.title': 'Products',
    'catalog.empty': 'No products in this category.',
    'catalog.search': 'Search for a product…',

    'order.subtotal': 'Subtotal',
    'order.deliveryFee': 'Delivery fee',
    'order.freeDelivery': 'Free',
    'order.discount': 'Discount',
    'order.total': 'Total',
  },

  fr: {
    'nav.home': 'Accueil',
    'nav.products': 'Produits',
    'nav.about': 'À propos',
    'nav.faq': 'FAQ',
    'nav.contact': 'Contact',

    'hero.cta': 'Acheter',
    'hero.seeProducts': 'Voir les produits',

    'common.currency': 'DA',
    'common.orderNow': 'Commander',
    'common.freeDelivery': 'Livraison gratuite',
    'common.seeAll': 'Tout voir',
    'common.loading': 'Chargement…',
    'common.back': 'Retour',
    'common.cancel': 'Annuler',
    'common.save': 'Enregistrer',
    'common.cod': 'Paiement à la livraison',

    'home.featured': 'Produits en vedette',
    'home.all': 'Tous les produits',
    'home.noProducts': 'Aucun produit pour le moment',

    'product.outOfStock': 'Rupture de stock',
    'product.stockLeft': 'Plus que {n} en stock',
    'product.quantity': 'Quantité',
    'product.description': 'Description',
    'product.details': 'Détails',
    'product.reviews': 'Avis clients',
    'product.share': 'Partager le produit',
    'product.bundleNote': '-{p}% dès {n} articles',
    'product.oldPrice': 'Ancien prix',
    'product.youSave': 'Économisez {n}',

    'form.firstName': 'Prénom',
    'form.lastName': 'Nom',
    'form.phone': 'Téléphone',
    'form.phonePlaceholder': '05 / 06 / 07 …',
    'form.deliveryType': 'Mode de livraison',
    'form.office': 'Retrait au bureau (World Express)',
    'form.home': 'Livraison à domicile',
    'form.wilaya': 'Wilaya',
    'form.officeLabel': 'Bureau',
    'form.commune': 'Commune',
    'form.address': 'Adresse complète',
    'form.addressPlaceholder': 'Quartier, rue, n°…',
    'form.selectWilaya': '— Choisir la wilaya —',
    'form.selectOffice': '— Choisir le bureau —',
    'form.selectCommune': '— Choisir la commune —',
    'form.submit': 'Confirmer la commande',
    'form.submitting': 'Envoi…',
    'form.required': 'Ce champ est obligatoire',
    'form.phoneInvalid': 'Entrez un numéro algérien valide (10 chiffres commençant par 05/06/07)',
    'form.noOffice': 'Aucun bureau dans cette wilaya — livraison à domicile uniquement.',
    'form.deliveryFree': 'Livraison incluse dans le prix ✓',
    'form.total': 'Total',
    'form.successTitle': 'Votre commande a été reçue',
    'form.orderNumber': 'N° de commande',
    'form.weCall': 'Nous vous appellerons bientôt pour confirmer. Merci !',
    'form.track': 'Continuer',
    'form.quantityOf': 'Quantité {n}',

    'welcome.title': 'Cadeau de bienvenue 🎁',
    'welcome.text': 'Entrez votre téléphone et obtenez {n}% sur votre 1ère commande',
    'welcome.cta': 'Obtenir ma remise',
    'welcome.later': 'Plus tard',

    'footer.about': 'À propos',
    'footer.privacy': 'Confidentialité',
    'footer.faq': 'FAQ',
    'footer.rights': 'Tous droits réservés',

    'about.title': 'À propos de nous',
    'privacy.title': 'Politique de confidentialité',
    'faq.title': 'Questions fréquentes',

    'catalog.title': 'Produits',
    'catalog.empty': 'Aucun produit dans cette catégorie.',
    'catalog.search': 'Rechercher un produit…',

    'order.subtotal': 'Sous-total',
    'order.deliveryFee': 'Frais de livraison',
    'order.freeDelivery': 'Gratuit',
    'order.discount': 'Remise',
    'order.total': 'Total',
  },
};

export function getDictionary(locale: Locale): Dict {
  return dictionaries[locale] ?? dictionaries.ar;
}

export function t(dict: Dict, key: string, vars?: Record<string, string | number>): string {
  let s = dict[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      s = s.split(`{${k}}`).join(String(v));
    }
  }
  return s;
}

export interface FaqItem {
  q: string;
  a: string;
}

export const faqs: Record<Locale, FaqItem[]> = {
  ar: [
    { q: 'كيف أطلب منتجًا؟', a: 'اختر المنتج، حدّد الكمية وطريقة التوصيل (مكتب أو منزل)، ثم املأ معلوماتك واضغط "تأكيد الطلب". سيتصل بك فريقنا لتأكيد الطلب.' },
    { q: 'ما هي طرق الدفع المتاحة؟', a: 'الدفع عند الاستلام فقط (Cash on Delivery). تدفع للموزّع عند وصول طلبك.' },
    { q: 'كم تستغرق مدة التوصيل؟', a: 'عادةً من 1 إلى 3 أيام عمل عبر World Express، حسب ولايتك.' },
    { q: 'هل التوصيل مجاني؟', a: 'نعم، سعر التوصيل مشمول في سعر المنتج المعروض.' },
    { q: 'هل يمكنني استبدال المنتج؟', a: 'يمكنك التواصل معنا خلال 24 ساعة من الاستلام للاستبدال إذا كان المنتج معيبًا أو غير مطابق للوصف.' },
  ],
  en: [
    { q: 'How do I order?', a: 'Pick a product, choose the quantity and delivery method (office or home), fill in your details and press "Confirm order". Our team will call you to confirm.' },
    { q: 'What payment methods are available?', a: 'Cash on delivery only. You pay the courier when your order arrives.' },
    { q: 'How long does delivery take?', a: 'Usually 1 to 3 business days via World Express, depending on your wilaya.' },
    { q: 'Is delivery free?', a: 'Yes, the delivery cost is included in the displayed product price.' },
    { q: 'Can I exchange a product?', a: 'Contact us within 24 hours of receiving it to exchange a defective or non-matching product.' },
  ],
  fr: [
    { q: 'Comment commander ?', a: 'Choisissez un produit, la quantité et le mode de livraison (bureau ou domicile), remplissez vos informations puis appuyez sur « Confirmer ». Notre équipe vous appellera pour confirmer.' },
    { q: 'Quels modes de paiement ?', a: 'Paiement à la livraison uniquement. Vous payez le livreur à la réception.' },
    { q: 'Quel est le délai de livraison ?', a: 'Généralement 1 à 3 jours ouvrés via World Express, selon votre wilaya.' },
    { q: 'La livraison est-elle gratuite ?', a: 'Oui, les frais de livraison sont inclus dans le prix affiché.' },
    { q: 'Puis-je échanger un produit ?', a: 'Contactez-nous sous 24h après réception pour échanger un produit défectueux ou non conforme.' },
  ],
};
