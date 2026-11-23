export type Locale = 'ar' | 'en' | 'fr';

export const LOCALES: Locale[] = ['ar', 'en', 'fr'];
export const DEFAULT_LOCALE: Locale = 'ar';

export const LOCALE_DIRS: Record<Locale, 'rtl' | 'ltr'> = {
  ar: 'rtl',
  en: 'ltr',
  fr: 'ltr',
};

export interface Wilaya {
  code: number;
  name: string;
  nameAr: string;
}

export interface Commune {
  wilayaCode: number;
  name: string;
  nameAr: string;
}

export interface Product {
  id: string;
  slug: string;
  title_ar: string;
  title_en: string;
  title_fr: string;
  description_ar: string;
  description_en: string;
  description_fr: string;
  price: number;
  compare_at_price: number | null;
  images: string[];
  video_url: string;
  stock: number;
  active: boolean;
  featured: boolean;
  category: string | null;
  weight_grams: number;
  cost: number;
  bundle_min: number;
  bundle_discount: number;
  created_at: string;
  updated_at: string;
}

export type OrderStatus =
  | 'new'
  | 'confirmed'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface DeliveryPrice {
  wilaya_code: number;
  office_price: number | null;
  home_price: number | null;
  desks: number;
}

export interface Order {
  id: string;
  order_number: string;
  product_id: string | null;
  product_title: string;
  unit_price: number;
  quantity: number;
  discount_percent: number;
  delivery_fee: number;
  total: number;
  first_name: string;
  last_name: string;
  phone: string;
  delivery_type: 'office' | 'home';
  wilaya_code: number;
  wilaya_name: string;
  office_id: string | null;
  office_name: string;
  commune: string;
  address: string;
  status: OrderStatus;
  tracking_number: string;
  risk: 'none' | 'warning' | 'flagged';
  source: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  notes: string;
  created_at: string;
}

export interface Office {
  id: string;
  wilaya_code: number;
  name_ar: string;
  name_fr: string;
  address: string;
  phone: string;
  active: boolean;
}

export interface Testimonial {
  id: string;
  product_id: string | null;
  customer_name: string;
  text_ar: string;
  text_en: string;
  text_fr: string;
  rating: number;
  active: boolean;
  created_at: string;
}

export interface Settings {
  store_name: string;
  tagline_ar: string;
  tagline_en: string;
  tagline_fr: string;
  whatsapp: string;
  phone: string;
  fb_pixel: string;
  tiktok_pixel: string;
  welcome_discount: number;
  loyalty_discount: number;
  delivery_fee_mode: 'free' | 'per_wilaya';
  maintenance_mode: boolean;
  ga_id: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount_percent: number;
  active: boolean;
  created_at: string;
}
