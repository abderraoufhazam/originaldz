import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { getSettings } from '@/lib/settings';
import { normalizePhone, isValidAlgerianPhone } from '@/lib/format';
import { getWilaya } from '@/lib/geo';
import { sendTelegram } from '@/lib/telegram';
import { deliveryFee as getDeliveryFee } from '@/lib/prices';

export const dynamic = 'force-dynamic';

interface Body {
  product_id?: string;
  quantity?: number;
  first_name?: string;
  last_name?: string;
  phone?: string;
  delivery_type?: 'office' | 'home';
  wilaya_code?: number;
  office_id?: string | null;
  commune?: string;
  address?: string;
  source?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  coupon?: string;
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid request' }, { status: 400 });
  }

  const firstName = (body.first_name ?? '').trim();
  const lastName = (body.last_name ?? '').trim();
  const phoneRaw = (body.phone ?? '').trim();
  const quantity = Number(body.quantity);
  const deliveryType = body.delivery_type === 'office' ? 'office' : 'home';
  const wilayaCode = Number(body.wilaya_code);

  if (!firstName || !lastName) {
    return NextResponse.json({ error: 'name required' }, { status: 400 });
  }
  if (!isValidAlgerianPhone(phoneRaw)) {
    return NextResponse.json({ error: 'invalid phone' }, { status: 400 });
  }
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
    return NextResponse.json({ error: 'invalid quantity' }, { status: 400 });
  }
  if (!Number.isInteger(wilayaCode) || wilayaCode < 1 || wilayaCode > 58) {
    return NextResponse.json({ error: 'wilaya required' }, { status: 400 });
  }
  if (deliveryType === 'office' && !body.office_id) {
    return NextResponse.json({ error: 'office required' }, { status: 400 });
  }
  if (deliveryType === 'home' && (!body.commune || !body.address)) {
    return NextResponse.json({ error: 'address required' }, { status: 400 });
  }

  const phone = normalizePhone(phoneRaw);
  const sb = getSupabase();

  // Blacklist (feature 7)
  const { data: blocked } = await sb.from('blacklist').select('phone').eq('phone', phone).maybeSingle();
  if (blocked) {
    return NextResponse.json({ error: 'order rejected' }, { status: 403 });
  }

  // Duplicate protection (feature 8): same phone within 5 minutes.
  const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
  const { count: recentCount } = await sb
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('phone', phone)
    .gte('created_at', fiveMinAgo);
  if ((recentCount ?? 0) > 0) {
    return NextResponse.json({ error: 'duplicate' }, { status: 429 });
  }

  // Product
  const { data: product } = await sb.from('products').select('*').eq('id', body.product_id).single();
  if (!product || !product.active || product.stock <= 0) {
    return NextResponse.json({ error: 'product unavailable' }, { status: 400 });
  }

  // Phone history → risk + customer discount (features 8, 20)
  const { count: priorOrders } = await sb
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('phone', phone);
  const { count: priorCancelled } = await sb
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('phone', phone)
    .eq('status', 'cancelled');

  const isReturning = (priorOrders ?? 0) > 0;
  let risk: 'none' | 'warning' | 'flagged' = 'none';
  if ((priorCancelled ?? 0) > 0) risk = 'warning';
  if ((priorOrders ?? 0) >= 5) risk = 'flagged';

  const settings = await getSettings();
  const bundlePercent = product.bundle_min > 0 && quantity >= product.bundle_min ? product.bundle_discount : 0;
  const customerPercent = isReturning ? settings.loyalty_discount : settings.welcome_discount;

  // Coupon (feature 5)
  let couponPercent = 0;
  const couponCode = (body.coupon ?? '').trim().toUpperCase();
  if (couponCode) {
    const { data: coupon } = await sb
      .from('coupons')
      .select('discount_percent')
      .eq('code', couponCode)
      .eq('active', true)
      .maybeSingle();
    if (coupon) couponPercent = Number(coupon.discount_percent);
  }

  const discountPercent = Math.min(50, bundlePercent + customerPercent + couponPercent);

  const unitPrice = product.price;
  const subtotal = unitPrice * quantity;

  // Delivery fee (World Express) per wilaya + delivery type (static dataset).
  const deliveryFee = getDeliveryFee(wilayaCode, deliveryType);
  const total = Math.max(0, Math.round(subtotal * (1 - discountPercent / 100))) + deliveryFee;

  // Resolve names
  const wilaya = getWilaya(wilayaCode);
  const wilayaName = wilaya ? (wilaya.nameAr || wilaya.name) : String(wilayaCode);

  let officeName = '';
  if (deliveryType === 'office' && body.office_id) {
    const { data: office } = await sb.from('offices').select('name_ar,name_fr').eq('id', body.office_id).maybeSingle();
    officeName = office ? `${office.name_ar} / ${office.name_fr}` : '';
  }

  // Order number
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const { count: todayCount } = await sb
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', `${today.slice(0, 4)}-${today.slice(4, 6)}-${today.slice(6, 8)}`);
  const orderNumber = `ODZ-${today}-${String((todayCount ?? 0) + 1).padStart(4, '0')}`;

  const orderRow = {
    order_number: orderNumber,
    product_id: product.id,
    product_title: product.title_ar || product.title_en || product.title_fr,
    unit_price: unitPrice,
    quantity,
    discount_percent: discountPercent,
    total,
    first_name: firstName,
    last_name: lastName,
    phone,
    delivery_type: deliveryType,
    wilaya_code: wilayaCode,
    wilaya_name: wilayaName,
    office_id: deliveryType === 'office' ? body.office_id : null,
    office_name: officeName,
    commune: body.commune ?? '',
    address: body.address ?? '',
    status: 'new',
    risk,
    source: body.source ?? '',
    utm_source: body.utm_source ?? '',
    utm_medium: body.utm_medium ?? '',
    utm_campaign: body.utm_campaign ?? '',
    utm_content: body.utm_content ?? '',
  };

  const { data: inserted, error } = await sb.from('orders').insert(orderRow).select('id').single();
  if (error || !inserted) {
    return NextResponse.json({ error: 'could not save order' }, { status: 500 });
  }
  const orderId = (inserted as { id: string }).id;

  // Telegram notification (feature 9) — full order details
  const riskLabel = risk === 'flagged' ? '🔴 عميل مشبوه' : risk === 'warning' ? '🟡 تنبيه' : '';
  const deliveryInfo =
    deliveryType === 'office'
      ? `${officeName}`
      : `${body.commune ?? ''}${body.address ? ' — ' + body.address : ''}`;
  const sourceInfo = [body.utm_source, body.utm_campaign].filter(Boolean).join(' / ');

  await sendTelegram(
    `🛒 <b>طلب جديد</b> — #${orderNumber}\n` +
      `📅 ${new Date().toLocaleString('ar-DZ', { dateStyle: 'short', timeStyle: 'short' })}\n\n` +
      `<b>👤 الزبون</b>\n` +
      `${firstName} ${lastName}\n` +
      `📞 ${phone}\n\n` +
      `<b>📦 المنتج</b>\n` +
      `${orderRow.product_title}\n` +
      `الكمية: ${quantity}\n` +
      `سعر الوحدة: ${unitPrice} دج\n` +
      (discountPercent ? `الخصم: −${discountPercent}%\n` : '') +
      `تكلفة التوصيل: ${deliveryFee} دج\n` +
      `<b>المجموع: ${total} دج</b>\n\n` +
      `<b>📍 التوصيل</b>\n` +
      `الولاية: ${wilayaName}\n` +
      `${deliveryType === 'office' ? '🏢 استلام من المكتب' : '🏠 توصيل إلى المنزل'}\n` +
      `${deliveryInfo}` +
      (riskLabel ? `\n\n${riskLabel}` : '') +
      (sourceInfo ? `\n📣 المصدر: ${sourceInfo}` : ''),
    [
      [
        { text: '✅ تأكيد', callback_data: `status:${orderId}:confirmed` },
        { text: '🚚 شحن', callback_data: `status:${orderId}:shipped` },
      ],
      [
        { text: '📦 تسليم', callback_data: `status:${orderId}:delivered` },
        { text: '❌ إلغاء', callback_data: `status:${orderId}:cancelled` },
      ],
    ],
  );

  return NextResponse.json({ order_number: orderNumber, total });
}
