-- AutoRevisit Phase 10 safety columns.
-- Run this in Supabase SQL editor.

alter table customer_pages
add column if not exists page_type text default 'revisit',
add column if not exists who_for text,
add column if not exists push_angle text,
add column if not exists design_style text,
add column if not exists finance_monthly text,
add column if not exists finance_deposit text,
add column if not exists finance_term text,
add column if not exists finance_apr text,
add column if not exists dealer_notes text,
add column if not exists whatsapp_message text,
add column if not exists watermark_forced boolean default false,
add column if not exists deleted_at timestamptz;

create table if not exists thank_you_pages (
  id uuid primary key default gen_random_uuid(),
  dealership_id uuid not null,
  customer_id uuid,
  vehicle_id uuid,
  slug text not null,
  title text,
  message text,
  handover_image_url text,
  review_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists customer_pages_page_type_idx on customer_pages(page_type);
create index if not exists customer_pages_deleted_at_idx on customer_pages(deleted_at);
create index if not exists thank_you_pages_slug_idx on thank_you_pages(slug);
