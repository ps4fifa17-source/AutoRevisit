alter table vehicles
add column if not exists deleted_at timestamptz,
add column if not exists updated_at timestamptz default now(),
add column if not exists image_urls jsonb default '[]',
add column if not exists tags jsonb default '[]',
add column if not exists features jsonb default '[]',
add column if not exists verified_facts jsonb default '{}';

alter table customer_pages
add column if not exists deleted_at timestamptz,
add column if not exists updated_at timestamptz default now(),
add column if not exists page_style text default 'simple',
add column if not exists push_angle text default 'reassurance',
add column if not exists buying_for text default 'themselves';

alter table dealerships
add column if not exists email text,
add column if not exists whatsapp text,
add column if not exists logo_url text,
add column if not exists primary_color text,
add column if not exists stock_source_url text,
add column if not exists updated_at timestamptz default now();
