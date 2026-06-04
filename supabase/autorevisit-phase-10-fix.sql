-- AutoRevisit Phase 10 Fix
-- Standardise public customer pages on status = 'live' and make old active rows public too.

alter table if exists customer_pages
  add column if not exists deleted_at timestamptz;

update customer_pages
set status = 'live'
where status = 'active';

-- Replace common public read policy if it exists. Safe to run more than once.
drop policy if exists "public can read active pages" on customer_pages;
drop policy if exists "public can read live pages" on customer_pages;

create policy "public can read live pages"
on customer_pages
for select
using (
  status = 'live'
  and deleted_at is null
);
