-- AutoRevisit Phase 11: Admin stock feed linking
-- Run this once in Supabase SQL editor before using the stock sync UI.

alter table dealerships
  add column if not exists stock_feed_type text default 'manual',
  add column if not exists stock_feed_url text,
  add column if not exists last_stock_sync_at timestamptz,
  add column if not exists last_stock_sync_status text,
  add column if not exists last_stock_sync_message text;

alter table vehicles
  add column if not exists source_platform text,
  add column if not exists source_vehicle_id text,
  add column if not exists source_url text,
  add column if not exists raw_data jsonb,
  add column if not exists sync_hash text,
  add column if not exists last_synced_at timestamptz,
  add column if not exists deleted_at timestamptz;

create index if not exists vehicles_dealership_source_idx
  on vehicles (dealership_id, source_platform, source_vehicle_id);

create index if not exists vehicles_dealership_reg_idx
  on vehicles (dealership_id, reg);

create index if not exists dealerships_stock_feed_type_idx
  on dealerships (stock_feed_type);
