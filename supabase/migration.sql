-- ============================================================
-- Campa Fertichem — Supabase Migration
-- Run this in the Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ============================================================
-- TABLES
-- ============================================================

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_path text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references categories(id) on delete restrict,
  name text not null,
  slug text not null unique,
  short_description text,
  description text,
  image_path text,
  gallery text[],
  specifications jsonb,
  usage_information text,
  seo_title text,
  seo_description text,
  is_featured boolean not null default false,
  is_published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text,
  featured_image_path text,
  category text,
  seo_title text,
  seo_description text,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  company text,
  product_id uuid references products(id) on delete set null,
  message text not null,
  status text not null default 'new' check (status in ('new', 'in_progress', 'resolved')),
  internal_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists site_settings (
  id uuid primary key default gen_random_uuid(),
  setting_key text not null unique,
  setting_value text,
  updated_at timestamptz not null default now()
);

-- ============================================================
-- INDEXES
-- ============================================================

create index if not exists idx_products_category_id on products(category_id);
create index if not exists idx_products_is_published on products(is_published);
create index if not exists idx_products_is_featured on products(is_featured);
create index if not exists idx_products_slug on products(slug);
create index if not exists idx_blog_posts_slug on blog_posts(slug);
create index if not exists idx_blog_posts_is_published on blog_posts(is_published);
create index if not exists idx_enquiries_status on enquiries(status);
create index if not exists idx_enquiries_created_at on enquiries(created_at desc);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_categories_updated_at before update on categories
  for each row execute function set_updated_at();

create trigger trg_products_updated_at before update on products
  for each row execute function set_updated_at();

create trigger trg_blog_posts_updated_at before update on blog_posts
  for each row execute function set_updated_at();

create trigger trg_enquiries_updated_at before update on enquiries
  for each row execute function set_updated_at();

create trigger trg_site_settings_updated_at before update on site_settings
  for each row execute function set_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table categories enable row level security;
alter table products enable row level security;
alter table blog_posts enable row level security;
alter table enquiries enable row level security;
alter table site_settings enable row level security;

-- Helper: check if the current user is an authenticated admin
-- Admin = any authenticated Supabase Auth user (provisioned via SQL only — see README)
create or replace function is_admin()
returns boolean language sql security definer as $$
  select auth.role() = 'authenticated';
$$;

-- CATEGORIES
create policy "Public can read active categories"
  on categories for select
  using (is_active = true);

create policy "Admins can manage categories"
  on categories for all
  using (is_admin())
  with check (is_admin());

-- PRODUCTS
create policy "Public can read published products"
  on products for select
  using (is_published = true);

create policy "Admins can manage products"
  on products for all
  using (is_admin())
  with check (is_admin());

-- BLOG POSTS
create policy "Public can read published posts"
  on blog_posts for select
  using (is_published = true);

create policy "Admins can manage blog posts"
  on blog_posts for all
  using (is_admin())
  with check (is_admin());

-- ENQUIRIES
-- Public can insert only (submit form); cannot read or modify
create policy "Public can submit enquiries"
  on enquiries for insert
  with check (true);

create policy "Admins can manage enquiries"
  on enquiries for all
  using (is_admin())
  with check (is_admin());

-- SITE SETTINGS
-- Public can read non-sensitive settings
create policy "Public can read site settings"
  on site_settings for select
  using (true);

create policy "Admins can manage site settings"
  on site_settings for all
  using (is_admin())
  with check (is_admin());

-- ============================================================
-- STORAGE BUCKET
-- ============================================================

-- Run in Supabase Dashboard > Storage, or via API:
-- Create a public bucket named "images"
-- The following is informational — execute via Dashboard if needed.
--
-- insert into storage.buckets (id, name, public)
-- values ('images', 'images', true)
-- on conflict do nothing;
--
-- Storage RLS: allow public read, admin write
-- create policy "Public read images" on storage.objects for select using (bucket_id = 'images');
-- create policy "Admin upload images" on storage.objects for insert using (bucket_id = 'images' and is_admin());
-- create policy "Admin delete images" on storage.objects for delete using (bucket_id = 'images' and is_admin());

-- ============================================================
-- SEED DATA — Placeholder categories (update names as needed)
-- ============================================================

insert into categories (name, slug, description, sort_order, is_active) values
  ('Nitrogen Fertilizers', 'nitrogen-fertilizers', 'Fertilizers providing essential nitrogen nutrition for crop growth.', 1, true),
  ('Phosphatic Fertilizers', 'phosphatic-fertilizers', 'Phosphorus-based fertilizers supporting root development and flowering.', 2, true),
  ('Potassic Fertilizers', 'potassic-fertilizers', 'Potassium fertilizers improving crop quality and stress resistance.', 3, true),
  ('Micronutrients', 'micronutrients', 'Essential trace element fertilizers for balanced crop nutrition.', 4, true),
  ('Specialty Fertilizers', 'specialty-fertilizers', 'Customized fertilizer blends for specific crop and soil requirements.', 5, true)
on conflict (slug) do nothing;

-- ============================================================
-- SEED DATA — Default site settings
-- ============================================================

insert into site_settings (setting_key, setting_value) values
  ('company_name', 'Campa Fertichem'),
  ('contact_address', 'Taloja, Navi Mumbai, Maharashtra, India'),
  ('contact_phone', '+91 XXXXX XXXXX'),
  ('contact_email', 'info@campafertichem.com'),
  ('business_hours', 'Mon–Sat: 9:00 AM – 6:00 PM'),
  ('hero_heading', 'Nourishing Growth. Enabling Tomorrow.'),
  ('hero_subtext', 'Quality Fertilizer Solutions for Better Crop Nutrition.'),
  ('footer_tagline', 'Quality fertilizer solutions for better crop nutrition.')
on conflict (setting_key) do nothing;

-- ============================================================
-- ADMIN PROVISIONING
-- See README for instructions on creating the first admin user
-- via Supabase Dashboard > Authentication > Users
-- ============================================================
