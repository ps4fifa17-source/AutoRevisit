-- AutoRevisit production public page fix
-- Run this in Supabase SQL editor if newly created /p/... pages show 404 on the live site.
-- It aligns public read policies with the app using status = 'live'.

alter table if exists public.customer_pages enable row level security;
alter table if exists public.customer_page_vehicles enable row level security;
alter table if exists public.vehicles enable row level security;

drop policy if exists "Public can read live customer pages" on public.customer_pages;
drop policy if exists "Public can read active customer pages" on public.customer_pages;
drop policy if exists "public read active pages" on public.customer_pages;
drop policy if exists "public can read active pages" on public.customer_pages;

create policy "Public can read live customer pages"
on public.customer_pages
for select
using (
  deleted_at is null
  and coalesce(status, 'live') in ('live', 'active', 'published')
);

drop policy if exists "Public can read live customer page vehicle links" on public.customer_page_vehicles;

create policy "Public can read live customer page vehicle links"
on public.customer_page_vehicles
for select
using (
  exists (
    select 1
    from public.customer_pages cp
    where cp.id = customer_page_vehicles.customer_page_id
      and cp.deleted_at is null
      and coalesce(cp.status, 'live') in ('live', 'active', 'published')
  )
);

drop policy if exists "Public can read vehicles linked to live customer pages" on public.vehicles;

create policy "Public can read vehicles linked to live customer pages"
on public.vehicles
for select
using (
  exists (
    select 1
    from public.customer_page_vehicles cpv
    join public.customer_pages cp on cp.id = cpv.customer_page_id
    where cpv.vehicle_id = vehicles.id
      and cp.deleted_at is null
      and coalesce(cp.status, 'live') in ('live', 'active', 'published')
  )
);
