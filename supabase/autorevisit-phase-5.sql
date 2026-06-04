alter table customer_pages
add column if not exists buying_for text default 'themselves',
add column if not exists push_angle text default 'reassurance',
add column if not exists page_style text default 'simple',
add column if not exists ai_short_cards jsonb default '[]',
add column if not exists ai_microcopy jsonb default '{}',
add column if not exists deleted_at timestamptz,
add column if not exists updated_at timestamptz default now();

alter table customers
add column if not exists buying_for text default 'themselves',
add column if not exists email text,
add column if not exists phone text;

alter table vehicles
add column if not exists dvla_data jsonb default '{}',
add column if not exists registration_lookup_status text,
add column if not exists lookup_source text,
add column if not exists colour text,
add column if not exists engine_capacity text,
add column if not exists co2_emissions text,
add column if not exists tax_status text,
add column if not exists mot_status text,
add column if not exists month_of_first_registration text;
