alter table profiles
add column if not exists role text default 'dealer',
add column if not exists test_plan text;

alter table dealerships
add column if not exists approval_status text default 'approved',
add column if not exists admin_notes text,
add column if not exists approved_at timestamptz,
add column if not exists approved_by uuid,
add column if not exists plan_name text default 'starter',
add column if not exists subscription_status text default 'active',
add column if not exists logo_url text,
add column if not exists primary_color text,
add column if not exists whatsapp text,
add column if not exists email text,
add column if not exists remove_branding boolean default false,
add column if not exists updated_at timestamptz default now();

alter table customer_pages
add column if not exists deleted_at timestamptz,
add column if not exists updated_at timestamptz default now(),
add column if not exists page_style text default 'simple',
add column if not exists customer_goal text default 'simple',
add column if not exists push_angle text default 'reassurance',
add column if not exists buying_for text default 'themselves',
add column if not exists watermark_forced boolean default true;

alter table vehicles
add column if not exists deleted_at timestamptz,
add column if not exists updated_at timestamptz default now();

create table if not exists page_events (
  id uuid primary key default gen_random_uuid(),
  customer_page_id uuid,
  event_type text not null,
  metadata jsonb default '{}',
  visitor_id text,
  created_at timestamptz default now()
);

create index if not exists page_events_customer_page_id_idx on page_events(customer_page_id);
create index if not exists page_events_event_type_idx on page_events(event_type);
create index if not exists page_events_created_at_idx on page_events(created_at);
