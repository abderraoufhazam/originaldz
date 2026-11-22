-- originaldz — Supabase schema
-- Run this in Supabase Dashboard → SQL Editor (or `supabase db push`).

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Products
-- ---------------------------------------------------------------------------
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title_ar text not null default '',
  title_en text not null default '',
  title_fr text not null default '',
  description_ar text not null default '',
  description_en text not null default '',
  description_fr text not null default '',
  price integer not null default 0,           -- DZD, single "all-in" price
  compare_at_price integer,                   -- optional old price for discount display
  images jsonb not null default '[]',         -- array of public URLs
  stock integer not null default 0,
  active boolean not null default true,
  featured boolean not null default false,
  category text,
  weight_grams integer not null default 500,
  bundle_min integer not null default 0,      -- feature 16: min qty for bundle discount (0 = off)
  bundle_discount integer not null default 0, -- percent off each unit when qty >= bundle_min
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Orders (COD)
-- ---------------------------------------------------------------------------
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null,                 -- human-readable, e.g. ORD-20261121-0001
  product_id uuid references products(id) on delete set null,
  product_title text not null default '',
  unit_price integer not null default 0,
  quantity integer not null default 1,
  discount_percent integer not null default 0,
  delivery_fee integer not null default 0,
  total integer not null default 0,
  first_name text not null,
  last_name text not null,
  phone text not null,
  delivery_type text not null,                -- 'office' | 'home'
  wilaya_code integer not null,
  wilaya_name text not null default '',
  office_id uuid,
  office_name text not null default '',
  commune text not null default '',
  address text not null default '',
  status text not null default 'new',         -- new | confirmed | shipped | delivered | cancelled
  tracking_number text not null default '',
  risk text not null default 'none',          -- none | warning | flagged
  source text not null default '',
  utm_source text not null default '',
  utm_medium text not null default '',
  utm_campaign text not null default '',
  utm_content text not null default '',
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists orders_created_at_idx on orders (created_at desc);
create index if not exists orders_phone_idx on orders (phone);
create index if not exists orders_status_idx on orders (status);

-- ---------------------------------------------------------------------------
-- World Express offices (editable; seeded from data/offices.json)
-- ---------------------------------------------------------------------------
create table if not exists offices (
  id uuid primary key default gen_random_uuid(),
  wilaya_code integer not null,
  name_ar text not null default '',
  name_fr text not null default '',
  address text not null default '',
  phone text not null default '',
  active boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists offices_wilaya_idx on offices (wilaya_code);

-- ---------------------------------------------------------------------------
-- Testimonials / reviews (feature 3)
-- ---------------------------------------------------------------------------
create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  customer_name text not null default '',
  text_ar text not null default '',
  text_en text not null default '',
  text_fr text not null default '',
  rating integer not null default 5,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists testimonials_product_idx on testimonials (product_id);

-- ---------------------------------------------------------------------------
-- Blacklist / phone limits (feature 7)
-- ---------------------------------------------------------------------------
create table if not exists blacklist (
  phone text primary key,
  reason text not null default '',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Settings (key/value, single row of jsonb each)
-- ---------------------------------------------------------------------------
create table if not exists settings (
  key text primary key,
  value jsonb not null
);

-- ---------------------------------------------------------------------------
-- World Express delivery prices (desk / home per wilaya)
-- ---------------------------------------------------------------------------
create table if not exists delivery_prices (
  wilaya_code integer primary key,
  office_price integer,
  home_price integer,
  desks integer not null default 0
);

-- Column added in a later release for existing deployments.
alter table orders add column if not exists delivery_fee integer not null default 0;

-- ---------------------------------------------------------------------------
-- Realtime is not required for this app; the server uses the service role key.
-- ---------------------------------------------------------------------------

-- Seed default settings (merge-safe: on conflict do nothing).
insert into settings (key, value) values
  ('store_name', '"originaldz"'::jsonb),
  ('tagline_ar', '"تسوّق بثقة — الدفع عند الاستلام"'::jsonb),
  ('tagline_en', '"Shop with confidence — cash on delivery"'::jsonb),
  ('tagline_fr', '"Achetez en toute confiance — paiement à la livraison"'::jsonb),
  ('whatsapp', '""'::jsonb),
  ('phone', '""'::jsonb),
  ('fb_pixel', '""'::jsonb),
  ('tiktok_pixel', '""'::jsonb),
  ('welcome_discount', '10'::jsonb),
  ('loyalty_discount', '5'::jsonb),
  ('delivery_fee_mode', '"per_wilaya"'::jsonb),
  ('maintenance_mode', 'false'::jsonb)
on conflict (key) do nothing;

-- ---------------------------------------------------------------------------
-- Coupons (feature 5)
-- ---------------------------------------------------------------------------
create table if not exists coupons (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  discount_percent integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Grants for the API roles (tables created by hand need explicit grants).
-- ---------------------------------------------------------------------------
grant all on all tables in schema public to anon, authenticated, service_role;
grant all on all sequences in schema public to anon, authenticated, service_role;
alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
