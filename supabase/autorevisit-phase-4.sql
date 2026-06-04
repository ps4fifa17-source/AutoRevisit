alter table customer_pages
add column if not exists deleted_at timestamptz,
add column if not exists updated_at timestamptz default now();
