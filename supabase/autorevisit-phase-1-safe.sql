alter table dealerships
add column if not exists plan_name text default 'starter',
add column if not exists tutorial_completed boolean default false,
add column if not exists tutorial_skipped boolean default false,
add column if not exists logo_url text,
add column if not exists primary_color text default '#B8FF3C',
add column if not exists secondary_color text default '#111315',
add column if not exists stock_sync_status text default 'not_started',
add column if not exists stock_sync_message text,
add column if not exists dealerkit_feed_url text;

alter table customer_pages
add column if not exists archived_at timestamptz,
add column if not exists page_goal text default 'general',
add column if not exists page_mood text default 'modern',
add column if not exists target_customer text default 'undecided buyer',
add column if not exists status text default 'live';

alter table vehicles
add column if not exists source_url text,
add column if not exists source_platform text,
add column if not exists source_vehicle_id text,
add column if not exists raw_data jsonb default '{}',
add column if not exists last_synced_at timestamptz,
add column if not exists sync_hash text,
add column if not exists features text[] default '{}';

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
