'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { randomUUID } from 'crypto';
import { getSupabase } from '@/lib/supabase';
import { saveSettings as persistSettings } from '@/lib/settings';
import { requireAdmin } from '@/lib/admin';
import type { Settings } from '@/lib/types';

function num(v: string | null | undefined, fallback = 0): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

async function uploadImages(files: File[]): Promise<string[]> {
  const urls: string[] = [];
  for (const file of files) {
    if (!file || file.size === 0) continue;
    const ext = file.name.split('.').pop() || 'jpg';
    const path = `${randomUUID()}.${ext}`;
    const bytes = Buffer.from(await file.arrayBuffer());
    const { error } = await getSupabase().storage.from('products').upload(path, bytes, {
      contentType: file.type || 'image/jpeg',
      upsert: false,
    });
    if (!error) {
      const { data } = getSupabase().storage.from('products').getPublicUrl(path);
      urls.push(data.publicUrl);
    }
  }
  return urls;
}

export async function saveProduct(formData: FormData) {
  requireAdmin();
  const id = (formData.get('id') as string) || null;
  const slug = ((formData.get('slug') as string) || '').trim().toLowerCase().replace(/\s+/g, '-');

  const uploadedFiles = (formData.getAll('images') as File[]).filter((f) => f && f.size > 0);
  const uploaded = await uploadImages(uploadedFiles);
  const manualUrls = ((formData.get('manual_urls') as string) || '')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
  const existing = ((formData.get('existing') as string) || '')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
  const images = [...existing, ...manualUrls, ...uploaded];

  const row = {
    slug,
    title_ar: (formData.get('title_ar') as string) || '',
    title_en: (formData.get('title_en') as string) || '',
    title_fr: (formData.get('title_fr') as string) || '',
    description_ar: (formData.get('description_ar') as string) || '',
    description_en: (formData.get('description_en') as string) || '',
    description_fr: (formData.get('description_fr') as string) || '',
    price: num(formData.get('price') as string),
    compare_at_price: num(formData.get('compare_at_price') as string, 0) || null,
    images,
    stock: num(formData.get('stock') as string),
    active: formData.get('active') === 'on',
    featured: formData.get('featured') === 'on',
    category: (formData.get('category') as string) || null,
    weight_grams: num(formData.get('weight_grams') as string, 500),
    bundle_min: num(formData.get('bundle_min') as string),
    bundle_discount: num(formData.get('bundle_discount') as string),
    updated_at: new Date().toISOString(),
  };

  if (!slug) return;

  if (id) {
    await getSupabase().from('products').update(row).eq('id', id);
  } else {
    await getSupabase().from('products').insert(row);
  }

  revalidatePath('/', 'layout');
  redirect('/admin/products');
}

export async function deleteProduct(id: string) {
  requireAdmin();
  await getSupabase().from('products').delete().eq('id', id);
  revalidatePath('/', 'layout');
  redirect('/admin/products');
}

export async function updateOrder(formData: FormData) {
  requireAdmin();
  const id = formData.get('id') as string;
  await getSupabase()
    .from('orders')
    .update({
      status: formData.get('status') as string,
      tracking_number: (formData.get('tracking_number') as string) || '',
      notes: (formData.get('notes') as string) || '',
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);
  revalidatePath('/', 'layout');
}

export async function addBlacklist(formData: FormData) {
  requireAdmin();
  const phone = (formData.get('phone') as string).replace(/\D/g, '');
  if (phone) {
    await getSupabase()
      .from('blacklist')
      .upsert({ phone, reason: (formData.get('reason') as string) || '' });
  }
  revalidatePath('/', 'layout');
}

export async function removeBlacklist(phone: string) {
  requireAdmin();
  await getSupabase().from('blacklist').delete().eq('phone', phone);
  revalidatePath('/', 'layout');
}

export async function addOffice(formData: FormData) {
  requireAdmin();
  await getSupabase().from('offices').insert({
    wilaya_code: num(formData.get('wilaya_code') as string),
    name_ar: (formData.get('name_ar') as string) || '',
    name_fr: (formData.get('name_fr') as string) || '',
    address: (formData.get('address') as string) || '',
    phone: (formData.get('phone') as string) || '',
    active: formData.get('active') === 'on',
  });
  revalidatePath('/', 'layout');
}

export async function removeOffice(id: string) {
  requireAdmin();
  await getSupabase().from('offices').delete().eq('id', id);
  revalidatePath('/', 'layout');
}

export async function addTestimonial(formData: FormData) {
  requireAdmin();
  await getSupabase().from('testimonials').insert({
    customer_name: (formData.get('customer_name') as string) || '',
    text_ar: (formData.get('text_ar') as string) || '',
    text_en: (formData.get('text_en') as string) || '',
    text_fr: (formData.get('text_fr') as string) || '',
    rating: num(formData.get('rating') as string, 5),
    active: formData.get('active') === 'on',
  });
  revalidatePath('/', 'layout');
}

export async function removeTestimonial(id: string) {
  requireAdmin();
  await getSupabase().from('testimonials').delete().eq('id', id);
  revalidatePath('/', 'layout');
}

export async function saveSettings(formData: FormData) {
  requireAdmin();
  const patch: Partial<Settings> = {
    store_name: (formData.get('store_name') as string) || 'originaldz',
    tagline_ar: (formData.get('tagline_ar') as string) || '',
    tagline_en: (formData.get('tagline_en') as string) || '',
    tagline_fr: (formData.get('tagline_fr') as string) || '',
    whatsapp: (formData.get('whatsapp') as string) || '',
    phone: (formData.get('phone') as string) || '',
    fb_pixel: (formData.get('fb_pixel') as string) || '',
    tiktok_pixel: (formData.get('tiktok_pixel') as string) || '',
    welcome_discount: num(formData.get('welcome_discount') as string, 10),
    loyalty_discount: num(formData.get('loyalty_discount') as string, 5),
    maintenance_mode: formData.get('maintenance_mode') === 'on',
  };
  await persistSettings(patch);
  revalidatePath('/', 'layout');
}

export async function addCoupon(formData: FormData) {
  requireAdmin();
  const code = ((formData.get('code') as string) || '').trim().toUpperCase();
  const discount = Number(formData.get('discount_percent'));
  if (code && discount > 0 && discount <= 100) {
    await getSupabase()
      .from('coupons')
      .upsert({ code, discount_percent: discount, active: formData.get('active') === 'on' }, { onConflict: 'code' });
  }
  revalidatePath('/', 'layout');
}

export async function removeCoupon(id: string) {
  requireAdmin();
  await getSupabase().from('coupons').delete().eq('id', id);
  revalidatePath('/', 'layout');
}

export async function approveTestimonial(id: string) {
  requireAdmin();
  await getSupabase().from('testimonials').update({ active: true }).eq('id', id);
  revalidatePath('/', 'layout');
}

export async function submitReview(formData: FormData) {
  const productId = formData.get('product_id') as string;
  const name = ((formData.get('customer_name') as string) || '').trim();
  if (!productId || !name) return;
  await getSupabase().from('testimonials').insert({
    product_id: productId,
    customer_name: name,
    text_ar: (formData.get('text_ar') as string) || '',
    text_en: (formData.get('text_en') as string) || '',
    text_fr: (formData.get('text_fr') as string) || '',
    rating: Number(formData.get('rating')) || 5,
    active: false,
  });
  revalidatePath('/', 'layout');
}
