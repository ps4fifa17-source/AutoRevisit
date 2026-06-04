alter table dealerships
add column if not exists plan_name text default 'starter',
add column if not exists setup_status text default 'pending',
add column if not exists admin_notes text,
add column if not exists stock_source_url text,
add column if not exists dealerkit_feed_url text,
add column if not exists stock_sync_status text default 'not_started',
add column if not exists stock_sync_message text;

alter table vehicles
add column if not exists source_url text,
add column if not exists source_platform text,
add column if not exists source_vehicle_id text,
add column if not exists raw_data jsonb default '{}',
add column if not exists last_synced_at timestamptz,
add column if not exists sync_hash text,
add column if not exists features text[] default '{}',
add column if not exists status text default 'available',
add column if not exists verified_facts jsonb default '{}',
add column if not exists ai_scores jsonb default '{}',
add column if not exists ai_summary jsonb default '{}',
add column if not exists lookup_source text,
add column if not exists vrm text;

alter table customer_pages
add column if not exists archived_at timestamptz,
add column if not exists page_goal text default 'general',
add column if not exists page_mood text default 'modern',
add column if not exists target_customer text default 'undecided buyer',
add column if not exists status text default 'live',
add column if not exists ai_headline text,
add column if not exists ai_intro text,
add column if not exists ai_selling_points text[] default '{}',
add column if not exists ai_cta text;

create table if not exists page_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  customer_page_id uuid references customer_pages(id) on delete cascade,
  event_type text not null default 'view',
  metadata jsonb default '{}'
);

alter table page_events enable row level security;

drop policy if exists "allow public page event insert" on page_events;
create policy "allow public page event insert"
on page_events for insert
to public
with check (true);

drop policy if exists "dealer users can read own page events" on page_events;
create policy "dealer users can read own page events"
on page_events for select
using (
  customer_page_id in (
    select cp.id
    from customer_pages cp
    join profiles p on p.dealership_id = cp.dealership_id
    where p.id = auth.uid()
  )
);

create table if not exists thank_you_pages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  dealership_id uuid references dealerships(id) on delete cascade,
  vehicle_id uuid references vehicles(id) on delete set null,
  customer_id uuid references customers(id) on delete set null,
  slug text not null,
  title text,
  message text,
  handover_image_url text,
  status text default 'live',
  review_url text,
  metadata jsonb default '{}'
);

alter table thank_you_pages enable row level security;

drop policy if exists "dealer users can manage own thank you pages" on thank_you_pages;
create policy "dealer users can manage own thank you pages"
on thank_you_pages for all
using (
  dealership_id in (
    select dealership_id from profiles where id = auth.uid()
  )
)
with check (
  dealership_id in (
    select dealership_id from profiles where id = auth.uid()
  )
);

drop policy if exists "public can view thank you pages" on thank_you_pages;
create policy "public can view thank you pages"
on thank_you_pages for select
to public
using (status = 'live');
