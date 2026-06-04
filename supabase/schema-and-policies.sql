create extension if not exists "pgcrypto";

create table if not exists dealerships (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name text not null,
  slug text unique not null,
  logo_url text,
  primary_color text default '#FFC400',
  phone text,
  email text,
  website text,
  subscription_status text default 'pending',
  setup_status text default 'pending',
  stock_import_status text default 'not_started',
  plan_name text default 'starter'
);

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  dealership_id uuid references dealerships(id) on delete cascade,
  name text,
  email text,
  role text default 'staff'
);

create table if not exists vehicles (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  dealership_id uuid references dealerships(id) on delete cascade,
  make text,
  model text,
  year text,
  reg text,
  price text,
  monthly_price text,
  mileage text,
  fuel_type text,
  transmission text,
  description text,
  image_urls text[] default '{}',
  tags text[] default '{}',
  status text default 'available'
);

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  dealership_id uuid references dealerships(id) on delete cascade,
  first_name text not null,
  phone text,
  email text,
  customer_type text,
  notes text
);

create table if not exists customer_pages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  dealership_id uuid references dealerships(id) on delete cascade,
  customer_id uuid references customers(id) on delete cascade,
  slug text unique not null,
  title text,
  intro_message text,
  status text default 'active'
);

create table if not exists customer_page_vehicles (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  customer_page_id uuid references customer_pages(id) on delete cascade,
  vehicle_id uuid references vehicles(id) on delete cascade,
  display_order int default 0,
  personalised_reason text
);

create table if not exists page_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  customer_page_id uuid references customer_pages(id) on delete cascade,
  event_type text not null,
  metadata jsonb default '{}'
);

create table if not exists dealership_branding (
  dealership_id uuid primary key references dealerships(id) on delete cascade,
  created_at timestamptz default now(),
  background_style text default 'premium-dark',
  accent_color text default '#FFC400',
  font_style text default 'modern',
  button_style text default 'rounded',
  intro_style text default 'friendly'
);

create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  dealership_id uuid references dealerships(id) on delete cascade,
  status text default 'pending',
  plan_name text default 'starter',
  monthly_price text,
  payment_method text,
  started_at timestamptz,
  ends_at timestamptz
);

create table if not exists stock_import_sources (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  dealership_id uuid references dealerships(id) on delete cascade,
  source_type text default 'website',
  source_url text,
  status text default 'pending',
  last_imported_at timestamptz,
  notes text
);

create table if not exists ai_generations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  dealership_id uuid references dealerships(id) on delete cascade,
  customer_page_id uuid references customer_pages(id) on delete set null,
  prompt_type text,
  input jsonb default '{}',
  output jsonb default '{}'
);

alter table dealerships enable row level security;
alter table profiles enable row level security;
alter table vehicles enable row level security;
alter table customers enable row level security;
alter table customer_pages enable row level security;
alter table customer_page_vehicles enable row level security;
alter table page_events enable row level security;
alter table dealership_branding enable row level security;
alter table subscriptions enable row level security;
alter table stock_import_sources enable row level security;
alter table ai_generations enable row level security;

drop policy if exists "public can read dealerships" on dealerships;
drop policy if exists "auth can create dealership" on dealerships;
drop policy if exists "users can read own profile" on profiles;
drop policy if exists "users can create own profile" on profiles;
drop policy if exists "users can update own profile" on profiles;
drop policy if exists "admins can manage dealerships" on dealerships;
drop policy if exists "dealer users can manage vehicles" on vehicles;
drop policy if exists "dealer users can manage customers" on customers;
drop policy if exists "dealer users can manage pages" on customer_pages;
drop policy if exists "public can read active pages" on customer_pages;
drop policy if exists "dealer users can manage page vehicles" on customer_page_vehicles;
drop policy if exists "public can read page vehicles" on customer_page_vehicles;
drop policy if exists "public can read vehicles for public pages" on vehicles;
drop policy if exists "public can insert page events" on page_events;
drop policy if exists "dealer users can read page events" on page_events;
drop policy if exists "dealer users can manage branding" on dealership_branding;
drop policy if exists "public can read branding" on dealership_branding;
drop policy if exists "dealer users can read subscriptions" on subscriptions;
drop policy if exists "dealer users can manage stock import sources" on stock_import_sources;
drop policy if exists "dealer users can read ai generations" on ai_generations;

create policy "public can read dealerships"
on dealerships for select
using (true);

create policy "auth can create dealership"
on dealerships for insert
with check (auth.uid() is not null);

create policy "admins can manage dealerships"
on dealerships for all
using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'))
with check (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

create policy "users can read own profile"
on profiles for select
using (id = auth.uid());

create policy "users can create own profile"
on profiles for insert
with check (id = auth.uid());

create policy "users can update own profile"
on profiles for update
using (id = auth.uid());

create policy "dealer users can manage vehicles"
on vehicles for all
using (dealership_id in (select dealership_id from profiles where id = auth.uid()))
with check (dealership_id in (select dealership_id from profiles where id = auth.uid()));

create policy "dealer users can manage customers"
on customers for all
using (dealership_id in (select dealership_id from profiles where id = auth.uid()))
with check (dealership_id in (select dealership_id from profiles where id = auth.uid()));

create policy "dealer users can manage pages"
on customer_pages for all
using (dealership_id in (select dealership_id from profiles where id = auth.uid()))
with check (dealership_id in (select dealership_id from profiles where id = auth.uid()));

create policy "public can read active pages"
on customer_pages for select
using (status = 'active');

create policy "dealer users can manage page vehicles"
on customer_page_vehicles for all
using (
  customer_page_id in (
    select id from customer_pages
    where dealership_id in (select dealership_id from profiles where id = auth.uid())
  )
)
with check (
  customer_page_id in (
    select id from customer_pages
    where dealership_id in (select dealership_id from profiles where id = auth.uid())
  )
);

create policy "public can read page vehicles"
on customer_page_vehicles for select
using (
  customer_page_id in (select id from customer_pages where status = 'active')
);

create policy "public can read vehicles for public pages"
on vehicles for select
using (
  id in (
    select vehicle_id from customer_page_vehicles
    where customer_page_id in (select id from customer_pages where status = 'active')
  )
);

create policy "public can insert page events"
on page_events for insert
with check (true);

create policy "dealer users can read page events"
on page_events for select
using (
  customer_page_id in (
    select id from customer_pages
    where dealership_id in (select dealership_id from profiles where id = auth.uid())
  )
);

create policy "dealer users can manage branding"
on dealership_branding for all
using (dealership_id in (select dealership_id from profiles where id = auth.uid()))
with check (dealership_id in (select dealership_id from profiles where id = auth.uid()));

create policy "public can read branding"
on dealership_branding for select
using (true);

create policy "dealer users can read subscriptions"
on subscriptions for select
using (dealership_id in (select dealership_id from profiles where id = auth.uid()));

create policy "dealer users can manage stock import sources"
on stock_import_sources for all
using (dealership_id in (select dealership_id from profiles where id = auth.uid()))
with check (dealership_id in (select dealership_id from profiles where id = auth.uid()));

create policy "dealer users can read ai generations"
on ai_generations for select
using (dealership_id in (select dealership_id from profiles where id = auth.uid()));
