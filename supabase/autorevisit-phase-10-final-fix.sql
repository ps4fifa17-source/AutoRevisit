-- AutoRevisit Phase 10 Final Fix
-- Safe helper migration for public customer pages.
-- Run only if public pages are not loading because status policies expect 'active'.

alter table if exists public.customer_pages
  alter column status set default 'live';

-- Keep old rows consistent if any were created as active.
update public.customer_pages
set status = 'live'
where status = 'active';

-- If you use RLS policies, make sure public live pages are readable.
-- Existing policies with the same name may need removing manually depending on your Supabase setup.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'customer_pages'
      and policyname = 'Public can read live customer pages'
  ) then
    create policy "Public can read live customer pages"
    on public.customer_pages
    for select
    using (status = 'live' and deleted_at is null);
  end if;
end $$;
